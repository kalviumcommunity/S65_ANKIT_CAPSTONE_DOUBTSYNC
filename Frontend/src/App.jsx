// src/App.jsx
import { useEffect, useState } from "react";
import AppRouter from "./routes/AppRouter";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import styles from './components/css/App.module.css'; 
const App = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.log(" Auth error:", err.response?.data?.message || err.message);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

if (loadingUser) {
  return (
    <div className={styles.spinnerWrapper}>
      <FaSpinner className={styles.spinnerIcon} />
      <span className={styles.spinnerText}>Loading...</span>
    </div>
  );
}


  return <AppRouter user={user} setUser={setUser} loadingUser={loadingUser} />;
};

export default App;
