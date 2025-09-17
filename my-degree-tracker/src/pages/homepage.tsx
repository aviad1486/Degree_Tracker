import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firestore/config";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import styles from "../styles/Homepage.module.css";

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [program, setProgram] = useState<string>("");
  const [totalCredits, setTotalCredits] = useState(0);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [gpa, setGpa] = useState(0);
  const [assignments, setAssignments] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          const q = query(
            collection(firestore, "students"),
            where("email", "==", user.email),
            limit(1)
          );
          const snap = await getDocs(q);

          if (!snap.empty) {
            const student = snap.docs[0].data() as any;

            setStudentName(student.fullName);
            setProgram(student.program ?? "");
            setCompletedCredits(Number(student.completedCredits ?? 0));
            setTotalCredits(Number(student.totalCredits ?? 120));

            // ממוצע ציונים נשאר כמו קודם אם תרצה להשתמש ב-gradeSheet
            const grades = student.gradeSheet ?? {};
            const values = Object.values(grades).filter((g) => typeof g === "number");
            if (values.length > 0) {
              const avg = values.reduce((a, b) => a + b, 0) / values.length;
              setGpa(Number(avg.toFixed(2)));
            } else {
              setGpa(0);
            }

            // שמירה של כל ה-assignments מהסטודנט
            setAssignments(student.assignments ?? []);
          } else {
            console.warn("⚠️ Student with this email not found");
            setStudentName(user.email);
          }
        } catch (err) {
          console.error("❌ Error fetching student:", err);
          setStudentName(user.email ?? "Student");
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <div className={styles.homepageContainer}>
      {loading && <LinearProgress className={styles.loadingBar} />}

      {!loading && (
        <>
          {/* Professional Welcome Title */}
          <Typography 
            variant="h2" 
            component="h1"
            className={styles.welcomeTitle}
          >
            Hello, {studentName ?? "Student"}! 👋
          </Typography>

          {/* Professional Stats Grid */}
          <div className={styles.statsGrid}>
            {/* Credits Card */}
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
                  value={(completedCredits / totalCredits) * 100}
                  className={styles.progressBar}
                />
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

            {/* Study Program Card */}
            <Card className={styles.statCard}>
              <CardContent className={styles.statCardContent}>
                <Typography className={styles.statTitle}>
                  Study Program
                </Typography>
                <Typography className={styles.programText}>
                  {program || "Program 1"}
                </Typography>
              </CardContent>
            </Card>
          </div>

          {/* Professional Assignments Section */}
          <div className={styles.assignmentsSection}>
            <Typography className={styles.sectionTitle}>
              Assignments
            </Typography>
            <TableContainer 
              component={Paper} 
              className={styles.assignmentsTable}
            >
              <Table>
                <TableHead className={styles.tableHeader}>
                  <TableRow>
                    <TableCell className={styles.tableHeaderCell}>
                      Assignment Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.map((assignment, idx) => (
                    <TableRow key={idx} className={styles.tableRow}>
                      <TableCell className={styles.tableCell}>
                        {assignment}
                      </TableCell>
                    </TableRow>
                  ))}
                  {assignments.length === 0 && (
                    <TableRow className={styles.tableRow}>
                      <TableCell className={styles.emptyState}>
                        No assignments to display ✨
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Professional Quick Links */}
          <div className={styles.quickLinksSection}>
            <Typography className={styles.sectionTitle}>
              Quick Links
            </Typography>
            <div className={styles.buttonGrid}>
              <Button 
                variant="contained" 
                component={Link} 
                to="/progress"
                className={styles.actionButton}
              >
                My Progress
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/grade-report"
                className={styles.actionButton}
              >
                Grade Report
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/my-courses"
                className={styles.actionButton}
              >
                My Courses
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/my-program"
                className={styles.actionButton}
              >
                My Program
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/help"
                className={styles.actionButton}
              >
                Help & Support
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/logout"
                className={styles.actionButton}
              >
                Logout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;