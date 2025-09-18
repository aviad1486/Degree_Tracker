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
import styles from "../styles/GradeReport.module.css";

const GradeReport: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [coursesRows, setCoursesRows] = useState<any[]>([]);
  const [gradesBySemester, setGradesBySemester] = useState<any[]>([]);

  // Helper function to get grade color class
  const getGradeColorClass = (grade: number) => {
    if (grade >= 90) return styles.excellent;
    if (grade >= 80) return styles.good;
    if (grade >= 70) return styles.average;
    return styles.poor;
  };

  // Calculate statistics
  const totalCourses = coursesRows.length;
  const averageGrade = coursesRows.length > 0 
    ? (coursesRows.reduce((sum, course) => sum + course.grade, 0) / coursesRows.length).toFixed(2)
    : "0.00";
  const highestGrade = coursesRows.length > 0 
    ? Math.max(...coursesRows.map(course => course.grade))
    : 0;
  const passingGrades = coursesRows.filter(course => course.grade >= 60).length;

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

            // Calculate averages by year+semester
            const grouped: Record<string, number[]> = {};
            rows.forEach((r) => {
              const key = `Year ${r.year} - Sem ${r.semester}`;
              if (!grouped[key]) grouped[key] = [];
              if (typeof r.grade === "number") grouped[key].push(r.grade);
            });

            const avgBySem = Object.entries(grouped).map(([semester, grades]) => ({
              semester,
              avg: grades.reduce((a, b) => a + b, 0) / grades.length,
            }));
            setGradesBySemester(avgBySem);
          } else {
            console.warn("⚠️ Student with this email not found");
          }
        } catch (err) {
          console.error("❌ Error fetching data:", err);
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className={styles.gradeReportContainer} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}>
        <Typography variant="h6" style={{ color: 'white', marginBottom: '1rem' }}>
          Loading Grade Report...
        </Typography>
        <LinearProgress style={{ width: '300px', height: '4px' }} />
      </div>
    );
  }

  return (
    <div className={styles.gradeReportContainer}>
      {!loading && student && (
        <>
          {/* Professional Page Title */}
          <Typography 
            variant="h2" 
            component="h1"
            className={styles.pageTitle}
          >
            Grade Report for {student.fullName}
          </Typography>

          {/* Statistics Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{totalCourses}</div>
              <div className={styles.statLabel}>Total Courses</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{averageGrade}</div>
              <div className={styles.statLabel}>Average Grade</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{highestGrade}</div>
              <div className={styles.statLabel}>Highest Grade</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{passingGrades}</div>
              <div className={styles.statLabel}>Passing Grades</div>
            </div>
          </div>

          {/* Chart Section */}
          <div className={styles.chartSection}>
            <Card className={styles.chartCard}>
              <CardContent className={styles.chartCardContent}>
                <Typography className={styles.sectionTitle}>
                  Grade Average by Semester
                </Typography>
                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={gradesBySemester}>
                      <CartesianGrid stroke="rgba(71, 85, 105, 0.5)" />
                      <XAxis 
                        dataKey="semester" 
                        fontSize={12}
                        tick={{ fontSize: 12, fill: '#cbd5e1' }}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        fontSize={12}
                        tick={{ fontSize: 12, fill: '#cbd5e1' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(30, 41, 59, 0.95)',
                          border: '1px solid rgba(71, 85, 105, 0.3)',
                          borderRadius: '10px',
                          backdropFilter: 'blur(10px)',
                          color: '#e2e8f0'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avg" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: '#06b6d4' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table Section */}
          <div className={styles.tableSection}>
            <Card className={styles.tableCard}>
              <CardContent className={styles.tableCardContent}>
                <Typography className={styles.sectionTitle}>
                  Grade Details
                </Typography>
                <TableContainer 
                  component={Paper}
                  className={styles.gradesTable}
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
                      {coursesRows.map((row) => (
                        <TableRow key={row.id} className={styles.tableRow}>
                          <TableCell className={styles.tableCell}>
                            {row.courseName}
                          </TableCell>
                          <TableCell className={`${styles.tableCell} ${styles.gradeCell} ${getGradeColorClass(row.grade)}`}>
                            {row.grade}
                          </TableCell>
                          <TableCell className={styles.tableCell}>
                            {row.year}
                          </TableCell>
                          <TableCell className={styles.tableCell}>
                            {row.semester}
                          </TableCell>
                        </TableRow>
                      ))}
                      {coursesRows.length === 0 && (
                        <TableRow className={styles.tableRow}>
                          <TableCell colSpan={4} className={styles.emptyState}>
                            No grade data to display ✨
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default GradeReport;
