import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoChat from "../components/VideoChat";

const VideoChatWrapper = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const callEnded = localStorage.getItem("callEnded");
    if (callEnded === "true") {
      localStorage.removeItem("callEnded"); 
      setShouldRender(false); // ye rendering prevent karega
      if (role === "student") {
        navigate("/student-dashboard", { replace: true });
      } else {
        navigate("/teacher-dashboard", { replace: true });
      }
    }
  }, [navigate, role]);

  if (!shouldRender) return null;

  return (
    <VideoChat roomId={roomId} isCaller={role === "student"} />
  );
};

export default VideoChatWrapper;
