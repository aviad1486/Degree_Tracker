import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  IconButton,
  Box,
  Typography,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import type { Course } from "../../models/Course";

import { firestore } from "../../firestore/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<(Course & { id: string })[]>([]);
  const navigate = useNavigate();

  // טוען את כל הקורסים מ-Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      const snap = await getDocs(collection(firestore, "courses"));
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Course) }));
      setCourses(data);
    };
    fetchCourses();
  }, []);

  // מוחק קורס לפי courseCode
  const handleDelete = async (docId: string) => {
    await deleteDoc(doc(firestore, "courses", docId));
    setCourses((prev) => prev.filter((c) => c.id !== docId));
  };

  const handleEdit = (docId: string) => {
    navigate(`/courses/edit/${docId}`);
  };

  return (
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 800, p: { xs: 2, sm: 0 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography 
          variant="h6"
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          Courses List
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
                Course Code
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', sm: 'table-cell' }
              }}>
                Name
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Credits
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', md: 'table-cell' }
              }}>
                Semester
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', lg: 'table-cell' }
              }}>
                Assignments
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
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {course.courseCode}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  {course.courseName}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {course.credits}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', md: 'table-cell' }
                }}>
                  {course.semester}
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', lg: 'table-cell' }
                }}>
                  {course.assignments.join(", ")}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleEdit(course.id)}
                    size="small"
                    sx={{ p: { xs: 0.5, sm: 1 } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(course.id)}
                    size="small"
                    sx={{ p: { xs: 0.5, sm: 1 } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={6} 
                  align="center"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button 
          variant="contained" 
          onClick={() => navigate("/courses/new")}
          sx={{ 
            minHeight: { xs: 44, sm: 36 },
            fontSize: { xs: '0.875rem', sm: '0.875rem' }
          }}
        >
          Add Course
        </Button>
      </Box>
    </Box>
  );
};

export default CourseList;