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
import type { StudentCourse } from "../../models/StudentCourse";

import { firestore } from "../../firestore/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

import SnackbarNotification from "../../components/ui/SnackbarNotification";
import styles from "../styles/Lists.module.css";

const StudentCourseList: React.FC = () => {
  const [records, setRecords] = useState<(StudentCourse & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");
  const navigate = useNavigate();

  // טוען את כל הרשומות מ-Firestore
  const fetchRecords = async () => {
    try {
      const snap = await getDocs(collection(firestore, "studentCourses"));
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as StudentCourse),
      }));
      setRecords(data);
    } catch (error) {
      console.error("❌ Error fetching student courses:", error);
      setSnackMsg("Error loading grade records");
      setSnackSeverity("error");
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // מוחק רשומה לפי ה-ID שלה ב-Firestore
  const handleDelete = async (docId: string) => {
    try {
      await deleteDoc(doc(firestore, "studentCourses", docId));
      setRecords((prev) => prev.filter((rec) => rec.id !== docId));
      setSnackMsg("Grade record deleted successfully");
      setSnackSeverity("success");
      setSnackOpen(true);
    } catch (error) {
      console.error("❌ Error deleting record:", error);
      setSnackMsg("Error deleting grade record");
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  };

  const handleEdit = (docId: string) => {
    navigate(`/student-courses/edit/${docId}`);
  };

  useEffect(() => {
    fetchRecords();
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
          📊 Loading Grade Records...
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
            Student Course Records
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead className={styles.listTableHeader}>
                <TableRow>
                  <TableCell className={styles.listTableHeaderCell}>
                    Student ID
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Course
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Grade
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Semester
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Year
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Attempts
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Created
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className={styles.emptyState}>
                      No grade records found
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.id} className={styles.listTableRow}>
                      <TableCell className={styles.listTableCell}>
                        {record.studentId}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {record.courseCode}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {record.grade}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {record.semester}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {record.year}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {typeof record.retaken === "number"
                          ? record.retaken
                          : record.retaken
                          ? 2
                          : 1}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {record.createdAt
                          ? new Date(record.createdAt).toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell className={styles.listTableCell} align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(record.id)}
                            className={`${styles.actionButton} ${styles.editButton}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(record.id)}
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
            <Button
              variant="contained"
              onClick={() => navigate("/student-courses/new")}
            >
              ➕ Add Grade
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

export default StudentCourseList;