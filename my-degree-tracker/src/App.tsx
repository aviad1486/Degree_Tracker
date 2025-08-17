// my-degree-tracker/src/App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Drawer, Toolbar } from '@mui/material';

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

import MainDrawer from './components/MainDrawer';
import HamburgerDrawer from './components/HamburgerDrawer';

import MyProgress from './pages/myprogress';
import GradeReport from './pages/gradereport';
import HelpSupport from './pages/helpsupport';
import Logout from './pages/logout';
import MyCourses from './pages/mycourses';
import MyProgram from './pages/myprogram';
import Login from './pages/login';

const drawerWidth = 240;

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((v) => !v);
  const handleMenuClose = () => setMenuOpen(false);

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        {/* כותרת עליונה עם כפתור ההמבורגר */}
        <Header onMenuClick={handleMenuToggle} />

        {/* Drawer קבוע (שמאלי) למסכים גדולים */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
          open
        >
          <MainDrawer />
        </Drawer>

        {/* Drawer זמני (המבורגר) לנייד / מסכים קטנים */}
        <Drawer
          anchor="left"
          variant="temporary"
          open={menuOpen}
          onClose={handleMenuClose}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          <HamburgerDrawer onClose={handleMenuClose} />
        </Drawer>

        {/* תוכן מרכזי והנתיבים */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/students/new" element={<StudentForm />} />
            <Route path="/students/edit/:id" element={<StudentForm />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/courses/new" element={<CourseForm />} />
            <Route path="/courses/edit/:courseCode" element={<CourseForm />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/student-courses/new" element={<StudentCourseForm />} />
            <Route path="/student-courses/edit/:index" element={<StudentCourseForm />} />
            <Route path="/student-courses" element={<StudentCourseList />} />
            <Route path="/programs/new" element={<ProgramForm />} />
            <Route path="/programs/edit/:name" element={<ProgramForm />} />
            <Route path="/programs" element={<ProgramList />} />
            <Route path="*" element={<HomePage />} />
            <Route path="/progress" element={<MyProgress />} />
            <Route path="/grade-report" element={<GradeReport />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/my-program" element={<MyProgram />} />
            <Route path="/login" element={<Login />} />

          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
