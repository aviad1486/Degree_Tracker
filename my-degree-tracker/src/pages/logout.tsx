import React, { useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // כאן בהמשך נוכל לנקות sessionStorage / localStorage אם נשמור שם את פרטי המשתמש
    // כרגע זה רק סימולציה
    setTimeout(() => {
      navigate("/login"); // החזרה למסך ההתחברות
    }, 1500);
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
        מתנתק מהמערכת...
      </Typography>
      <CircularProgress />
    </Box>
  );
};

export default Logout;
