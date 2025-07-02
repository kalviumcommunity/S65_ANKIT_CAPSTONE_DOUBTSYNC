// components/Login.jsx
import { useState } from "react";
import axios from "axios";
import socket from "../socket";

const Login = ({ role, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/login",
        { email, password },
        { withCredentials: true }
      );

      const user = res.data.user;

      if (user.role !== role) {
        alert(`This account is not a ${role}`);
        return;
      }

      localStorage.setItem("userId", user.id);
       localStorage.setItem("userName", user.name); 
      setUser(user);

      socket.emit("register_socket", { userId: user.id });
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h3>Login as {role}</h3>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
