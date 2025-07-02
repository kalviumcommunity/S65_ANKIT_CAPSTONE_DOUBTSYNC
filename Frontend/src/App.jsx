// App.jsx
import { useState } from "react";
import Home from "./pages/Home"
import StudentDashboard from "./components/StudentDashboard";

import TeacherDashboard from "./components/TeacherDashboard"
const App = () => {
  const [user, setUser] = useState(null);

  if (!user) return <Home setUser={setUser} />;

  return user.role === "student" ? (
    <StudentDashboard />
  ) : (
    <TeacherDashboard />
  );
};

export default App;
