// src/components/Signup.jsx
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import animationData from "../assets/login-animation.json";
import styles from "./css/Signup.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate, faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("All fields are required.");
      return;
    }
    if (!/^[^@]+@[^@]+\.com$/.test(email)) {
      alert("Please enter a valid email");
      return;
    }
    if (password.length < 4) {
      alert("Password should be at least 4 characters long.");
      return;
    }

    try {
      const formData = { name, email, password, role };
      await axios.post("http://localhost:8080/signup", formData);
      alert("Signup successful. You can now login.");
      navigate(`/login/${role}`);
    } catch (err) {
      alert("Signup failed");
      console.log("Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupHeader}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <h1 className={styles.welcomeText}>
          Welcome to <span>DoubtSync</span>
        </h1>
      </div>

      <div className={styles.signupBody}>
        <div className={styles.signupLeft}>
          <Lottie animationData={animationData} loop={true} />
        </div>

        <div className={styles.signupRight}>
          <div className={styles.signupBox}>
            <h2 className={styles.signupHeading}>
              Signup as{" "}
              <span className={styles.signupRole}>
                {role === "student" && (
                  <>
                    Student <FontAwesomeIcon icon={faUserGraduate} style={{ marginLeft: "14px" }} />
                  </>
                )}
                {role === "teacher" && (
                  <>
                    Teacher <FontAwesomeIcon icon={faChalkboardTeacher} style={{ marginLeft: "8px" }} />
                  </>
                )}
              </span>
            </h2>

            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Name"
                className={styles.formInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className={styles.formInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button onClick={handleSignup} className={styles.signupButton}>
                Sign Up
              </button>
            </div>

            <p className={styles.loginText}>
              Already have an account?{" "}
              <Link to={`/login/${role}`} className={styles.loginLink}>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
