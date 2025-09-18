import React, { useState } from "react";
import {
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
import { auth, firestore } from "../firestore/config";
import { doc, getDoc } from "firebase/firestore";
import styles from "../styles/Login.module.css";

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

      // Save credentials for re-login later
      sessionStorage.setItem("loginEmail", email);
      sessionStorage.setItem("loginPassword", password);

      // Step 2: Check if Firestore doc exists with ID = password
      const studentRef = doc(firestore, "students", password); 
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        setError("User does not exist in the system");
        setLoading(false);
        await auth.signOut();
        return;
      }
      navigate("/");
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
    <div className={styles.container}>
      <Card className={styles.loginCard}>
        {loading && <LinearProgress className={styles.progressBar} />}
        <CardContent className={styles.cardContent}>
          <Typography variant="h4" className={styles.title}>
            Welcome 
          </Typography>
          <Typography variant="body1" className={styles.subtitle}>
            Sign in to access your degree tracker
          </Typography>

          {error && (
            <Alert severity="error" className={styles.errorAlert}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin} className={styles.form}>
            <TextField
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
              variant="outlined"
            />
            <TextField
              id="password"
              label="Password (ID Number)"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
              variant="outlined"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              className={styles.helpButton}
              component={Link}
              to="/help"
            >
              Need Help? 🆘
            </Button>
          </form>

          <Typography variant="body2" className={styles.welcomeText}>
            Track your academic journey with confidence
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;