import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firestore/config"; // הקובץ שלך

const Login: React.FC = () => {
  const [email, setEmail] = useState("");       // מייל של המשתמש
  const [password, setPassword] = useState(""); // סיסמה (בפרויקט שלך זה ה-ID)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // קריאה ל־Firebase Auth
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login success:", userCred.user);

      setLoading(false);
      navigate("/"); // מעביר לעמוד הבית
    } catch (err: any) {
      console.error("❌ Login error:", err.code, err.message);
      setLoading(false);

      // טיפול בשגיאות נפוצות
      if (err.code === "auth/invalid-email") {
        setError("כתובת האימייל אינה תקינה");
      } else if (err.code === "auth/user-not-found") {
        setError("משתמש לא נמצא במערכת");
      } else if (err.code === "auth/wrong-password") {
        setError("סיסמה שגויה");
      } else {
        setError("התחברות נכשלה, נסה שוב");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Card sx={{ width: 400 }}>
        {loading && <LinearProgress />}
        <CardContent>
          <Typography variant="h5" gutterBottom>
            התחברות 🔐
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              id="email"
              label="אימייל"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              id="password"
              label="סיסמה (תעודת זהות)"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              התחבר
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;