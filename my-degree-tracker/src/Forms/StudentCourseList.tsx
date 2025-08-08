import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Box, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface StudentCourse {
  studentId: string;
  courseCode: string;
  grade: number;
  semester: 'A' | 'B' | 'C';
  year: number;
  retaken: boolean;
  createdAt: string;
}

const StudentCourseList: React.FC = () => {
  const [records, setRecords] = useState<StudentCourse[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('studentCourses') || '[]');
    setRecords(stored);
  }, []);

  const handleDelete = (index: number) => {
    const updated = records.filter((_, i) => i !== index);
    setRecords(updated);
    localStorage.setItem('studentCourses', JSON.stringify(updated));
  };

  const handleEdit = (index: number) => {
    console.log(`Edit record at index ${index}`);
    // TODO: implement edit functionality
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 900 }}>
      <Typography variant="h6" gutterBottom>Student Course Records</Typography>
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
            {records.map((rec, idx) => (
              <TableRow key={idx}>
                <TableCell>{rec.studentId}</TableCell>
                <TableCell>{rec.courseCode}</TableCell>
                <TableCell>{rec.grade}</TableCell>
                <TableCell>{rec.semester}</TableCell>
                <TableCell>{rec.year}</TableCell>
                <TableCell>{rec.retaken ? 'Yes' : 'No'}</TableCell>
                <TableCell>{new Date(rec.createdAt).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(idx)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(idx)}>
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

export default StudentCourseList;
