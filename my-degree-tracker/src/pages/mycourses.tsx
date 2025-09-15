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
          console.error("❌ שגיאה בשליפת קורסים:", err);
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const renderCurrentTable = (rows: Course[]) => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          קורסים נוכחיים
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>קוד קורס</TableCell>
                <TableCell>שם קורס</TableCell>
                <TableCell>נק"ז</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell>{r.courseCode}</TableCell>
                  <TableCell>{r.courseName}</TableCell>
                  <TableCell>{r.credits}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    אין נתונים להצגה
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
      <CardContent>
        <Typography variant="h6" gutterBottom>
          קורסים שעברתי
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>קוד קורס</TableCell>
                <TableCell>שם קורס</TableCell>
                <TableCell>נק"ז</TableCell>
                <TableCell>שנה</TableCell>
                <TableCell>סמסטר</TableCell>
                <TableCell>ציון</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell>{r.courseCode}</TableCell>
                  <TableCell>{r.courseName}</TableCell>
                  <TableCell>{r.credits}</TableCell>
                  <TableCell>{r.year ?? "—"}</TableCell>
                  <TableCell>{r.semester ?? "—"}</TableCell>
                  <TableCell>{r.grade ?? "—"}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    אין נתונים להצגה
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
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {!loading && (
        <>
          <Typography variant="h5" gutterBottom>
            הקורסים שלי 📚
          </Typography>
          {renderCurrentTable(currentCourses)}
          {renderPassedTable(passedCourses)}
        </>
      )}
    </Box>
  );
};

export default MyCourses;