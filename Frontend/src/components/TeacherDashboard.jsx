// src/pages/TeacherDashboard.jsx
import { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";
import ChatRoom from "./chatRoom";

const TeacherDashboard = () => {
  const [incomingDoubt, setIncomingDoubt] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  const [roomId, setRoomId] = useState(null);
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    socket.on("incoming_doubt", (doubtData) => {
      setIncomingDoubt(doubtData);
    });

    // Fetch current availability
    const fetchAvailability = async () => {
      try {
        const res = await axios.get("/showuser", { withCredentials: true });
        const teacherId = localStorage.getItem("userId");
        const teacher = res.data.allUsers.find((u) => u._id === teacherId);
        if (teacher) setIsAvailable(teacher.isAvailable);
      } catch (err) {
        console.error("Error fetching teacher data", err);
      }
    };

    fetchAvailability();

    return () => {
      socket.off("incoming_doubt");
    };
  }, []);

  const toggleAvailability = async () => {
    try {
      const updatedStatus = !isAvailable;
      await axios.put(
        "http://localhost:8080/updateprofile",
        { isAvailable: updatedStatus },
        { withCredentials: true }
      );
      setIsAvailable(updatedStatus);
    } catch (error) {
      console.error("Failed to update availability", error);
    }
  };

  const handleAccept = () => {
    socket.emit("accept_doubt", {
      doubtId: incomingDoubt.doubtId,
      studentSocketId: incomingDoubt.studentSocketId,

     
    });

    socket.emit("join_room", { roomId: incomingDoubt.doubtId });
    setRoomId(incomingDoubt.doubtId);
  };

  return (
    <div>
      <h2>Teacher Dashboard</h2>

      <button onClick={toggleAvailability}>
        {isAvailable ? "Set Unavailable" : "Set Available"}
      </button>

      {!roomId && incomingDoubt && (
        <div>
          <p>Student: {incomingDoubt.studentName}</p>
          <p>Q: {incomingDoubt.question}</p>
          <button onClick={handleAccept}>Accept</button>
        </div>
      )}
      {roomId && <ChatRoom roomId={roomId}/>}
    </div>
  );
};

export default TeacherDashboard;
