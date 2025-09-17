import React, { useEffect, useState } from "react";
import {
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
import styles from "../styles/MyProgram.module.css";

interface CourseInProgram {
  courseCode: string;
  courseName: string;
  credits: number;
}

const MyProgram: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [courses, setCourses] = useState<CourseInProgram[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          setLoading(true);
          setError(null);

          // Get student data
          const studentsQuery = query(
            collection(firestore, "students"),
            where("email", "==", user.email),
            limit(1)
          );
          const studentsSnapshot = await getDocs(studentsQuery);

          if (!studentsSnapshot.empty) {
            const student = studentsSnapshot.docs[0].data() as Student;

            // Get student's program
            const programRef = doc(firestore, "programs", student.program);
            const programSnapshot = await getDoc(programRef);

            if (programSnapshot.exists()) {
              const programData = programSnapshot.data() as Program;
              setProgram(programData);

              // Get all courses to create course details
              const allCoursesSnapshot = await getDocs(collection(firestore, "courses"));
              const courseMap = new Map<string, any>();
              allCoursesSnapshot.docs.forEach(doc => {
                const course = doc.data();
                courseMap.set(course.courseCode, course);
              });

              const programCourses: CourseInProgram[] = (programData.courses || []).map(
                (code: string) => ({
                  courseCode: code,
                  courseName: courseMap.get(code)?.courseName || code,
                  credits: courseMap.get(code)?.credits || 0,
                })
              );

              setCourses(programCourses);
            }
          }
        } catch (err) {
          console.error("Error fetching program:", err);
          setError("Failed to load program data. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Typography variant="h6" className={styles.title}>Loading your program...</Typography>
        <LinearProgress className={styles.progressBar} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Typography variant="h6" className={styles.title}>Error</Typography>
        <Typography variant="body1">{error}</Typography>
      </div>
    );
  }

  if (!program) {
    return (
      <div className={styles.error}>
        <Typography variant="h6" className={styles.title}>No Program Found</Typography>
        <Typography variant="body1">You are not enrolled in any program yet.</Typography>
      </div>
    );
  }

  // Calculate statistics
  const totalCourses = courses.length;
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <Typography variant="h4" className={styles.pageTitle}>
          My Program
        </Typography>
        <Typography variant="body1" className={styles.subtitle}>
          View your academic program and course requirements
        </Typography>
      </div>

      {/* Statistics Grid */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent>
            <Typography variant="h6" className={styles.statLabel}>
              Total Courses
            </Typography>
            <Typography variant="h3" className={styles.statValue}>
              {totalCourses}
            </Typography>
          </CardContent>
        </Card>
        
        <Card className={styles.statCard}>
          <CardContent>
            <Typography variant="h6" className={styles.statLabel}>
              Total Credits
            </Typography>
            <Typography variant="h3" className={styles.statValue}>
              {totalCredits}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Program Information Card */}
      <div className={styles.programInfoCard}>
        <div className={styles.programInfoHeader}>
          <Typography variant="h5" className={styles.programInfoTitle}>
            Program Information
          </Typography>
          <Typography variant="h6" className={styles.programName}>
            {program.name}
          </Typography>
          <Typography variant="body1" className={styles.programDetails}>
            Required Credits: {program.totalCreditsRequired}
          </Typography>
        </div>
      </div>

      {/* Course Table */}
      <div className={styles.courseTableCard}>
        <div className={styles.courseTableHeader}>
          <Typography variant="h5" className={styles.courseTableTitle}>
            Program Courses
          </Typography>
        </div>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableHeader}>Course Code</TableCell>
                <TableCell className={styles.tableHeader}>Course Name</TableCell>
                <TableCell className={styles.tableHeader}>Credits</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <TableRow key={index} className={styles.tableRow}>
                    <TableCell className={styles.tableCell}>{course.courseCode}</TableCell>
                    <TableCell className={styles.tableCell}>{course.courseName}</TableCell>
                    <TableCell className={`${styles.tableCell} ${styles.creditsCell}`}>
                      {course.credits}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className={styles.noDataCell}>
                    No courses in program
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default MyProgram;