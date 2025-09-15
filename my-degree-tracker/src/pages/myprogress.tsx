import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
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
          console.error("❌ Error fetching progress:", err);
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const progressPercent = Math.round((completedCredits / totalCredits) * 100);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && (
        <>
          <Typography 
            variant="h5"
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            My Progress 📊
          </Typography>

          {/* Progress Bar */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Credits Completed
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progressPercent}
                sx={{ height: { xs: 8, sm: 6 } }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 1,
                  fontSize: { xs: '0.875rem', sm: '0.875rem' }
                }}
              >
                {completedCredits}/{totalCredits} credits ({progressPercent}%)
              </Typography>
            </CardContent>
          </Card>

          {/* Grade Average */}
          <Box sx={{ mb: 3 }}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6"
                  sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                >
                  Grade Average
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontSize: { xs: '1.25rem', sm: '1rem' },
                    fontWeight: 'bold'
                  }}
                >
                  {gpa}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Completed Courses Table */}
          <Typography 
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            Courses I've Completed
          </Typography>
          <TableContainer 
            component={Paper} 
            sx={{ 
              mb: 4,
              '& .MuiTable-root': {
                minWidth: { xs: 'auto', sm: 650 }
              }
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Course Code
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Grade
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Year
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Semester
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((c, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {c.courseCode}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      {c.grade}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      {c.year}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      {c.semester}
                    </TableCell>
                  </TableRow>
                ))}
                {courses.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={4} 
                      align="center"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      No course data to display
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
