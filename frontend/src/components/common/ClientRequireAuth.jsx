import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ClientRequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo || !userInfo.token) {
    console.error("Authentication token missing.");
    return <Navigate to="/auth/login" replace />;
  }

  const token = userInfo.token;

  if (!token || !user || user.role !== "user") {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ClientRequireAuth;
