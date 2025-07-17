import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./css/TeacherSkillSelect.module.css";
import StudentNavBar from "./StudentNavBar";

const subjectOptions = [
              "DSA", "Web Dev", "AL-ML", "UI-UX",
              "DBMS", "OOPS", "SYSTEM DESIGN",
              "NETWORKING", "CARRER"
            ]

const TeacherSkillSelect = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const toggleSkill = (subject) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSaveSkills = async () => {
    try {
      await axios.put(`http://localhost:8080/user/${userId}`, { subjects });
      alert("Skills saved!");
      navigate("/teacher-dashboard");
    } catch (err) {
      alert("Error saving skills");
      console.error(err);
    }
  };

  return (
    <>
      <StudentNavBar />
      
      <div className={styles.teacherSubjectSelect}>
        <h2>Select Your Skills</h2>

        <div className={styles.skillGrid}>
          {subjectOptions.map((subject) => (
            <div
              key={subject}
              className={`${styles.skillBox} ${
                subjects.includes(subject) ? styles.selected : ""
              }`}
              onClick={() => toggleSkill(subject)}
            >
              {subject}
            </div>
          ))}
        </div>

        <button className={styles.saveSkillsBtn} onClick={handleSaveSkills}>
          Save Skills
        </button>
      </div>
    </>
  );
};

export default TeacherSkillSelect;
