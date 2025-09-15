import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import type { StudentCourse } from "../models/StudentCourse";

import { firestore } from "../firestore/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const StudentCourseList: React.FC = () => {
  const [records, setRecords] = useState<StudentCourse[]>([]);
  const navigate = useNavigate();

  // טוען את כל הרשומות מ-Firestore
  useEffect(() => {
    const fetchRecords = async () => {
      const snap = await getDocs(collection(firestore, "studentCourses"));
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as StudentCourse) }));
      setRecords(data);
    };
    fetchRecords();
  }, []);

  // מוחק רשומה לפי ה-ID שלה ב-Firestore
  const handleDelete = async (docId: string) => {
    await deleteDoc(doc(firestore, "studentCourses", docId));
    setRecords((prev) => prev.filter((rec) => (rec as any).id !== docId));
  };

  const handleEdit = (docId: string) => {
    navigate(`/student-courses/edit/${docId}`);
  };

  return (
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 900 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Student Course Records</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Course Code</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Retaken</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={(record as any).id}>
                <TableCell>{record.studentId}</TableCell>
                <TableCell>{record.courseCode}</TableCell>
                <TableCell>{record.grade}</TableCell>
                <TableCell>{record.semester}</TableCell>
                <TableCell>{record.year}</TableCell>
                <TableCell>
                  {typeof record.retaken === "number"
                    ? record.retaken
                    : record.retaken
                    ? 2
                    : 1}
                </TableCell>
                <TableCell>
                  {record.createdAt
                    ? new Date(record.createdAt).toLocaleString()
                    : "—"}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit((record as any).id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete((record as any).id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No student course records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          onClick={() => navigate("/student-courses/new")}
        >
          Add Student Course
        </Button>
      </Box>
    </Box>
  );
};

export default StudentCourseList;