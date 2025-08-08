import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Box, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface StudyProgram {
  name: string;
  totalCreditsRequired: number;
  courses: string[];
  createdAt: string;
}

const ProgramList: React.FC = () => {
  const [programs, setPrograms] = useState<StudyProgram[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('programs') || '[]');
    setPrograms(stored);
  }, []);

  const handleDelete = (name: string) => {
    const filtered = programs.filter(p => p.name !== name);
    setPrograms(filtered);
    localStorage.setItem('programs', JSON.stringify(filtered));
  };

  const handleEdit = (name: string) => {
    console.log(`Edit program ${name}`);
    // TODO: implement edit functionality
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 800 }}>
      <Typography variant="h6" gutterBottom>Study Programs</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Program Name</TableCell>
              <TableCell>Total Credits Required</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map(program => (
              <TableRow key={program.name}>
                <TableCell>{program.name}</TableCell>
                <TableCell>{program.totalCreditsRequired}</TableCell>
                <TableCell>{program.courses.join(', ')}</TableCell>
                <TableCell>{new Date(program.createdAt).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(program.name)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(program.name)}>
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

export default ProgramList;