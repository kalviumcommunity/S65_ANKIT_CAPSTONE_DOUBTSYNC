import socket from "../socket";
import axios from "axios";
import { useState, useEffect } from "react";
import ChatRoom from "./ChatRoom";
import VideoChat from "./VideoChat";
import styles from "./css/StudentDashboard.module.css"; 
import StudentNavBar from "./StudentNavBar";
import { useNavigate } from "react-router-dom";

import { Player } from "@lottiefiles/react-lottie-player";
import LogoAnimation from "../assets/lottie-logo-top-right.json";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState(null);
  const [question, setQuestion] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isConnected, setIsConnected] = useState(false);
  const [isWaitingForTutor, setIsWaitingForTutor] = useState(false);

  const userName = localStorage.getItem("userName");


useEffect(() => {

    localStorage.removeItem("callEnded");
    setRoomId(null);
    setIsConnected(false);

const handleDoubtAccepted = ({ doubtId, teacherSocketId }) => {
  console.log(" Doubt accepted by teacher:", teacherSocketId);
  
  // sabhi waiting state ko clear kar rahe h pahe --
  setIsSending(false);
  setIsWaitingForTutor(false);
  setCountdown(0);
  setIsConnected(true);   // connected ko true kar rahe,before joining

  setRoomId(doubtId);
  socket.emit("join_room", { roomId: doubtId });
};


  const handleRoomJoined = ({ roomId }) => {
    console.log("✅ Student joined room:", roomId);
    setIsConnected(true);
    navigate(`/room/${roomId}`, { replace: true });
  };


  socket.on("doubt_accepted", handleDoubtAccepted);
  socket.on("joined_room_ack", handleRoomJoined);


  return () => {
    socket.off("doubt_accepted", handleDoubtAccepted);
    socket.off("joined_room_ack", handleRoomJoined);
  };
}, [navigate]);


useEffect(() => {
  let timer;
  if (isSending && countdown > 0 && !isConnected) { 
    timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
  } else if (countdown === 0 && !isConnected) { 
    setIsSending(false);
    setIsWaitingForTutor(false);
    alert("⏳ Currently No available tutor is there for this subject, Please Try again later.");
  }
  return () => clearTimeout(timer);
}, [isSending, countdown, isConnected]); 

  useEffect(() => {
    let interval;
    if (isSending && roomId) {
      interval = setInterval(async () => {
        try {
          await axios.post(
            "http://localhost:8080/try-assign-teacher",
            { doubtId: roomId },
            { withCredentials: true }
          );
          console.log("🔁 Retried to find tutor...");
        } catch (err) {
          if (err.response && err.response.status === 404) {
            console.warn("⚠️ Doubt already routed to a tutor. Stopping polling...");
            clearInterval(interval);
            setIsWaitingForTutor(true);
          } else {
            console.error("Polling error", err);
          }
        }
      }, 10000);
    }

    return () => clearInterval(interval);
  }, [isSending, roomId]);

  const handleAskDoubt = async () => {
    if (!question.trim() || !selectedSubject)
      return alert("Please enter a question and select one subject.");

    try {
      const res = await axios.post(
        "http://localhost:8080/ask-doubt",
        {
          question,
          subject: selectedSubject,
          studentSocketId: socket.id,
        },
        { withCredentials: true }
      );

      console.log(res.data);

      setRoomId(res.data.doubtId);
      setIsSending(true);
      setCountdown(60);
      setIsConnected(false);
      setIsWaitingForTutor(false);
    } catch (error) {
      console.error(error);
      alert("Failed to send doubt.");
    }
  };



  return (
    <>
      <StudentNavBar />

      <div className={styles.dashboardContainer}>
        {!isConnected && (
          <>
            <div className={styles.textAndAskContainerCombined}>
              <h2 className={styles.dashboardGreeting}>
                Got a doubt, {userName}? Let's clear it up! 💡
                <span className={styles.inlineLottie}>
                  <Player
                    autoplay
                    loop
                    src={LogoAnimation}
                    style={{ height: "40px", width: "40px" }}
                  />
                </span>
              </h2>

              <div className={styles.askDoubtContainer}>
                <h2>Ask Your Doubt</h2>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question..."
                ></textarea>

                <div className={styles.subjectOptions}>
                  {[
                    "DSA",
                    "Web Dev",
                    "AL-ML",
                    "UI-UX",
                    "DBMS",
                    "OOPS",
                    "SYSTEM DESIGN",
                    "NETWORKING",
                    "CARRER",
                  ].map((sub) => (
                    <button
                      key={sub}
                      className={`${styles.subjectBtn} ${
                        selectedSubject === sub ? styles.selected : ""
                      }`}
                      onClick={() => setSelectedSubject(sub)}
                      disabled={isSending}
                    >
                      {sub}
                    </button>
                  ))}
                </div>

                <button
                  className={styles.askBtn}
                  onClick={handleAskDoubt}
                  disabled={isSending}
                >
                  Ask Doubt
                </button>
              </div>
            </div>
          </>
        )}

        {isSending && (
          <div className={styles.connectingModal}>
            <div className={styles.modalBox}>
              <p>
                {isWaitingForTutor
                  ? "Waiting for tutor to accept..."
                  : "Connecting to tutor..."}
              </p>
              <div className={styles.timerCircle}>{countdown}s</div>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setIsSending(false);
                  setIsWaitingForTutor(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentDashboard;
