import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Paper, TableContainer, IconButton, Box, Typography, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import type { Student } from '../models/Student';

const avgFromGradeSheet = (gradeSheet: Record<string, number> | undefined | null) => {
  if (!gradeSheet || typeof gradeSheet !== 'object' || Array.isArray(gradeSheet)) return null;
  const grades = Object.values(gradeSheet).filter(
    (g) => typeof g === 'number' && !Number.isNaN(g)
  );
  if (grades.length === 0) return null;
  const sum = grades.reduce((a, b) => a + b, 0);
  return sum / grades.length;
};

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(stored);
  }, []);

  const handleDelete = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    localStorage.setItem('students', JSON.stringify(updated));
    setStudents(updated);
  };

  const handleEdit = (id: string) => {
    navigate(`/students/edit/${id}`);
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 800 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Student List</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Average</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{(student.courses || []).join(', ')}</TableCell>
                <TableCell>{student.program}</TableCell>
                <TableCell>
                  {(() => {
                    const avg = avgFromGradeSheet((student as any).gradeSheet);
                    return avg === null ? '—' : avg.toFixed(1);
                  })()}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(student.id)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(student.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Add Student button under the table */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          onClick={() => navigate('/students/new')}        >
          Add Student
        </Button>
      </Box>
    </Box>
  );
};

export default StudentList;
