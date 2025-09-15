// src/pages/logout.tsx
import React, { useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firestore/config"; // הנתיב לפי איפה ששמת את config

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        // התנתקות מ־Firebase
        await signOut(auth);

        // נקה נתונים מקומיים אם יש (session/local storage)
        sessionStorage.clear();
        localStorage.clear();

        // נווט חזרה למסך התחברות
        navigate("/login");
      } catch (error) {
        console.error("❌ Logout error:", error);
        navigate("/login"); // Even in case of error, return to Login
      }
    };

    doLogout();
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Logging out of the system...
      </Typography>
      <CircularProgress />
    </Box>
  );
};

export default Logout;