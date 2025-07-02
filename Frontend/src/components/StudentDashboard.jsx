import socket from "../socket";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import ChatRoom from "./chatRoom";

const StudentDashboard = () => {

  const [roomId,setRoomId]=useState(null)
  const userName=localStorage.getItem("userName")
useEffect(() => {
  socket.on("doubt_accepted", ({ doubtId }) => {
    console.log("✅ Doubt accepted. Join room:", doubtId);
    setRoomId(doubtId);
    socket.emit("join_room", { roomId: doubtId });
  });

  return () => socket.off("doubt_accepted");
}, []);


const handleAskDoubt = async () => {
    const res = await axios.post(
      "http://localhost:8080/ask-doubt",
      {
        question: "Explain roadmap for mern stack",
        subject: "Web Dev",
        studentSocketId: socket.id,
      },
      { withCredentials: true }
    );
    console.log(res.data);
  };

  return (
  <>
    {!roomId && <button onClick={handleAskDoubt}>Ask Doubt</button>}
    {roomId && <ChatRoom roomId={roomId} />}
  </>
  )
};

export default StudentDashboard;
