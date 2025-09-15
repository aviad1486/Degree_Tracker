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
import { useNavigate, Link } from "react-router-dom";
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

      // Handle common errors
      if (err.code === "auth/invalid-email") {
        setError("Email address is not valid");
      } else if (err.code === "auth/user-not-found") {
        setError("User not found in the system");
      } else if (err.code === "auth/wrong-password") {
        setError("Wrong password");
      } else {
        setError("Login failed, please try again");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: { xs: "calc(100vh - 120px)", sm: "80vh" },
        p: { xs: 2, sm: 3 }
      }}
    >
      <Card sx={{ 
        width: { xs: '100%', sm: 400 }, 
        maxWidth: 400,
        boxShadow: { xs: 2, sm: 3 }
      }}>
        {loading && <LinearProgress />}
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              textAlign: 'center',
              mb: { xs: 2, sm: 3 }
            }}
          >
            Login 🔐
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              id="email"
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size={window.innerWidth < 600 ? 'small' : 'medium'}
              sx={{ 
                '& .MuiInputLabel-root': { 
                  fontSize: { xs: '0.875rem', sm: '1rem' } 
                },
                '& .MuiInputBase-input': { 
                  fontSize: { xs: '0.875rem', sm: '1rem' } 
                }
              }}
            />
            <TextField
              id="password"
              label="Password (ID Number)"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size={window.innerWidth < 600 ? 'small' : 'medium'}
              sx={{ 
                '& .MuiInputLabel-root': { 
                  fontSize: { xs: '0.875rem', sm: '1rem' } 
                },
                '& .MuiInputBase-input': { 
                  fontSize: { xs: '0.875rem', sm: '1rem' } 
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ 
                mt: { xs: 2, sm: 2 },
                py: { xs: 1.5, sm: 1 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
              disabled={loading}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ 
                mt: 1,
                py: { xs: 1.5, sm: 1 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
              component={Link}
              to="/help"
            >
              Need Help? 🆘
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;