// src/components/ChatRoom.jsx
import { useState, useEffect } from "react";
import socket from "../socket";
import styles from './css/ChatRoom.module.css';

const ChatRoom = ({ roomId }) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const userName = localStorage.getItem("userName");

  useEffect(() => {
    socket.on("receive_message", ({ sender, message }) => {
      setChatLog((prev) => [...prev, { sender, message }]);
    });

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
      setMessage("");
    }
  };

  return (
    <div className={styles.chatroomContainer}>
      {/* Chat Header */}
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderContent}>
          <svg className={styles.chatLogoIcon} viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.chatHeaderTitle}>Chat</span>
        </div>
      </div>

      <div className={styles.chatMessages}>
        {chatLog.map((msg, idx) => (
          <div key={idx} className={`${styles.chatMessage} ${msg.sender === userName ? styles.sent : styles.received}`}>
            <div className={styles.messageSender}>
              {msg.sender === userName ? "You" : msg.sender}
            </div>
            <div className={styles.messageBubble}>{msg.message}</div>
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.chatMessage} ${styles.received}`}>
            <div className={styles.typingIndicator}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.chatInputArea}>
        <input
          className={styles.chatInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className={styles.sendButton} onClick={sendMessage}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
