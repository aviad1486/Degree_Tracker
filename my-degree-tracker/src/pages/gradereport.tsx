import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
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
import { DataGrid } from "@mui/x-data-grid";
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

  const columns: GridColDef[] = [
    { field: "courseName", headerName: "שם קורס", flex: 1 },
    { field: "grade", headerName: "ציון", width: 100 },
    { field: "year", headerName: "שנה", width: 100 },
    { field: "semester", headerName: "סמסטר", width: 100 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && student && (
        <>
          <Typography variant="h5" gutterBottom>
            דו"ח ציונים 📈 – שלום {student.fullName}
          </Typography>

          {/* גרף ממוצעים */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ממוצע ציונים לפי סמסטר
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={gradesBySemester}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="semester" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="avg" stroke="#0077cc" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* טבלת ציונים */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                פירוט ציונים
              </Typography>
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={coursesRows}
                  columns={columns}
                  pageSizeOptions={[5]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default GradeReport;
