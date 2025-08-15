import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Toolbar,
} from '@mui/material';

import Header from './components/Header';

import HomePage from './pages/HomePage'; // ודא שהקובץ קיים ושהנתיב נכון
import StudentForm from './Forms/StudentForm';
import StudentList from './Forms/StudentList';
import CourseForm from './Forms/CourseForm';
import CourseList from './Forms/CourseList';
import StudentCourseForm from './Forms/StudentCourseForm';
import StudentCourseList from './Forms/StudentCourseList';
import ProgramForm from './Forms/ProgramForm';
import ProgramList from './Forms/ProgramList';

const drawerWidth = 240;

export default function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <Header />

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
          }}
        >
          <Toolbar />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/students/new">
                <ListItemText primary="Add Student" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/students">
                <ListItemText primary="Student List" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/courses/new">
                <ListItemText primary="Add Course" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/courses">
                <ListItemText primary="Course List" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/student-courses/new">
                <ListItemText primary="Add Student Course" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/student-courses">
                <ListItemText primary="Student Course Records" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/programs/new">
                <ListItemText primary="Add Program" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/programs">
                <ListItemText primary="Program List" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<HomePage />} />

            {/* Student routes */}
            <Route path="/students/new" element={<StudentForm />} />
            <Route path="/students/edit/:id" element={<StudentForm />} />
            <Route path="/students" element={<StudentList />} />

            {/* Course routes */}
            <Route path="/courses/new" element={<CourseForm />} />
            <Route path="/courses/edit/:courseCode" element={<CourseForm />} />
            <Route path="/courses" element={<CourseList />} />

            {/* StudentCourse routes */}
            <Route path="/student-courses/new" element={<StudentCourseForm />} />
            <Route path="/student-courses/edit/:index" element={<StudentCourseForm />} />
            <Route path="/student-courses" element={<StudentCourseList />} />

            {/* Program routes */}
            <Route path="/programs/new" element={<ProgramForm />} />
            <Route path="/programs/edit/:name" element={<ProgramForm />} />
            <Route path="/programs" element={<ProgramList />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}