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
  Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { Program } from "../../models/Program";
import { useNavigate } from "react-router-dom";

import { firestore } from "../../firestore/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

import styles from "../styles/ProgramList.module.css";

const ProgramList: React.FC = () => {
  const [programs, setPrograms] = useState<(Program & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // טוען את כל ה-Programs מ-Firestore
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const snap = await getDocs(collection(firestore, "programs"));
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Program),
        }));
        setPrograms(data);
      } catch (err) {
        console.error("❌ Error fetching programs:", err);
      } finally {
        setLoading(false);
      }
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
    <Box className={styles.programListContainer}>
      <Card className={styles.programListCard}>
        <CardContent>
          <Typography className={styles.programListTitle}>
            Study Programs
          </Typography>

          <TableContainer component={Paper} className={styles.tableWrapper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className={styles.tableHeaderCell}>
                    Program Name
                  </TableCell>
                  <TableCell className={styles.tableHeaderCell}>
                    Total Credits
                  </TableCell>
                  <TableCell
                    className={styles.tableHeaderCell}
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    Courses
                  </TableCell>
                  <TableCell
                    className={styles.tableHeaderCell}
                    sx={{ display: { xs: "none", lg: "table-cell" } }}
                  >
                    Created
                  </TableCell>
                  <TableCell
                    className={styles.tableHeaderCell}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}>
                        <Skeleton variant="rectangular" height={40} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : programs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className={styles.emptyState}>
                      No study programs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  programs.map((program) => (
                    <TableRow key={program.id} className={styles.tableRow}>
                      <TableCell className={styles.tableCell}>
                        {program.name}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {program.totalCreditsRequired}
                      </TableCell>
                      <TableCell
                        className={styles.tableCell}
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        {program.courses.join(", ")}
                      </TableCell>
                      <TableCell
                        className={styles.tableCell}
                        sx={{ display: { xs: "none", lg: "table-cell" } }}
                      >
                        {program.createdAt
                          ? new Date(program.createdAt).toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell
                        className={`${styles.tableCell} ${styles.actionsCell}`}
                        align="right"
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEdit(program.id)}
                            size="small"
                            className={`${styles.actionButton} ${styles.editButton}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(program.id)}
                            size="small"
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
              className={styles.addButton}
            >
              ➕ Add Program
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProgramList;