// src/pages/SignupPage.jsx
import { useState } from "react";
import Signup from "../components/Signup";

const SignupPage = () => {
  const [role, setRole] = useState("");

  return (
<>
<Signup role={role} />
</>

  );
};

export default SignupPage;
