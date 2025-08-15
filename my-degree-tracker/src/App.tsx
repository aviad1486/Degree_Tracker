import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TableChartIcon from '@mui/icons-material/TableChart';
import PeopleIcon from '@mui/icons-material/People';
import HelpIcon from '@mui/icons-material/Help';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Drawer הקבוע - התפריט הקיים
  const mainDrawer = (
    <div>
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
    </div>
  );

  // Drawer של ההמבורגר - התפריט בעברית עם אייקונים
  const hamburgerDrawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="עמוד הבית" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><SchoolIcon /></ListItemIcon>
            <ListItemText primary="ההתקדמות שלי" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="דו״ח ציונים" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><MenuBookIcon /></ListItemIcon>
            <ListItemText primary="קורסים" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><TableChartIcon /></ListItemIcon>
            <ListItemText primary="מסלול לימוד" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="משתמשים" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><HelpIcon /></ListItemIcon>
            <ListItemText primary="עזרה והדרכה" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="התנתקות" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <Header onMenuClick={handleMenuToggle} />

        {/* Drawer הקבוע בצד שמאל */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
          open
        >
          {mainDrawer}
        </Drawer>

        {/* Drawer זמני של ההמבורגר */}
        <Drawer
          anchor="left"
          variant="temporary"
          open={menuOpen}
          onClose={handleMenuToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {hamburgerDrawer}
        </Drawer>

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
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
