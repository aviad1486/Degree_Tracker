import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Drawer, Toolbar, Container } from '@mui/material';

import Header from './components/Header';
import Footer from './components/Footer';
import MainDrawer from './components/MainDrawer';
import HamburgerDrawer from './components/HamburgerDrawer';

import HomePage from './pages/homepage';
import StudentForm from './Forms/StudentForm';
import StudentList from './Forms/StudentList';
import CourseForm from './Forms/CourseForm';
import CourseList from './Forms/CourseList';
import StudentCourseForm from './Forms/StudentCourseForm';
import StudentCourseList from './Forms/StudentCourseList';
import ProgramForm from './Forms/ProgramForm';
import ProgramList from './Forms/ProgramList';

import MyProgress from './pages/myprogress';
import GradeReport from './pages/gradereport';
import HelpSupport from './pages/helpsupport';
import Logout from './pages/logout';
import MyCourses from './pages/mycourses';
import MyProgram from './pages/myprogram';
import Login from './pages/login';

const sidebarWidth = 'clamp(200px, 18vw, 320px)';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen(v => !v);
  const handleMenuClose = () => setMenuOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={handleMenuToggle} />

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            boxSizing: 'border-box',
          },
        }}
        open
      >
        <MainDrawer />
      </Drawer>

      <Drawer
        anchor="left"
        variant="temporary"
        open={menuOpen}
        onClose={handleMenuClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: sidebarWidth } }}
      >
        <HamburgerDrawer onClose={handleMenuClose} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          ml: { sm: sidebarWidth },
        }}
      >
        <Toolbar />

        <Container maxWidth="xl" sx={{ flexGrow: 1, py: { xs: 2, sm: 3 } }}>
          <Routes>
          <Route path="/" element={<Login />} />   {/* דף ברירת מחדל = התחברות */}
          <Route path="/home" element={<HomePage />} />  {/* דף הבית יהיה בנתיב אחר */}
          
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
          <Route path="/progress" element={<MyProgress />} />
          <Route path="/grade-report" element={<GradeReport />} />
          <Route path="/help" element={<HelpSupport />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/my-program" element={<MyProgram />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} /> {/* ברירת מחדל לכל נתיב לא ידוע */}
        </Routes>

        </Container>

        <Footer />
      </Box>
    </Box>
  );
}
