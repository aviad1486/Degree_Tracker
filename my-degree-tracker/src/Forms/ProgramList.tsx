import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Box, Typography, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { Program } from '../models/Program';
import { makePrograms } from '../models/seed';
import { useNavigate } from 'react-router-dom';

const ProgramList: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('programs') || '[]');
    setPrograms(stored);
  }, []);

  const handleDelete = (name: string) => {
    const filtered = programs.filter(p => p.name !== name);
    localStorage.setItem('programs', JSON.stringify(filtered));
    setPrograms(filtered);
  };

  const handleEdit = (name: string) => {
    navigate(`/programs/edit/${name}`);
  };

  const handleLoadDummy = () => {
    const existing = JSON.parse(localStorage.getItem('programs') || '[]');
    if (Array.isArray(existing) && existing.length > 0) {
      alert('Programs already exist in localStorage.');
      return;
    }
    const dummy = makePrograms();
    localStorage.setItem('programs', JSON.stringify(dummy));
    setPrograms(dummy);
    alert('Dummy programs loaded!');
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 800 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Study Programs</Typography>
        <Button variant="outlined" onClick={handleLoadDummy}>Load Dummy Programs</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Program Name</TableCell>
              <TableCell>Total Credits</TableCell>
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
                  <IconButton onClick={() => handleEdit(program.name)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(program.name)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {programs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No programs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProgramList;
