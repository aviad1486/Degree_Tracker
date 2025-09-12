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

const Login: React.FC = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Mock user (בשלב מאוחר יותר יוחלף ב-Firestore/Firebase Auth)
  const mockUser = { id: "123456789", password: "1234" };

  const handleLogin = () => {
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      if (id === mockUser.id && password === mockUser.password) {
        navigate("/"); // מעביר לעמוד הבית
      } else {
        setError("תעודת זהות או סיסמה שגויים");
      }
    }, 1500);
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

          <TextField
            label="תעודת זהות"
            fullWidth
            margin="normal"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <TextField
            label="סיסמה"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
            disabled={loading}
          >
            התחבר
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
