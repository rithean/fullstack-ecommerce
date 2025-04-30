import { Navigate } from "react-router-dom";

const RequireAuth = ({ user, children, redirectTo = "/auth/login" }) => {
  if (!user) return <Navigate to={redirectTo} replace />;
  return children;
};

export default RequireAuth;
