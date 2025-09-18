import React, { useState, useEffect } from "react";
import {
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
import styles from "../styles/MyProgress.module.css";

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
            const rows = snapCourses.docs
              .map((doc) => doc.data() as StudentCourse)
              .filter((c) => c.grade >= 60);
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

  if (loading) {
    return (
      <div className={styles.progressContainer} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}>
        <Typography variant="h6" style={{ color: 'white', marginBottom: '1rem' }}>
          Loading Your Progress...
        </Typography>
        <LinearProgress style={{ width: '300px', height: '4px' }} />
      </div>
    );
  }

  return (
    <div className={styles.progressContainer}>
      {!loading && (
        <>
          {/* Professional Page Title */}
          <Typography 
            variant="h2" 
            component="h1"
            className={styles.pageTitle}
          >
            My Progress 
          </Typography>

          {/* Professional Stats Grid */}
          <div className={styles.statsGrid}>
            {/* Credits Progress Card */}
            <Card className={styles.statCard}>
              <CardContent className={styles.statCardContent}>
                <Typography className={styles.statTitle}>
                  Credits Completed
                </Typography>
                <Typography className={`${styles.statValue} ${styles.creditsValue}`}>
                  {completedCredits}/{totalCredits}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercent}
                  className={styles.progressBar}
                />
                <Typography className={styles.progressText}>
                  {progressPercent}% Complete
                </Typography>
              </CardContent>
            </Card>

            {/* Grade Average Card */}
            <Card className={styles.statCard}>
              <CardContent className={styles.statCardContent}>
                <Typography className={styles.statTitle}>
                  Grade Average
                </Typography>
                <Typography className={`${styles.statValue} ${styles.gradeValue}`}>
                  {gpa.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </div>

          {/* Professional Courses Section */}
          <div className={styles.coursesSection}>
            <Typography className={styles.sectionTitle}>
              Completed Courses
            </Typography>
            <TableContainer 
              component={Paper} 
              className={styles.coursesTable}
            >
              <Table>
                <TableHead className={styles.tableHeader}>
                  <TableRow>
                    <TableCell className={styles.tableHeaderCell}>
                      Course Code
                    </TableCell>
                    <TableCell className={styles.tableHeaderCell}>
                      Grade
                    </TableCell>
                    <TableCell className={styles.tableHeaderCell}>
                      Year
                    </TableCell>
                    <TableCell className={styles.tableHeaderCell}>
                      Semester
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((c, idx) => (
                    <TableRow key={idx} className={styles.tableRow}>
                      <TableCell className={styles.tableCell}>
                        {c.courseCode}
                      </TableCell>
                      <TableCell className={`${styles.tableCell} ${styles.gradeCell}`}>
                        {c.grade}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {c.year}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {c.semester}
                      </TableCell>
                    </TableRow>
                  ))}
                  {courses.length === 0 && (
                    <TableRow className={styles.tableRow}>
                      <TableCell colSpan={4} className={styles.emptyState}>
                        No course data to display ✨
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default MyProgress;
