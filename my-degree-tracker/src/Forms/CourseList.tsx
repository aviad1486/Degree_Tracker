import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Paper, TableContainer, IconButton, Box, Typography, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../models/Course';
import { makeCourses } from '../models/seed';

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('courses') || '[]');
    setCourses(stored);
  }, []);

  const handleDelete = (code: string) => {
    const updated = courses.filter(c => c.courseCode !== code);
    localStorage.setItem('courses', JSON.stringify(updated));
    setCourses(updated);
  };

  const handleEdit = (code: string) => {
    navigate(`/courses/edit/${code}`);
  };

  const handleLoadDummy = () => {
    const existing = JSON.parse(localStorage.getItem('courses') || '[]');
    if (Array.isArray(existing) && existing.length > 0) {
      alert('Courses already exist in localStorage.');
      return;
    }
    const dummy = makeCourses();
    localStorage.setItem('courses', JSON.stringify(dummy));
    setCourses(dummy);
    alert('Dummy courses loaded!');
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 800 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Course List</Typography>
        <Button variant="outlined" onClick={handleLoadDummy}>Load Dummy Courses</Button>
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
            {courses.map(course => (
              <TableRow key={course.courseCode}>
                <TableCell>{course.courseCode}</TableCell>
                <TableCell>{course.courseName}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>{course.semester}</TableCell>
                <TableCell>{course.assignments.join(', ')}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(course.courseCode)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(course.courseCode)}><DeleteIcon /></IconButton>
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
    </Box>
  );
};

export default CourseList;
