// src/pages/NotFound.jsx
import React from "react";
import styles from "../components/css/NotFound.module.css";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Oops! Page Not Found</p>
        <p className={styles.message}>
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link to="/" className={styles.homeButton}>
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
