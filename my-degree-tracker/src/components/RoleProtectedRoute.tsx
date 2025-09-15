import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useUserRole } from "../hooks/useUserRole";
import type { UserPermissions } from "../models/User";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredPermission?: keyof UserPermissions;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requiredPermission,
  fallbackPath = "/login"
}) => {
  const { user, loading, error, isAdmin, hasPermission } = useUserRole();

  // Show loading spinner while checking authentication and roles
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

  // Show error if there's an authentication error
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Authentication error: {error.message}
        </Alert>
      </Box>
    );
  }

  // If no user is authenticated, redirect to login
  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // If user is not active, show access denied
  if (!user.isActive) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Your account has been deactivated. Please contact an administrator.
        </Alert>
      </Box>
    );
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Administrator privileges required.
        </Alert>
      </Box>
    );
  }

  // If specific permission is required but user doesn't have it
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. You don't have permission to view this page.
        </Alert>
      </Box>
    );
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;