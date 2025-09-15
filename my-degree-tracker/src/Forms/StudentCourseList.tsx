import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import type { StudentCourse } from "../models/StudentCourse";

import { firestore } from "../firestore/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const StudentCourseList: React.FC = () => {
  const [records, setRecords] = useState<StudentCourse[]>([]);
  const navigate = useNavigate();

  // טוען את כל הרשומות מ-Firestore
  useEffect(() => {
    const fetchRecords = async () => {
      const snap = await getDocs(collection(firestore, "studentCourses"));
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as StudentCourse) }));
      setRecords(data);
    };
    fetchRecords();
  }, []);

  // מוחק רשומה לפי ה-ID שלה ב-Firestore
  const handleDelete = async (docId: string) => {
    await deleteDoc(doc(firestore, "studentCourses", docId));
    setRecords((prev) => prev.filter((rec) => (rec as any).id !== docId));
  };

  const handleEdit = (docId: string) => {
    navigate(`/student-courses/edit/${docId}`);
  };

  return (
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 900, p: { xs: 2, sm: 0 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography 
          variant="h6"
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          Student Grades
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
                Student ID
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Course
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Grade
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', sm: 'table-cell' }
              }}>
                Semester
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', md: 'table-cell' }
              }}>
                Year
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', lg: 'table-cell' }
              }}>
                Attempts
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
            {records.map((record) => (
              <TableRow key={(record as any).id}>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {record.studentId}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {record.courseCode}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {record.grade}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  {record.semester}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', md: 'table-cell' }
                }}>
                  {record.year}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', lg: 'table-cell' }
                }}>
                  {typeof record.retaken === "number"
                    ? record.retaken
                    : record.retaken
                    ? 2
                    : 1}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', lg: 'table-cell' }
                }}>
                  {record.createdAt
                    ? new Date(record.createdAt).toLocaleString()
                    : "—"}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleEdit((record as any).id)}
                    size="small"
                    sx={{ p: { xs: 0.5, sm: 1 } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete((record as any).id)}
                    size="small"
                    sx={{ p: { xs: 0.5, sm: 1 } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {records.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={8} 
                  align="center"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  No grade records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          onClick={() => navigate("/student-courses/new")}
          sx={{ 
            minHeight: { xs: 44, sm: 36 },
            fontSize: { xs: '0.875rem', sm: '0.875rem' }
          }}
        >
          Add Grade
        </Button>
      </Box>
    </Box>
  );
};

export default StudentCourseList;