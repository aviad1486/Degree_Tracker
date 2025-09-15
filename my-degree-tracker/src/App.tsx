import { useState, useEffect } from 'react';
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
import AdminPage from './pages/admin';

import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Import admin setup helper for development
import { setupFirstAdmin } from './utils/adminSetup';

const sidebarWidth = 'clamp(200px, 18vw, 320px)';
const mobileSidebarWidth = '280px';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Setup admin helper in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      setupFirstAdmin();
    }
  }, []);

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
        sx={{ 
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            width: mobileSidebarWidth,
            maxWidth: '85vw'
          }
        }}
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
          ml: { sm: sidebarWidth }, // רק במחשב יש מרווח משמאל
        }}
      >
        <Toolbar />

        <Container 
          maxWidth="xl" 
          sx={{ 
            flexGrow: 1, 
            py: { xs: 1, sm: 3 },
            px: { xs: 1, sm: 3 }
          }}
        >
          <Routes>
            {/* פתוחים לכולם */}
            <Route path="/login" element={<Login />} />
            <Route path="/help" element={<HelpSupport />} />

            {/* כל השאר מוגנים */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/new"
              element={
                <RoleProtectedRoute requiredPermission="canEditStudents">
                  <StudentForm />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/students/edit/:id"
              element={
                <RoleProtectedRoute requiredPermission="canEditStudents">
                  <StudentForm />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <RoleProtectedRoute requiredPermission="canEditStudents">
                  <StudentList />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/courses/new"
              element={
                <RoleProtectedRoute requiredPermission="canEditCourses">
                  <CourseForm />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/courses/edit/:courseCode"
              element={
                <RoleProtectedRoute requiredPermission="canEditCourses">
                  <CourseForm />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <RoleProtectedRoute requiredPermission="canEditCourses">
                  <CourseList />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/student-courses/new"
              element={
                <RoleProtectedRoute requiredPermission="canEditStudents">
                  <StudentCourseForm />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/student-courses/edit/:index"
              element={
                <RoleProtectedRoute requiredPermission="canEditStudents">
                  <StudentCourseForm />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/student-courses"
              element={
                <RoleProtectedRoute requiredPermission="canEditStudents">
                  <StudentCourseList />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/programs/new"
              element={
                <RoleProtectedRoute requiredPermission="canEditPrograms">
                  <ProgramForm />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/programs/edit/:name"
              element={
                <RoleProtectedRoute requiredPermission="canEditPrograms">
                  <ProgramForm />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/programs"
              element={
                <RoleProtectedRoute requiredPermission="canEditPrograms">
                  <ProgramList />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <RoleProtectedRoute requireAdmin={true}>
                  <AdminPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <MyProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/grade-report"
              element={
                <ProtectedRoute>
                  <GradeReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  <Logout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-program"
              element={
                <ProtectedRoute>
                  <MyProgram />
                </ProtectedRoute>
              }
            />

            {/* ברירת מחדל */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>

        <Footer />
      </Box>
    </Box>
  );
}