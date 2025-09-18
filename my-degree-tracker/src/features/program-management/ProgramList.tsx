// src/Forms/ProgramList.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Button,
  LinearProgress,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../firestore/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import type { Program } from "../../models/Program";

import SnackbarNotification from "../../components/ui/SnackbarNotification";
import styles from "../styles/Lists.module.css";

const ProgramList: React.FC = () => {
  const [programs, setPrograms] = useState<(Program & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");
  const navigate = useNavigate();

  // טוען את כל ה-Programs מ-Firestore
  const fetchPrograms = async () => {
    try {
      const snap = await getDocs(collection(firestore, "programs"));
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Program) }));
      setPrograms(data);
    } catch (error) {
      console.error("❌ Error fetching programs:", error);
      setSnackMsg("Error loading programs");
      setSnackSeverity("error");
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // מוחק Program לפי ה-id שלו
  const handleDelete = async (docId: string) => {
    try {
      await deleteDoc(doc(firestore, "programs", docId));
      setPrograms((prev) => prev.filter((p) => p.id !== docId));
      setSnackMsg("Program deleted successfully");
      setSnackSeverity("success");
      setSnackOpen(true);
    } catch (error) {
      console.error("❌ Error deleting program:", error);
      setSnackMsg("Error deleting program");
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  };

  const handleEdit = (docId: string) => {
    navigate(`/programs/edit/${docId}`);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <Box className={styles.listContainer} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}>
        <Typography variant="h6" style={{ color: 'white', marginBottom: '1rem' }}>
          🎓 Loading Study Programs...
        </Typography>
        <LinearProgress style={{ width: '300px', height: '4px' }} />
      </Box>
    );
  }

  return (
    <Box className={styles.listContainer}>
      <Card className={styles.listCard}>
        <CardContent>
          <Typography variant="h2" className={styles.listTitle}>
            Study Programs
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead className={styles.listTableHeader}>
                <TableRow>
                  <TableCell className={styles.listTableHeaderCell}>
                    Program Name
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Total Credits
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Courses
                  </TableCell>
                  <TableCell className={styles.listTableHeaderCell}>
                    Created
                  </TableCell>
                  <TableCell
                    className={styles.listTableHeaderCell}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {programs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className={styles.emptyState}>
                      No study programs found
                    </TableCell>
                  </TableRow>
                ) : (
                  programs.map((program) => (
                    <TableRow key={program.id} className={styles.listTableRow}>
                      <TableCell className={styles.listTableCell}>
                        {program.name}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {program.totalCreditsRequired}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {program.courses.join(", ")}
                      </TableCell>
                      <TableCell className={styles.listTableCell}>
                        {program.createdAt
                          ? new Date(program.createdAt).toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell
                        className={styles.listTableCell}
                        align="right"
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(program.id)}
                            className={`${styles.actionButton} ${styles.editButton}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(program.id)}
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/programs/new")}
            >
              ➕ Add Program
            </Button>
          </Box>
        </CardContent>
      </Card>

      <SnackbarNotification
        open={snackOpen}
        severity={snackSeverity}
        message={snackMsg}
        onClose={() => setSnackOpen(false)}
      />
    </Box>
  );
};

export default ProgramList;