import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useUserRole } from "../hooks/useUserRole";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, error } = useUserRole();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Authentication error: {error.message}
        </Alert>
      </Box>
    );
  }

  if (!user) {
    // אם אין משתמש מחובר → נשלח ל־Login
    return <Navigate to="/login" replace />;
  }

  if (!user.isActive) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Your account has been deactivated. Please contact an administrator.
        </Alert>
      </Box>
    );
  }

  // אחרת → נציג את התוכן
  return <>{children}</>;
};

export default ProtectedRoute;