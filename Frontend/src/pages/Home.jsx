// components/Home.jsx
import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Home = ({ setUser }) => {
  const [action, setAction] = useState(""); // "login" or "signup"
  const [role, setRole] = useState("");     // "student" or "teacher"

  if (action && role) {
    return action === "login" ? (
      <Login role={role} setUser={setUser} />
    ) : (
      <Signup role={role} />
    );
  }

  return (
    <div>
      {!action && (
        <>
          <h2>Welcome to Doubt Solver</h2>
          <button onClick={() => setAction("login")}>Login</button>
          <button onClick={() => setAction("signup")}>Signup</button>
        </>
      )}

      {action && !role && (
        <>
          <h3>{action === "login" ? "Login as" : "Signup as"}:</h3>
          <button onClick={() => setRole("student")}>Student</button>
          <button onClick={() => setRole("teacher")}>Teacher</button>
          <br />
          <button onClick={() => { setAction(""); setRole(""); }}>🔙 Back</button>
        </>
      )}
    </div>
  );
};

export default Home;
