import React, { useState, useEffect } from 'react';
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
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../components/Course';

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('courses') || '[]');
    setCourses(stored);
  }, []);

  const handleDelete = (code: string) => {
    const filtered = courses.filter(c => c.courseCode !== code);
    setCourses(filtered);
    localStorage.setItem('courses', JSON.stringify(filtered));
  };

  const handleEdit = (code: string) => {
    navigate(`/courses/edit/${code}`);
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 800 }}>
      <Typography variant="h6" gutterBottom>Course List</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Code</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Assignments</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map(course => (
              <TableRow key={course.courseCode}>
                <TableCell>{course.courseCode}</TableCell>
                <TableCell>{course.courseName}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>{course.semester}</TableCell>
                <TableCell>{course.assignments.join(', ')}</TableCell>
                <TableCell>{new Date(course.createdAt).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(course.courseCode)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(course.courseCode)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourseList;