import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
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

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [program, setProgram] = useState<string>("");
  const [totalCredits, setTotalCredits] = useState(0);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [gpa, setGpa] = useState(0);
  const [assignments, setAssignments] = useState<string[]>([]);

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

            // ממוצע ציונים נשאר כמו קודם אם תרצה להשתמש ב-gradeSheet
            const grades = student.gradeSheet ?? {};
            const values = Object.values(grades).filter((g) => typeof g === "number");
            if (values.length > 0) {
              const avg = values.reduce((a, b) => a + b, 0) / values.length;
              setGpa(Number(avg.toFixed(2)));
            } else {
              setGpa(0);
            }

            // שמירה של כל ה-assignments מהסטודנט
            setAssignments(student.assignments ?? []);
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
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 2, 
            mb: 4 
          }}>
            <Card>
              <CardContent>
                <Typography variant="h6">נק"ז שהושלמו</Typography>
                <Typography variant="body1">
                  {completedCredits}/{totalCredits}
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6">ממוצע ציונים</Typography>
                <Typography variant="body1">{gpa}</Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6">תוכנית לימודים</Typography>
                <Typography variant="body1">{program}</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* טבלה של כל ה-assignments */}
          <Typography variant="h6" gutterBottom>
            משימות (Assignments)
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>שם משימה</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{assignment}</TableCell>
                  </TableRow>
                ))}
                {assignments.length === 0 && (
                  <TableRow>
                    <TableCell align="center">אין משימות להצגה</TableCell>
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
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 2 
            }}>
              <Button variant="contained" component={Link} to="/progress">
                ההתקדמות שלי
              </Button>
              <Button variant="contained" component={Link} to="/grade-report">
                דו"ח ציונים
              </Button>
              <Button variant="contained" component={Link} to="/my-courses">
                הקורסים שלי
              </Button>
              <Button variant="contained" component={Link} to="/my-program">
                המסלול שלי
              </Button>
              <Button variant="contained" component={Link} to="/help">
                עזרה ותמיכה
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default HomePage;