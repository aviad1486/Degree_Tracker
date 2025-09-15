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
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firestore/config";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import type { Student } from "../models/Student";
import type { Program } from "../models/Program";

interface CourseInProgram {
  courseCode: string;
  courseName: string;
  credits: number;
}

const MyProgram: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<Program | null>(null);
  const [courses, setCourses] = useState<CourseInProgram[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          // שליפת הסטודנט
          const qStudent = query(
            collection(firestore, "students"),
            where("email", "==", user.email),
            limit(1)
          );
          const snap = await getDocs(qStudent);

          if (!snap.empty) {
            const student = snap.docs[0].data() as Student;

            // שליפת המסלול של הסטודנט
            const programRef = doc(firestore, "programs", student.program);
            const programSnap = await getDoc(programRef);

            if (programSnap.exists()) {
              const programData = programSnap.data() as Program;
              setProgram(programData);

              // שליפת כל הקורסים במסלול
              const allCoursesSnap = await getDocs(collection(firestore, "courses"));
              const allCourses = allCoursesSnap.docs.map((d) => d.data() as any);

              const courseMap: Record<string, any> = {};
              allCourses.forEach((c) => (courseMap[c.courseCode] = c));

              const programCourses: CourseInProgram[] = (programData.courses || []).map(
                (code: string) => ({
                  courseCode: code,
                  courseName: courseMap[code]?.courseName || code,
                  credits: courseMap[code]?.credits || 0,
                })
              );

              setCourses(programCourses);
            }
          }
        } catch (err) {
          console.error("❌ שגיאה בשליפת מסלול:", err);
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && program && (
        <>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            המסלול שלי 🎓
          </Typography>

          {/* פרטי המסלול */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6"
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                שם המסלול: {program.name}
              </Typography>
              <Typography 
                variant="body1"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                סך נק"ז נדרש: {program.totalCreditsRequired}
              </Typography>
            </CardContent>
          </Card>

          {/* טבלת קורסים במסלול */}
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                רשימת קורסים במסלול
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
                      <TableCell sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        display: { xs: 'none', sm: 'table-cell' }
                      }}>
                        שם קורס
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        נק"ז
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses.map((course, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {course.courseCode}
                        </TableCell>
                        <TableCell sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: { xs: 'none', sm: 'table-cell' }
                        }}>
                          {course.courseName}
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {course.credits}
                        </TableCell>
                      </TableRow>
                    ))}
                    {courses.length === 0 && (
                      <TableRow>
                        <TableCell 
                          colSpan={3} 
                          align="center"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          אין קורסים במסלול
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

export default MyProgram;