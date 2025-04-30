import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
// import RequireAuth from "../common/RequireAuth";

export const AdminRequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user || user.role !== "admin") {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};
