import React, { useState, useEffect } from "react";
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
import type { Program } from "../../models/Program";
import { useNavigate } from "react-router-dom";

import { firestore } from "../../firestore/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const ProgramList: React.FC = () => {
  const [programs, setPrograms] = useState<(Program & { id: string })[]>([]);
  const navigate = useNavigate();

  // טוען את כל ה-Programs מ-Firestore
  useEffect(() => {
    const fetchPrograms = async () => {
      const snap = await getDocs(collection(firestore, "programs"));
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Program) }));
      setPrograms(data);
    };
    fetchPrograms();
  }, []);

  // מוחק Program לפי ה-id שלו
  const handleDelete = async (docId: string) => {
    await deleteDoc(doc(firestore, "programs", docId));
    setPrograms((prev) => prev.filter((p) => p.id !== docId));
  };

  const handleEdit = (docId: string) => {
    navigate(`/programs/edit/${docId}`);
  };

  return (
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 800, p: { xs: 2, sm: 0 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography 
          variant="h6"
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          Study Programs
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
                Program Name
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Total Credits
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', md: 'table-cell' }
              }}>
                Courses
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', lg: 'table-cell' }
              }}>
                Created
              </TableCell>
              <TableCell 
                align="right"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {program.name}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {program.totalCreditsRequired}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', md: 'table-cell' }
                }}>
                  {program.courses.join(", ")}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', lg: 'table-cell' }
                }}>
                  {program.createdAt
                    ? new Date(program.createdAt).toLocaleString()
                    : "—"}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleEdit(program.id)}
                    size="small"
                    sx={{ p: { xs: 0.5, sm: 1 } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(program.id)}
                    size="small"
                    sx={{ p: { xs: 0.5, sm: 1 } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {programs.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={5} 
                  align="center"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  No study programs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button 
          variant="contained" 
          onClick={() => navigate("/programs/new")}
          sx={{ 
            minHeight: { xs: 44, sm: 36 },
            fontSize: { xs: '0.875rem', sm: '0.875rem' }
          }}
        >
          Add Program
        </Button>
      </Box>
    </Box>
  );
};

export default ProgramList;