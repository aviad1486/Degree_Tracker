import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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

  const columns: GridColDef[] = [
    { field: "courseName", headerName: "שם קורס", flex: 1 },
    { field: "credits", headerName: "נק\"", width: 120 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && program && (
        <>
          <Typography variant="h5" gutterBottom>
            המסלול שלי 🎓
          </Typography>

          {/* פרטי המסלול */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">שם המסלול: {program.name}</Typography>
              <Typography variant="body1">
                סך נק"ז נדרש: {program.totalCreditsRequired}
              </Typography>
            </CardContent>
          </Card>

          {/* טבלת קורסים במסלול */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                רשימת קורסים במסלול
              </Typography>
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={courses.map((c, idx) => ({ id: idx, ...c }))}
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

export default MyProgram;