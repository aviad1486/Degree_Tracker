import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firestore/config";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

interface GradeSheet {
  [courseCode: string]: number;
}

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [program, setProgram] = useState<string>("");
  const [totalCredits, setTotalCredits] = useState(0);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [gpa, setGpa] = useState(0);
  const [gradeSheet, setGradeSheet] = useState<GradeSheet>({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          const q = query(
            collection(firestore, "students"),
            where("email", "==", user.email),
            limit(1)
          );
          const snap = await getDocs(q);

          if (!snap.empty) {
            const student = snap.docs[0].data() as any;

            setStudentName(student.fullName);
            setProgram(student.program ?? "");
            setCompletedCredits(Number(student.completedCredits ?? 0));
            setTotalCredits(Number(student.totalCredits ?? 120));

            // חישוב ממוצע ציונים
            const grades: GradeSheet = student.gradeSheet ?? {};
            setGradeSheet(grades);
            const values = Object.values(grades).filter((g) => typeof g === "number");
            if (values.length > 0) {
              const avg = values.reduce((a, b) => a + b, 0) / values.length;
              setGpa(Number(avg.toFixed(2)));
            } else {
              setGpa(0);
            }
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
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">נק"ז שהושלמו</Typography>
                  <Typography variant="body1">
                    {completedCredits}/{totalCredits}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">ממוצע ציונים</Typography>
                  <Typography variant="body1">{gpa}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">תוכנית לימודים</Typography>
                  <Typography variant="body1">{program}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* טבלה של כל הקורסים והציונים */}
          <Typography variant="h6" gutterBottom>
            הקורסים שלי
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>קורס</TableCell>
                  <TableCell align="right">ציון</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(gradeSheet).map(([course, grade]) => (
                  <TableRow key={course}>
                    <TableCell>{course}</TableCell>
                    <TableCell align="right">{grade}</TableCell>
                  </TableRow>
                ))}
                {Object.keys(gradeSheet).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      אין נתוני קורסים להצגה
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* קיצורי דרך */}
          <Box sx={{ mt: 2 }}>
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