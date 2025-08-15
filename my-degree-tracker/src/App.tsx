import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Toolbar,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import GradeIcon from '@mui/icons-material/Grade';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TimelineIcon from '@mui/icons-material/Timeline';
import HelpIcon from '@mui/icons-material/Help';
import AssignmentIcon from '@mui/icons-material/Assignment';

import Header from './components/Header';
import HomePage from './pages/homepage';
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
              <ListItemButton component={Link} to="/">
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary="עמוד הבית" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/student-courses">
                <ListItemIcon><SchoolIcon /></ListItemIcon>
                <ListItemText primary="ההתקדמות שלי" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/student-courses">
                <ListItemIcon><GradeIcon /></ListItemIcon>
                <ListItemText primary="דו״ח ציונים" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/courses">
                <ListItemIcon><MenuBookIcon /></ListItemIcon>
                <ListItemText primary="קורסים" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/programs">
                <ListItemIcon><TimelineIcon /></ListItemIcon>
                <ListItemText primary="מסלול לימוד" />
              </ListItemButton>
            </ListItem>

            {/* מוסתר לעת עתה */}
            {/* 
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/students">
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText primary="משתמשים" />
              </ListItemButton>
            </ListItem>
            */}

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemIcon><HelpIcon /></ListItemIcon>
                <ListItemText primary="עזרה והדרכה" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/student-courses">
                <ListItemIcon><AssignmentIcon /></ListItemIcon>
                <ListItemText primary="ההתנוקות" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            {/* Home page */}
            <Route path="/" element={<HomePage />} />

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

            {/* Catch-all route */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
