import { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";
import VideoChat from "./VideoChat";
import styles from "./css/TeacherDashboard.module.css";
import StudentNavBar from "./StudentNavBar";

import { useNavigate } from "react-router-dom";


const TeacherDashboard = () => {
  const navigate = useNavigate();

  const [incomingDoubt, setIncomingDoubt] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/user/${userId}`);
        const user = res.data.user;
        setSubjects(user.subjects || []);
        setIsAvailable(user.isAvailable);
        setUserLoaded(true);
      } catch (err) {
        console.error("Error fetching teacher data", err);
      }
    };

    fetchUser();

    socket.on("incoming_doubt", (doubtData) => {
      setIncomingDoubt(doubtData);
    });

socket.on("doubt_taken", ({ doubtId }) => {
    setIncomingDoubt(prev => {
      if (prev && prev.doubtId === doubtId) {
        return null;   // doubt card ko remove kar rahe h
      }
      return prev;
    });
  });


  socket.on("doubt_already_taken", ({ doubtId }) => {
    alert("This doubt has already been accepted by another teacher");
    setIncomingDoubt(null);
  });

  return () => {
    socket.off("incoming_doubt");
    socket.off("doubt_taken");
    socket.off("doubt_already_taken");
  };
  }, []);




    useEffect(() => {
    // Clear any stale room data on mount
    localStorage.removeItem("callEnded");
    setRoomId(null);

    const handleJoinedRoom = ({ roomId: joinedRoomId }) => {
      console.log(" Teacher joined room:", joinedRoomId);
      setRoomId(joinedRoomId);
      navigate(`/room/${joinedRoomId}`, { replace: true });
    };

    socket.on("joined_room_ack", handleJoinedRoom);
    
    return () => {
      socket.off("joined_room_ack", handleJoinedRoom);
    };
  }, [navigate]); 







  const toggleAvailability = async () => {
    try {
      const updatedStatus = !isAvailable;
      await axios.put(`http://localhost:8080/user/${userId}`, {
        isAvailable: updatedStatus,
      });
      setIsAvailable(updatedStatus);
    } catch (error) {
      console.error("Failed to update availability", error);
    }
  };

const handleAccept = async () => {
  if (!incomingDoubt) return;

  try {
    console.log("🔄 Teacher accepting doubt:", incomingDoubt.doubtId);
    
    // Store doubtId before clearing incomingDoubt
    const doubtToAccept = incomingDoubt.doubtId;
    const studentToNotify = incomingDoubt.studentSocketId;

    // First emit accept_doubt
    socket.emit("accept_doubt", {
      doubtId: doubtToAccept,
      studentSocketId: studentToNotify
    });


    await new Promise(resolve => setTimeout(resolve, 500));  // room join karne se pahle wait kar rahe h


    console.log("🔄 Teacher joining room:", doubtToAccept);  // after acceptance , joining the room
    socket.emit("join_room", { roomId: doubtToAccept });
    
   
    setIncomingDoubt(null);  // incoming doubt ko clear kar rahe hai at last

  } catch (error) {
    console.error("Error accepting doubt:", error);
  }
};


  if (!userLoaded) return <p className={styles.loadingText}>Loading dashboard...</p>;

  return (
    <>
      <StudentNavBar />
      <div className={styles.dashboardContainer}>
        {!roomId && (
          <>
            <h2 className={styles.greeting}>
              👋 Welcome back, <span>{localStorage.getItem("userName")}</span>
            </h2>
<div className={styles.skillsBox}>
  <div className={styles.skillsHeader}>
    <h4>Your Skills</h4>
    <button
      className={styles.editSkillsBtn}
      onClick={() => window.location.href = "/teacher/choose-skills"}
    >
      Edit
    </button>
  </div>

  <div className={styles.skillsGrid}>
    {subjects.length === 0 ? (
      <p className={styles.noSkillsText}>No skills selected</p>
    ) : (
      subjects.map((sub, i) => (
        <span key={i} className={styles.skillTag}>{sub}</span>
      ))
    )}
  </div>
</div>


            <div className={styles.availabilitySection}>
              <label className={styles.toggleButton}>
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={toggleAvailability}
                />
                <span className={styles.toggleSlider}></span>
              </label>
              <div className={styles.statusIndicator}>
                <span className={isAvailable ? styles.greenDot : styles.redDot}></span>
                <span>
                  {isAvailable
                    ? "You're available to solve doubts"
                    : "You're currently unavailable"}
                </span>
              </div>
            </div>

            {incomingDoubt && (
              <div className={styles.doubtCard}>
                <h3>📩 New Doubt Request</h3>
                <p>
                  <strong>Student:</strong> {incomingDoubt.studentName}
                </p>
                <p>
                  <strong>Question:</strong> {incomingDoubt.question}
                </p>
                <button className={styles.acceptBtn} onClick={handleAccept}>
                  Accept Doubt
                </button>
              </div>
            )}
          </>
        )}


      </div>
    </>
  );
};

export default TeacherDashboard;
