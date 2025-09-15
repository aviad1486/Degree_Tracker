// src/Forms/StudentList.tsx
import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Paper, TableContainer, IconButton, Box, Typography, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import type { Student } from '../models/Student';

import { firestore } from '../firestore/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

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

  // טוען סטודנטים מ-Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      const snap = await getDocs(collection(firestore, 'students'));
      const data = snap.docs.map(d => d.data() as Student);
      setStudents(data);
    };
    fetchStudents();
  }, []);

  // מוחק סטודנט מ-Firestore
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(firestore, 'students', id));
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleEdit = (id: string) => {
    navigate(`/students/edit/${id}`);
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 800, p: { xs: 2, sm: 0 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography 
          variant="h6"
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          רשימת סטודנטים
        </Typography>
      </Box>
      <TableContainer 
        component={Paper}
        sx={{
          '& .MuiTable-root': {
            minWidth: { xs: 'auto', sm: 650 }
          }
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                שם מלא
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', sm: 'table-cell' }
              }}>
                ת.ז
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', md: 'table-cell' }
              }}>
                אימייל
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', lg: 'table-cell' }
              }}>
                קורסים
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', md: 'table-cell' }
              }}>
                תוכנית
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                ממוצע
              </TableCell>
              <TableCell 
                align="right"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                פעולות
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {student.fullName}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  {student.id}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', md: 'table-cell' }
                }}>
                  {student.email}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', lg: 'table-cell' }
                }}>
                  {(student.courses || []).join(', ')}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', md: 'table-cell' }
                }}>
                  {student.program}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {(() => {
                    const avg = avgFromGradeSheet(student.gradeSheet);
                    return avg === null ? '—' : avg.toFixed(1);
                  })()}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleEdit(student.id)}
                    size="small"
                    sx={{ p: { xs: 0.5, sm: 1 } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(student.id)}
                    size="small"
                    sx={{ p: { xs: 0.5, sm: 1 } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={7} 
                  align="center"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  לא נמצאו סטודנטים.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* כפתור להוספת סטודנט */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          onClick={() => navigate('/students/new')}
          sx={{ 
            minHeight: { xs: 44, sm: 36 },
            fontSize: { xs: '0.875rem', sm: '0.875rem' }
          }}
        >
          הוסף סטודנט
        </Button>
      </Box>
    </Box>
  );
};

export default StudentList;