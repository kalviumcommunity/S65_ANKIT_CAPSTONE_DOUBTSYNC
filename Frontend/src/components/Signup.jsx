// src/components/Signup.jsx
import { useState } from "react";
import axios from "axios";

const Signup = ({ role }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const formData = { name, email, password, role }; // ✅ include role here
      await axios.post("http://localhost:8080/signup", formData);
      alert("Signup successful. You can now login.");
    } catch (err) {
      alert("Signup failed");
      console.log("Error:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h3>Signup as {role}</h3>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
