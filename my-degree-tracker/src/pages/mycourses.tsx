import React, { useEffect, useState } from "react";
import {
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
import type { Course } from "../models/Course";
import styles from "../styles/MyCourses.module.css";

interface CourseWithDetails extends StudentCourse {
  courseName: string;
  credits: number;
}

interface CurrentCourse {
  courseCode: string;
  courseName: string;
  credits: number;
}

const MyCourses: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCourses, setCurrentCourses] = useState<CurrentCourse[]>([]);
  const [passedCourses, setPassedCourses] = useState<CourseWithDetails[]>([]);
  const [failedCourses, setFailedCourses] = useState<CourseWithDetails[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          setLoading(true);
          setError(null);

          // Get student data
          const studentsQuery = query(
            collection(firestore, "students"),
            where("email", "==", user.email)
          );
          const studentsSnapshot = await getDocs(studentsQuery);

          if (!studentsSnapshot.empty) {
            const studentData = studentsSnapshot.docs[0].data() as Student;

            // Get all courses to create a course map
            const allCoursesSnapshot = await getDocs(collection(firestore, "courses"));
            const courseMap = new Map<string, Course>();
            allCoursesSnapshot.docs.forEach(doc => {
              const course = doc.data() as Course;
              courseMap.set(course.courseCode, course);
            });

            // Get student courses (completed with grades)
            const coursesQuery = query(
              collection(firestore, "studentCourses"),
              where("studentId", "==", studentData.id)
            );
            const coursesSnapshot = await getDocs(coursesQuery);
            const studentCoursesData = coursesSnapshot.docs.map(doc => doc.data() as StudentCourse);

            // Get taken course codes to filter current courses
            const takenCourseCodes = studentCoursesData.map(sc => sc.courseCode);

            // Current courses (enrolled but not yet completed)
            const current: CurrentCourse[] = (studentData.courses || [])
              .filter(courseCode => !takenCourseCodes.includes(courseCode))
              .map(courseCode => {
                const course = courseMap.get(courseCode);
                return {
                  courseCode,
                  courseName: course?.courseName || courseCode,
                  credits: course?.credits || 0
                };
              });

            // Passed courses (grade >= 60)
            const passed: CourseWithDetails[] = studentCoursesData
              .filter(sc => sc.grade >= 60)
              .map(sc => {
                const course = courseMap.get(sc.courseCode);
                return {
                  ...sc,
                  courseName: course?.courseName || sc.courseCode,
                  credits: course?.credits || 0
                };
              });

            // Failed courses (grade < 60)
            const failed: CourseWithDetails[] = studentCoursesData
              .filter(sc => sc.grade < 60)
              .map(sc => {
                const course = courseMap.get(sc.courseCode);
                return {
                  ...sc,
                  courseName: course?.courseName || sc.courseCode,
                  credits: course?.credits || 0
                };
              });

            setCurrentCourses(current);
            setPassedCourses(passed);
            setFailedCourses(failed);
          }
        } catch (err) {
          console.error("Error fetching courses:", err);
          setError("Failed to load course data. Please try again.");
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
      <div className={styles.loading} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}>
        <Typography variant="h6" className={styles.title} style={{ color: 'white', marginBottom: '1rem' }}>
          Loading your courses...
        </Typography>
        <LinearProgress className={styles.progressBar} style={{ width: '300px', height: '4px' }} />
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

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <Typography variant="h4" className={styles.pageTitle}>
          My Courses
        </Typography>

      </div>

      {/* Statistics Grid */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent>
            <Typography variant="h6" className={styles.statLabel}>
              Current Courses
            </Typography>
            <Typography variant="h3" className={styles.statValue}>
              {currentCourses.length}
            </Typography>
          </CardContent>
        </Card>
        
        <Card className={styles.statCard}>
          <CardContent>
            <Typography variant="h6" className={styles.statLabel}>
              Passed Courses
            </Typography>
            <Typography variant="h3" className={styles.statValue}>
              {passedCourses.length}
            </Typography>
          </CardContent>
        </Card>
        
        <Card className={styles.statCard}>
          <CardContent>
            <Typography variant="h6" className={styles.statLabel}>
              Failed Courses
            </Typography>
            <Typography variant="h3" className={styles.statValue}>
              {failedCourses.length}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Current Courses Section */}
      <div className={`${styles.sectionCard} ${styles.currentSection}`}>
        <div className={styles.sectionHeader}>
          <Typography variant="h5" className={styles.sectionTitle}>
            Current Courses
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
              {currentCourses.length > 0 ? (
                currentCourses.map((course, index) => (
                  <TableRow key={index} className={styles.tableRow}>
                    <TableCell className={styles.tableCell}>{course.courseCode}</TableCell>
                    <TableCell className={styles.tableCell}>{course.courseName}</TableCell>
                    <TableCell className={styles.tableCell}>{course.credits}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className={styles.noDataCell}>
                    No current courses
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Passed Courses Section */}
      <div className={`${styles.sectionCard} ${styles.passedSection}`}>
        <div className={styles.sectionHeader}>
          <Typography variant="h5" className={styles.sectionTitle}>
            Passed Courses
          </Typography>
        </div>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableHeader}>Course Code</TableCell>
                <TableCell className={styles.tableHeader}>Course Name</TableCell>
                <TableCell className={styles.tableHeader}>Credits</TableCell>
                <TableCell className={styles.tableHeader}>Year</TableCell>
                <TableCell className={styles.tableHeader}>Semester</TableCell>
                <TableCell className={styles.tableHeader}>Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {passedCourses.length > 0 ? (
                passedCourses.map((course, index) => (
                  <TableRow key={index} className={styles.tableRow}>
                    <TableCell className={styles.tableCell}>{course.courseCode}</TableCell>
                    <TableCell className={styles.tableCell}>{course.courseName}</TableCell>
                    <TableCell className={styles.tableCell}>{course.credits}</TableCell>
                    <TableCell className={styles.tableCell}>{course.year}</TableCell>
                    <TableCell className={styles.tableCell}>{course.semester}</TableCell>
                    <TableCell className={`${styles.tableCell} ${styles.gradeCell} ${styles.passedGrade}`}>
                      {course.grade}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className={styles.noDataCell}>
                    No passed courses yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Failed Courses Section */}
      <div className={`${styles.sectionCard} ${styles.failedSection}`}>
        <div className={styles.sectionHeader}>
          <Typography variant="h5" className={styles.sectionTitle}>
            Failed Courses
          </Typography>
        </div>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableHeader}>Course Code</TableCell>
                <TableCell className={styles.tableHeader}>Course Name</TableCell>
                <TableCell className={styles.tableHeader}>Credits</TableCell>
                <TableCell className={styles.tableHeader}>Year</TableCell>
                <TableCell className={styles.tableHeader}>Semester</TableCell>
                <TableCell className={styles.tableHeader}>Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {failedCourses.length > 0 ? (
                failedCourses.map((course, index) => (
                  <TableRow key={index} className={styles.tableRow}>
                    <TableCell className={styles.tableCell}>{course.courseCode}</TableCell>
                    <TableCell className={styles.tableCell}>{course.courseName}</TableCell>
                    <TableCell className={styles.tableCell}>{course.credits}</TableCell>
                    <TableCell className={styles.tableCell}>{course.year}</TableCell>
                    <TableCell className={styles.tableCell}>{course.semester}</TableCell>
                    <TableCell className={`${styles.tableCell} ${styles.gradeCell} ${styles.failedGrade}`}>
                      {course.grade}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className={styles.noDataCell}>
                    No failed courses 🎉
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

export default MyCourses;