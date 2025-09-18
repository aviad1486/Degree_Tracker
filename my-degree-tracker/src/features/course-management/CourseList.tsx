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
import type { Course } from "../../models/Course";

import SnackbarNotification from "../../components/ui/SnackbarNotification";
import styles from "../styles/Lists.module.css";

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, "courses"));
      const data = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as Course),
        courseCode: docSnap.id,
      }));
      setCourses(data);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      setSnackMsg("Error fetching courses");
      setSnackSeverity("error");
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseCode: string) => {
    try {
      await deleteDoc(doc(firestore, "courses", courseCode));
      setCourses((prev) => prev.filter((c) => c.courseCode !== courseCode));
      setSnackMsg("Course deleted successfully");
      setSnackSeverity("success");
      setSnackOpen(true);
    } catch (error) {
      console.error("❌ Error deleting course:", error);
      setSnackMsg("Error deleting course");
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  };

  useEffect(() => {
    fetchCourses();
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
          📖 Loading Course List...
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
            Course List
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead className={styles.listTableHeader}>
                <TableRow>
                  <TableCell className={styles.listTableHeaderCell}>
                    Course Code
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Course Name
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Credits
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Semester
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Assignments
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className={styles.emptyState}>
                      No courses found
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course.courseCode} className={styles.listTableRow}>
                      <TableCell className={styles.listTableCell}>
                        {course.courseCode}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {course.courseName}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {course.credits}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {course.semester}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {(course.assignments || []).join(", ")}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/courses/edit/${course.courseCode}`)}
                            className={`${styles.actionButton} ${styles.editButton}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(course.courseCode)}
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
            <Button variant="contained" onClick={() => navigate("/courses/new")}>
              ➕ Add Course
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

export default CourseList;