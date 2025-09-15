import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firestore/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { Student } from "../models/Student";
import type { StudentCourse } from "../models/StudentCourse";

const GradeReport: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [coursesRows, setCoursesRows] = useState<any[]>([]);
  const [gradesBySemester, setGradesBySemester] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          // שולף את הסטודנט לפי אימייל
          const qStudent = query(
            collection(firestore, "students"),
            where("email", "==", user.email)
          );
          const snapStudent = await getDocs(qStudent);

          if (!snapStudent.empty) {
            const studentData = snapStudent.docs[0].data() as Student;
            setStudent(studentData);

            // שולף את רשומות הסטודנטCourses לפי studentId
            const qCourses = query(
              collection(firestore, "studentCourses"),
              where("studentId", "==", studentData.id)
            );
            const snapCourses = await getDocs(qCourses);

            const rows: any[] = snapCourses.docs.map((doc, idx) => {
              const sc = doc.data() as StudentCourse;
              return {
                id: idx + 1,
                courseName: sc.courseCode,
                grade: sc.grade,
                year: sc.year,
                semester: sc.semester,
              };
            });
            setCoursesRows(rows);

            // מחשב ממוצעים לפי שנה+סמסטר
            const grouped: Record<string, number[]> = {};
            rows.forEach((r) => {
              const key = `שנה ${r.year} - סמס' ${r.semester}`;
              if (!grouped[key]) grouped[key] = [];
              if (typeof r.grade === "number") grouped[key].push(r.grade);
            });

            const avgBySem = Object.entries(grouped).map(([semester, grades]) => ({
              semester,
              avg: grades.reduce((a, b) => a + b, 0) / grades.length,
            }));
            setGradesBySemester(avgBySem);
          } else {
            console.warn("⚠️ לא נמצא סטודנט עם המייל הזה");
          }
        } catch (err) {
          console.error("❌ שגיאה בשליפת הנתונים:", err);
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && student && (
        <>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            דו"ח ציונים 📈 – שלום {student.fullName}
          </Typography>

          {/* גרף ממוצעים */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                ממוצע ציונים לפי סמסטר
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={gradesBySemester}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis 
                    dataKey="semester" 
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="avg" stroke="#0077cc" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* טבלת ציונים */}
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                פירוט ציונים
              </Typography>
              <TableContainer 
                component={Paper}
                sx={{
                  '& .MuiTable-root': {
                    minWidth: { xs: 'auto', sm: 650 }
                  }
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        קוד קורס
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        ציון
                      </TableCell>
                      <TableCell sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        display: { xs: 'none', sm: 'table-cell' }
                      }}>
                        שנה
                      </TableCell>
                      <TableCell sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        display: { xs: 'none', sm: 'table-cell' }
                      }}>
                        סמסטר
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coursesRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {row.courseName}
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {row.grade}
                        </TableCell>
                        <TableCell sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: { xs: 'none', sm: 'table-cell' }
                        }}>
                          {row.year}
                        </TableCell>
                        <TableCell sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: { xs: 'none', sm: 'table-cell' }
                        }}>
                          {row.semester}
                        </TableCell>
                      </TableRow>
                    ))}
                    {coursesRows.length === 0 && (
                      <TableRow>
                        <TableCell 
                          colSpan={4} 
                          align="center"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          אין נתוני ציונים להצגה
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default GradeReport;
