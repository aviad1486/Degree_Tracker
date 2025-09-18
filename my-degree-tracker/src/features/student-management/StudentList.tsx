import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Button,
  LinearProgress,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../firestore/config";
import type { Student } from "../../models/Student";

import SnackbarNotification from "../../components/ui/SnackbarNotification"; // ✅ נוספה התראה
import styles from "../styles/Lists.module.css";

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ לניהול SnackBar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, "students"));
      const data: Student[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as Student),
        id: docSnap.id,
      }));
      setStudents(data);
    } catch (error) {
      console.error("❌ Error fetching students:", error);
      setSnackMsg("Error fetching students");
      setSnackSeverity("error");
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, "students", id));
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setSnackMsg("Student deleted successfully");
      setSnackSeverity("success");
      setSnackOpen(true);
    } catch (error) {
      console.error("❌ Error deleting student:", error);
      setSnackMsg("Error deleting student");
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <Box className={styles.listContainer} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}>
        <Typography variant="h6" style={{ color: 'white', marginBottom: '1rem' }}>
          📚 Loading Student List...
        </Typography>
        <LinearProgress style={{ width: '300px', height: '4px' }} />
      </Box>
    );
  }

  return (
    <Box className={styles.listContainer}>
      <Card className={styles.listCard}>
        <CardContent>
          <Typography variant="h2" className={styles.listTitle}>
            Student List
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead className={styles.listTableHeader}>
                <TableRow>
                  <TableCell className={styles.listTableHeaderCell}>Full Name</TableCell>
                  <TableCell className={styles.listTableHeaderCell}>ID</TableCell>
                  <TableCell className={styles.listTableHeaderCell}>Email</TableCell>
                  <TableCell className={styles.listTableHeaderCell}>Courses</TableCell>
                  <TableCell className={styles.listTableHeaderCell}>Program</TableCell>
                  <TableCell className={styles.listTableHeaderCell}>Average</TableCell>
                  <TableCell className={styles.listTableHeaderCell} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className={styles.emptyState}>
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id} className={styles.listTableRow}>
                      <TableCell className={styles.listTableCell}>{student.fullName}</TableCell>
                      <TableCell className={styles.listTableCell}>{student.id}</TableCell>
                      <TableCell className={styles.listTableCell}>{student.email}</TableCell>
                      <TableCell className={styles.listTableCell}>
                        {(student.courses || []).join(", ")}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>{student.program}</TableCell>
                      <TableCell className={styles.listTableCell}>
                        {(() => {
                          const grades = student.gradeSheet
                            ? Object.values(student.gradeSheet).filter(
                                (g) => typeof g === "number" && !Number.isNaN(g)
                              )
                            : [];
                          if (grades.length === 0) return "—";
                          const avg =
                            grades.reduce((a, b) => a + (b as number), 0) / grades.length;
                          return avg.toFixed(1);
                        })()}
                      </TableCell>
                      <TableCell className={styles.listTableCell} align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/students/edit/${student.id}`)}
                            className={`${styles.actionButton} ${styles.editButton}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(student.id)}
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="contained" onClick={() => navigate("/students/new")}>
              ➕ Add Student
            </Button>
          </Box>
        </CardContent>
      </Card>

      <SnackbarNotification
        open={snackOpen}
        severity={snackSeverity}
        message={snackMsg}
        onClose={() => setSnackOpen(false)}
      />
    </Box>
  );
};

export default StudentList;