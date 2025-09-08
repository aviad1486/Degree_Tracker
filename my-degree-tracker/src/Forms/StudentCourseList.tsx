import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Box, Typography, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import type { StudentCourse } from '../models/StudentCourse';

const StudentCourseList: React.FC = () => {
  const [records, setRecords] = useState<StudentCourse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('studentCourses') || '[]');
    setRecords(stored);
  }, []);

  const handleDelete = (index: number) => {
    const updated = records.filter((_, i) => i !== index);
    localStorage.setItem('studentCourses', JSON.stringify(updated));
    setRecords(updated);
  };

  const handleEdit = (index: number) => {
    navigate(`/student-courses/edit/${index}`);
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 900 }}>
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
            {records.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.studentId}</TableCell>
                <TableCell>{record.courseCode}</TableCell>
                <TableCell>{record.grade}</TableCell>
                <TableCell>{record.semester}</TableCell>
                <TableCell>{record.year}</TableCell>
                {/* Show numeric attempts, default to 1 if undefined */}
                <TableCell>{typeof record.retaken === 'number' ? record.retaken : (record.retaken ? 2 : 1)}</TableCell>
                <TableCell>{new Date(record.createdAt).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(index)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(index)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">No student course records found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          onClick={() => navigate('/student-courses/new')}        >
          Add Student Course
          </Button>
      </Box>
    </Box>
  );
};

export default StudentCourseList;