import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  IconButton,
  Box,
  Typography,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import type { Course } from "../models/Course";

import { firestore } from "../firestore/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<(Course & { id: string })[]>([]);
  const navigate = useNavigate();

  // טוען את כל הקורסים מ-Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      const snap = await getDocs(collection(firestore, "courses"));
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Course) }));
      setCourses(data);
    };
    fetchCourses();
  }, []);

  // מוחק קורס לפי courseCode
  const handleDelete = async (docId: string) => {
    await deleteDoc(doc(firestore, "courses", docId));
    setCourses((prev) => prev.filter((c) => c.id !== docId));
  };

  const handleEdit = (docId: string) => {
    navigate(`/courses/edit/${docId}`);
  };

  return (
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 800 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Course List</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Assignments</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.courseCode}</TableCell>
                <TableCell>{course.courseName}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>{course.semester}</TableCell>
                <TableCell>{course.assignments.join(", ")}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(course.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(course.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" onClick={() => navigate("/courses/new")}>
          Add Course
        </Button>
      </Box>
    </Box>
  );
};

export default CourseList;