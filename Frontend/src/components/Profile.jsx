import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./css/Profile.module.css";
import StudentNavBar from "./StudentNavBar";
import Lottie from "lottie-react";
import animationData from "../assets/update.json";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
  });

  const [editMode, setEditMode] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/user/${userId}`);
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/user/${userId}`, user);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating profile");
    }
  };

  return (
    <>
      <StudentNavBar />
      <div className={styles.profilePage}>
        <button className={styles.goBackBtn} onClick={() => navigate(-1)}>
          ← Go Back
        </button>

        <main className={styles.profileWrapper}>
          <div className={styles.profileLeft}>
            <Lottie animationData={animationData} loop={true} />
          </div>

          <div className={styles.profileContainer}>
            <h2 className={styles.profileTitle}>My Profile</h2>

            <div className={styles.profileForm}>
              <label>Name</label>
              <input
                type="text"
                value={user.name}
                readOnly={!editMode}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />

              <label>Email</label>
              <input type="email" value={user.email} readOnly />

              <label>Location</label>
              <input
                type="text"
                value={user.location || ""}
                readOnly={!editMode}
                onChange={(e) =>
                  setUser({ ...user, location: e.target.value })
                }
              />

              <label>Phone</label>
              <input
                type="tel"
                value={user.phone || ""}
                readOnly={!editMode}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />

              <div className={styles.profileButtons}>
                {editMode ? (
                  <>
                    <button className={styles.saveBtn} onClick={handleSave}>
                      Save
                    </button>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className={styles.editBtn}
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
