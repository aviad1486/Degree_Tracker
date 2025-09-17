// src/Forms/StudentList.tsx
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
  Skeleton,
  Button,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../firestore/config";
import type { Student } from "../../models/Student";

import styles from "../styles/StudentList.module.css";

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, "students", id));
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("❌ Error deleting student:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <Box className={styles.studentListContainer}>
      <Card className={styles.studentListCard}>
        <CardContent>
          <Typography className={styles.studentListTitle}>
            Student Management
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead className={styles.studentTableHeader}>
                <TableRow>
                  <TableCell className={styles.studentTableHeaderCell}>
                    Full Name
                  </TableCell>
                  <TableCell className={styles.studentTableHeaderCell}>
                    ID
                  </TableCell>
                  <TableCell className={styles.studentTableHeaderCell}>
                    Email
                  </TableCell>
                  <TableCell className={styles.studentTableHeaderCell}>
                    Courses
                  </TableCell>
                  <TableCell className={styles.studentTableHeaderCell}>
                    Program
                  </TableCell>
                  <TableCell className={styles.studentTableHeaderCell}>
                    Average
                  </TableCell>
                  <TableCell
                    className={styles.studentTableHeaderCell}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i} className={styles.loadingSkeleton}>
                      <TableCell colSpan={7}>
                        <Skeleton variant="rectangular" height={40} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className={styles.emptyState}>
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow
                      key={student.id}
                      className={styles.studentTableRow}
                    >
                      <TableCell className={styles.studentTableCell}>
                        {student.fullName}
                      </TableCell>
                      <TableCell className={styles.studentTableCell}>
                        {student.id}
                      </TableCell>
                      <TableCell className={styles.studentTableCell}>
                        {student.email}
                      </TableCell>
                      <TableCell className={styles.studentTableCell}>
                        {(student.courses || []).join(", ")}
                      </TableCell>
                      <TableCell className={styles.studentTableCell}>
                        {student.program}
                      </TableCell>
                      <TableCell className={styles.studentTableCell}>
                        {(() => {
                          const grades = student.gradeSheet
                            ? Object.values(student.gradeSheet).filter(
                                (g) =>
                                  typeof g === "number" && !Number.isNaN(g)
                              )
                            : [];
                          if (grades.length === 0) return "—";
                          const avg =
                            grades.reduce(
                              (a, b) => a + (b as number),
                              0
                            ) / grades.length;
                          return avg.toFixed(1);
                        })()}
                      </TableCell>
                      <TableCell
                        className={styles.studentTableCell}
                        align="right"
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/students/edit/${student.id}`)
                            }
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
            <Button
              variant="contained"
              onClick={() => navigate("/students/new")}
            >
              ➕ Add Student
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentList;