import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);
  const currentLocation = useLocation(); 

  if (!user) {
    // If no user, redirect to login
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role.toLowerCase();
  if (
    userRole === "cashier" &&
    currentLocation.pathname.startsWith("/manager")
  ) {//this way manager can access cashier but cashier cannot access manager
    return <Navigate to="/cashier" replace />;
  }

  return children;
}
