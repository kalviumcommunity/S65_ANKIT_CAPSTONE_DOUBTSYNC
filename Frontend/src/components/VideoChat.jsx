import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import ChatRoom from "./ChatRoom";
import { useNavigate } from "react-router-dom";
import logo from "../assets/doubtsync-logo.svg";

import styles from "./css/VideoChat.module.css"; 

const VideoChat = ({ isCaller, roomId }) => {
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidates = useRef([]);

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval;
    if (startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    // Reset video state on mount
        setCameraOn(true);
    setMicOn(true);
    setStartTime(null);
    setElapsed(0);


    if (!roomId) return;




     const start = async () => {
    try {
      console.log("🎥 Starting video chat setup...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      stream.getVideoTracks()[0].enabled = cameraOn;
      stream.getAudioTracks()[0].enabled = micOn;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      localStreamRef.current = stream;

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerRef.current = peer;

      // Setup ontrack BEFORE setting remote description
      peer.ontrack = (event) => {
        console.log("🎥 Received remote track");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream); //  Add local tracks
      });

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { candidate: event.candidate, roomId });
        }
      };

      peer.oniceconnectionstatechange = () => {
        if ((peer.iceConnectionState === "connected" || peer.iceConnectionState === "completed") && !startTime) {
          setStartTime(Date.now());
        }
      };

      //  Caller side
      if (isCaller) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("offer", { offer, roomId });
      }

      //  Handle Offer
      socket.on("offer", async ({ offer, roomId: incomingRoom }) => {
        if (incomingRoom !== roomId) return;

        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        for (const candidate of pendingCandidates.current) {
          await peer.addIceCandidate(candidate);
        }
        pendingCandidates.current = [];

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer", { answer, roomId });
      });

      //  Handle Answer
      socket.on("answer", async ({ answer, roomId: incomingRoom }) => {
        if (incomingRoom !== roomId) return;

        await peer.setRemoteDescription(new RTCSessionDescription(answer));
        for (const candidate of pendingCandidates.current) {
          await peer.addIceCandidate(candidate);
        }
        pendingCandidates.current = [];
      });

      //  Handle ICE Candidates
      socket.on("ice-candidate", async ({ candidate, roomId: incomingRoom }) => {
        if (incomingRoom !== roomId) return;

        const iceCandidate = new RTCIceCandidate(candidate);

        if (!peerRef.current?.remoteDescription || !peerRef.current.remoteDescription.type) {
          pendingCandidates.current.push(iceCandidate);
        } else {
          try {
            await peerRef.current.addIceCandidate(iceCandidate);
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        }
      });
    } catch (error) {
      console.error("Error starting video chat:", error);
    }
  };

  if (roomId) {
    start();
  }

  return () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerRef.current?.close();
    peerRef.current = null;
    localStreamRef.current = null;

    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");
    socket.off("user_ready");
    socket.off("joined_room_ack");
  };
}, [roomId]);

  useEffect(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      const audioTrack = localStreamRef.current.getAudioTracks()[0];

      if (videoTrack) videoTrack.enabled = cameraOn;
      if (audioTrack) audioTrack.enabled = micOn;
    }
  }, [cameraOn, micOn]);

  useEffect(() => {
    socket.on("user_left", () => {
      console.log("📩 Received user_left event");
      alert("⚠️ The other user has left the call.");
      setTimeout(() => {
        handleEndCall();
      }, 100);
    });

    return () => {
      socket.off("user_left");
    };
  }, []);

  const handleEndCall = () => {
    socket.emit("leave_room", { roomId });
    localStorage.setItem("callEnded", "true");

    setTimeout(() => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      peerRef.current?.close();

      setCameraOn(false);
      setMicOn(false);

      const role = localStorage.getItem("role");
      if (role === "student") {
        navigate("/student-dashboard", { replace: true });
      } else if (role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/");
      }
    }, 300);
  };

  return (
    <div className={styles.videochatWrapper}>
      <nav className={styles.navbar}>
        <div className={styles.logoSection}>
          <div className={styles.logoWrapper}>
            <img src={logo} alt="DoubtSync Logo" className={styles.logoIcon} />
          </div>
          <span className={styles.brandName}>DoubtSync</span>
        </div>

        <div className={styles.navbarRightControls}>
          <div className={styles.callTimer}>{formatTime(elapsed)}</div>
          <button className={styles.endCallButton} onClick={handleEndCall}>End Call</button>
        </div>
      </nav>

      <div className={styles.videochatContainer}>
        <div className={styles.remoteVideoSection}>
          <div className={styles.participantLabel}>Other Person</div>
          <video ref={remoteVideoRef} autoPlay playsInline className={styles.remoteVideo} />

          <div className={styles.controlsOverlay}>
            <button className={styles.controlButton} onClick={() => setMicOn(prev => !prev)}>
              {micOn ? (
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z" /></svg>
              )}
            </button>
            <button className={styles.controlButton} onClick={() => setCameraOn(prev => !prev)}>
              {cameraOn ? (
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
                  <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.localVideoSection}>
            <div className={styles.localLabel}>You</div>
            <video ref={localVideoRef} autoPlay muted playsInline className={styles.localVideo} />
          </div>

          <div className={styles.chatSection}>
            <ChatRoom roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
