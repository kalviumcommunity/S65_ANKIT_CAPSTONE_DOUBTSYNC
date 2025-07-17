import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import StudentDashboard from "../components/StudentDashboard";
import TeacherDashboard from "../components/TeacherDashboard";
import Profile from "../components/Profile";
import TeacherSkillSelect from "../components/TeacherSkillSelect";
import PremiumPage from "../pages/Premium";
import VideoChatWrapper from "../pages/VideoChatWrapper";
import ProtectedRoute from "../components/ProtectedRoute";

import NotFound from "../pages/NotFound";
const AppRouter = ({ user, setUser, loadingUser }) => {
  return (
    <Router>
      <Routes>

        {/* ===========   Public Routes   ================ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/:role" element={<LoginPage setUser={setUser} />} />
        <Route path="/signup/:role" element={<SignupPage />} />
        <Route path="/premium" element={<PremiumPage />} />



        {/* =========== Protected Routes — STUDENT only :-========== */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]} user={user} loadingUser={loadingUser}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ====== Protected Routes — TEACHER only :-======= */}
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute allowedRoles={["teacher"]} user={user} loadingUser={loadingUser}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/choose-skills"
          element={
            <ProtectedRoute allowedRoles={["teacher"]} user={user} loadingUser={loadingUser}>
              <TeacherSkillSelect />
            </ProtectedRoute>
          }
        />

        {/* ======= Shared Protected Routes (Both) :-========= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["student", "teacher"]} user={user} loadingUser={loadingUser}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <ProtectedRoute allowedRoles={["student", "teacher"]} user={user} loadingUser={loadingUser}>
              <VideoChatWrapper />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
