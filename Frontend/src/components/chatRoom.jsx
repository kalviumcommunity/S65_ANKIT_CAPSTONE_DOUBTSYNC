// src/components/ChatRoom.jsx
import { useState, useEffect } from "react";
import socket from "../socket";

const ChatRoom = ({ roomId}) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

    const userName = localStorage.getItem("userName");
  useEffect(() => {
    socket.on("receive_message", ({ sender, message }) => {
        
      setChatLog((prev) => [...prev, { sender, message }]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", {
        roomId,
        sender: userName,
        message,
      });
    //   setChatLog((prev) => [...prev, { sender: userName, message }]);
      setMessage("");
    }
  };

 return (
    <div>
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
          padding: "10px",
        }}
      >
{chatLog.map((msg, idx) => {
  const isOwnMessage = msg.sender === userName;
  return (
    <div
      key={idx}
      style={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        marginBottom: "8px",
      }}
    >
      <div
        style={{
          backgroundColor: isOwnMessage ? "#dcf8c6" : "#f1f0f0",
          padding: "8px 12px",
          borderRadius: "16px",
          maxWidth: "60%",
        }}
      >
        <strong>{msg.sender}:</strong> {msg.message}
      </div>
    </div>
  );
})}

      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );

};

export default ChatRoom;
