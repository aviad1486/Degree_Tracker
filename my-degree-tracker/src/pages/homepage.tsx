import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firestore/config";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [totalCredits, setTotalCredits] = useState(120);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [gpa, setGpa] = useState(0);
  const [remainingCourses, setRemainingCourses] = useState(0);
  const [currentCourses, setCurrentCourses] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          // חיפוש במסמכי students לפי האימייל
          const q = query(
            collection(firestore, "students"),
            where("email", "==", user.email),
            limit(1)
          );
          const snap = await getDocs(q);

          if (!snap.empty) {
            const student = snap.docs[0].data();
            setStudentName(student.fullName);
            setCompletedCredits(Number(student.completedCredits ?? 0));
            setCurrentCourses(Array.isArray(student.courses) ? student.courses.length : 0);
            setGpa(Number(student.gpa ?? 0));
            setTotalCredits(Number(student.totalCredits ?? 120));
            setRemainingCourses(Number(student.remainingCourses ?? 0));
          } else {
            console.warn("⚠️ לא נמצא סטודנט עם המייל הזה");
            setStudentName(user.email);
          }
        } catch (err) {
          console.error("❌ שגיאה בשליפת הסטודנט:", err);
          setStudentName(user.email ?? "סטודנט");
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && (
        <>
          {/* ברכה אישית */}
          <Typography variant="h5" gutterBottom>
            שלום, {studentName ?? "סטודנט"}! 👋
          </Typography>

          {/* תקציר מצב התואר */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">נק"ז שהושלמו</Typography>
                  <Typography variant="body1">
                    {completedCredits}/{totalCredits}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">ממוצע ציונים</Typography>
                  <Typography variant="body1">{gpa}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">קורסים שנותרו</Typography>
                  <Typography variant="body1">{remainingCourses}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">קורסים בסמסטר נוכחי</Typography>
                  <Typography variant="body1">{currentCourses}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* קיצורי דרך */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              קיצורי דרך
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant="contained" component={Link} to="/myprogress">
                  ההתקדמות שלי
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" component={Link} to="/gradereport">
                  דו"ח ציונים
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" component={Link} to="/mycourses">
                  הקורסים שלי
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" component={Link} to="/myprogram">
                  המסלול שלי
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" component={Link} to="/helpsupport">
                  עזרה ותמיכה
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default HomePage;