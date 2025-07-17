import { useState } from "react";
import { FaEnvelope, FaUserCircle, FaBars, FaSignOutAlt } from "react-icons/fa";
import { MdArrowDropDown, MdClose } from "react-icons/md";
import logo from "../assets/doubtsync-logo.svg";
import styles from "./css/StudentNavBar.module.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const StudentNavBar = () => {
  const role = localStorage.getItem("role");
  const dashboardPath = role === "teacher" ? "/teacher-dashboard" : "/student-dashboard";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const navigate = useNavigate();

  const handleProfileClick = () => {
    setSidebarOpen(false);
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:8080/logout", {}, {
        withCredentials: true
      });

      if (res.status === 200) {
        localStorage.clear();
        alert("Logout Successfull");
        navigate("/");
      } else {
        alert(res.data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <>
   
      <nav className={styles["student-navbar"]}>
        <div className={styles["navbar-left"]}>
          <FaBars className={styles["burger-icon"]} onClick={toggleSidebar} />
          <Link to={dashboardPath} className={styles["brand-link"]}>
            <img src={logo} alt="DoubtSync Logo" className={styles.logo} />
            <h1 className={styles["brand-name"]}>DoubtSync</h1>
          </Link>
        </div>

        <div className={styles["navbar-right"]}>
          {role === "student" && (
            <Link to="/premium">
              <button className={styles["premium-btn"]}>
                Get <span>Premium</span>
              </button>
            </Link>
          )}
        </div>
      </nav>

    

      {sidebarOpen && (
        <div
          className={`${styles["sidebar-overlay"]} ${styles.open}`}
          onClick={closeSidebar}
        ></div>
      )}





      {/*Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <div className={styles["sidebar-header"]}>
          <h2 className={styles["sidebar-title"]}>DoubtSync</h2>
          <MdClose className={styles["close-btn"]} onClick={toggleSidebar} />
        </div>

        <ul className={styles["sidebar-menu"]}>
          <li onClick={handleProfileClick}>
            <FaUserCircle className={styles["sidebar-icon"]} /> Profile
          </li>
          <li onClick={handleLogout}>
            <FaSignOutAlt className={styles["logout-icon"]} /> Logout
          </li>
        </ul>
      </div>
    </>
  );
};

export default StudentNavBar;
