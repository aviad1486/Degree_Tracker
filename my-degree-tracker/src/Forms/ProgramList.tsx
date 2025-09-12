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
import type { Program } from "../models/Program";
import { useNavigate } from "react-router-dom";

import { firestore } from "../firestore/config";
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
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 800 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Study Programs</Typography>
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
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell>{program.name}</TableCell>
                <TableCell>{program.totalCreditsRequired}</TableCell>
                <TableCell>{program.courses.join(", ")}</TableCell>
                <TableCell>
                  {program.createdAt
                    ? new Date(program.createdAt).toLocaleString()
                    : "—"}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(program.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(program.id)}>
                    <DeleteIcon />
                  </IconButton>
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

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" onClick={() => navigate("/programs/new")}>
          Add Program
        </Button>
      </Box>
    </Box>
  );
};

export default ProgramList;