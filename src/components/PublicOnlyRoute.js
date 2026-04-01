import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicOnlyRoute({ children }) {
  const { authLoading, isAuthenticated } = useAuth();

  if (authLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicOnlyRoute;
