import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firestore/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { Student } from "../models/Student";
import type { StudentCourse } from "../models/StudentCourse";

interface Course {
  courseCode: string;
  courseName: string;
  credits: number;
  year?: number;
  semester?: string;
  grade?: number;
}

const MyCourses: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentCourses, setCurrentCourses] = useState<Course[]>([]);
  const [passedCourses, setPassedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          // שליפת הסטודנט
          const qStudent = query(
            collection(firestore, "students"),
            where("email", "==", user.email)
          );
          const snapStudent = await getDocs(qStudent);

          if (!snapStudent.empty) {
            const student = snapStudent.docs[0].data() as Student;

            // שליפת studentCourses
            const qSC = query(
              collection(firestore, "studentCourses"),
              where("studentId", "==", student.id)
            );
            const snapSC = await getDocs(qSC);
            const scRecords = snapSC.docs.map((d) => d.data() as StudentCourse);

            // שליפת courses
            const snapAllCourses = await getDocs(collection(firestore, "courses"));
            const allCourses = snapAllCourses.docs.map((d) => d.data() as any);

            const courseMap: Record<string, any> = {};
            allCourses.forEach((c) => (courseMap[c.courseCode] = c));

            // --- קורסים נוכחיים
            const takenCodes = scRecords.map((r) => r.courseCode);
            const current = (student.courses || [])
              .filter((code) => !takenCodes.includes(code))
              .map((code) => ({
                courseCode: code,
                courseName: courseMap[code]?.courseName || code,
                credits: courseMap[code]?.credits || 0,
              }));

            // --- קורסים שעברתי (grade >= 60)
            const passed = scRecords
              .filter((r) => typeof r.grade === "number" && r.grade >= 60)
              .map((r) => ({
                courseCode: r.courseCode,
                courseName: courseMap[r.courseCode]?.courseName || r.courseCode,
                credits: courseMap[r.courseCode]?.credits || 0,
                year: r.year,
                semester: r.semester,
                grade: r.grade,
              }));

            setCurrentCourses(current);
            setPassedCourses(passed);
          }
        } catch (err) {
          console.error("❌ Error fetching courses:", err);
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const renderCurrentTable = (rows: Course[]) => (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          Current Courses
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
                  Course Code
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  Course Name
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Credits
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {r.courseCode}
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    display: { xs: 'none', sm: 'table-cell' }
                  }}>
                    {r.courseName}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {r.credits}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell 
                    colSpan={3} 
                    align="center"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    No data to display
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderPassedTable = (rows: Course[]) => (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          Courses I've Passed
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
                  Code
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  Course Name
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', md: 'table-cell' }
                }}>
                  Credits
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', md: 'table-cell' }
                }}>
                  Year
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  Semester
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Grade
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {r.courseCode}
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    display: { xs: 'none', sm: 'table-cell' }
                  }}>
                    {r.courseName}
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    display: { xs: 'none', md: 'table-cell' }
                  }}>
                    {r.credits}
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    display: { xs: 'none', md: 'table-cell' }
                  }}>
                    {r.year ?? "—"}
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    display: { xs: 'none', sm: 'table-cell' }
                  }}>
                    {r.semester ?? "—"}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {r.grade ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell 
                    colSpan={6} 
                    align="center"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    No data to display
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

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
            My Courses 📚
          </Typography>
          {renderCurrentTable(currentCourses)}
          {renderPassedTable(passedCourses)}
        </>
      )}
    </Box>
  );
};

export default MyCourses;