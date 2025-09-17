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
  IconButton,
  Tooltip,
  Skeleton,
  Button,
  Paper,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../firestore/config";
import type { Course } from "../../models/Course";

import styles from "../styles/CourseList.module.css";

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, "courses"));
      const data: Course[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as Course),
        courseCode: docSnap.id,
      }));
      setCourses(data);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, "courses", id));
      setCourses((prev) => prev.filter((c) => c.courseCode !== id));
    } catch (error) {
      console.error("❌ Error deleting course:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Box className={styles.courseListContainer}>
      <Card className={styles.courseListCard}>
        <CardContent>
          <Typography className={styles.courseListTitle}>
            Course Management
          </Typography>

          <TableContainer component={Paper} className={styles.tableWrapper}>
            <Table>
              <TableHead className={styles.tableHeader}>
                <TableRow>
                  <TableCell className={styles.tableHeaderCell}>Code</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Name</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Credits</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Semester</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Assignments</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton variant="rectangular" height={40} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className={styles.emptyState}>
                      No courses found
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course.courseCode} className={styles.tableRow}>
                      <TableCell className={styles.tableCell}>
                        {course.courseCode}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {course.courseName}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {course.credits}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {course.semester}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {(course.assignments || []).join(", ")}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
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

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/courses/new")}
              className={styles.addButton}
            >
              ➕ Add Course
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CourseList;