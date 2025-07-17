import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles, user, loadingUser }) => {
  if (loadingUser) return null; 

  if (!user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
