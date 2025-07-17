import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import Lottie from "lottie-react";
import animationData from "../assets/login-animation.json"; 
import styles from "./css/Login.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate, faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";

const Login = ({ setUser }) => {
  const { role } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/login",
        { email, password },
        { withCredentials: true }
      );

      const loginUser = res.data.user;

      if (loginUser.role !== role) {
        alert(`This account is not a ${role}`);
        return;
      }

      localStorage.setItem("userId", loginUser.id);
      localStorage.setItem("userName", loginUser.name);
      localStorage.setItem("role", loginUser.role);
      setUser(loginUser);

      socket.emit("register_socket", { userId: loginUser.id });

      const fullUserRes = await axios.get(`http://localhost:8080/user/${loginUser.id}`);
      const fullUser = fullUserRes.data.user;

      setTimeout(() => {
        if (fullUser.role === "student") {
          navigate("/student-dashboard");
        } else if (fullUser.role === "teacher") {
          if (!fullUser.subjects || fullUser.subjects.length === 0) {
            navigate("/teacher/choose-skills");
          } else {
            navigate("/teacher-dashboard");
          }
        }
      }, 100);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      alert(message);
      console.error("Login Error:", message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Top Header */}  
      <div className={styles.loginHeader}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>← Back</button>
        <h1 className={styles.welcomeText}>Welcome to <span>DoubtSync</span></h1>
      </div>

      <div className={styles.loginBody}>
        {/* Left: Lottie animation */}
        <div className={styles.loginLeft}>
          <Lottie animationData={animationData} loop={true} />
        </div>

        {/* Right: Login form */}
        <div className={styles.loginRight}>
          <div className={styles.loginBox}>
            <h2 className={styles.loginHeading}>
              Login as{" "}
              <span className={styles.loginRole}>
                {role === "student" && (
                  <>
                    Student
                    <FontAwesomeIcon icon={faUserGraduate} style={{ marginLeft: "14px" }} />
                  </>
                )}
                {role === "teacher" && (
                  <>
                    Teacher
                    <FontAwesomeIcon icon={faChalkboardTeacher} style={{ marginLeft: "8px" }} />
                  </>
                )}
              </span>
            </h2>

            <form
              className={styles.formGroup}
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <input
                type="email"
                placeholder="Email"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className={styles.formInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button type="submit" className={styles.loginButtonOnLoginPage}>
                Login
              </button>
            </form>

            <p className={styles.signupText}>
              Don’t have an account?{" "}
              <Link to={`/signup/${role}`} className={styles.signupLink}>
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
