import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firestore/config";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

interface StudentCourse {
  courseCode: string;
  grade: number;
  year: number;
  semester: string;
}

const MyProgress: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [totalCredits, setTotalCredits] = useState(120);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [gpa, setGpa] = useState(0);
  const [courses, setCourses] = useState<StudentCourse[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          // שליפת הסטודנט
          const q = query(
            collection(firestore, "students"),
            where("email", "==", user.email),
            limit(1)
          );
          const snap = await getDocs(q);

          if (!snap.empty) {
            const student = snap.docs[0].data() as any;

            setCompletedCredits(Number(student.completedCredits ?? 0));
            setTotalCredits(Number(student.totalCredits ?? 120));

            // חישוב ממוצע ציונים מתוך gradeSheet (נשאר מהסטודנט)
            const grades = student.gradeSheet ?? {};
            const values = Object.values(grades).filter(
              (g) => typeof g === "number"
            );
            if (values.length > 0) {
              const avg = values.reduce((a, b) => a + b, 0) / values.length;
              setGpa(Number(avg.toFixed(2)));
            } else {
              setGpa(0);
            }

            // שליפת קורסים מהקולקציה studentCourses לפי studentId
            const qCourses = query(
              collection(firestore, "studentCourses"),
              where("studentId", "==", student.id)
            );
            const snapCourses = await getDocs(qCourses);
            const rows = snapCourses.docs.map((doc) => doc.data() as StudentCourse);
            setCourses(rows);
          }
        } catch (err) {
          console.error("❌ שגיאה בשליפת ההתקדמות:", err);
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const progressPercent = Math.round((completedCredits / totalCredits) * 100);

  return (
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && (
        <>
          <Typography variant="h5" gutterBottom>
            ההתקדמות שלי 📊
          </Typography>

          {/* ציר התקדמות */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                נק"ז שהושלמו
              </Typography>
              <LinearProgress variant="determinate" value={progressPercent} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {completedCredits}/{totalCredits} נק"ז ({progressPercent}%)
              </Typography>
            </CardContent>
          </Card>

          {/* ממוצע ציונים */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">ממוצע ציונים</Typography>
                  <Typography variant="body1">{gpa}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* טבלה של קורסים שבוצעו */}
          <Typography variant="h6" gutterBottom>
            קורסים שביצעתי
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>קוד קורס</TableCell>
                  <TableCell align="right">ציון</TableCell>
                  <TableCell align="right">שנה</TableCell>
                  <TableCell align="right">סמסטר</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((c, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{c.courseCode}</TableCell>
                    <TableCell align="right">{c.grade}</TableCell>
                    <TableCell align="right">{c.year}</TableCell>
                    <TableCell align="right">{c.semester}</TableCell>
                  </TableRow>
                ))}
                {courses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      אין נתוני קורסים להצגה
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default MyProgress;
