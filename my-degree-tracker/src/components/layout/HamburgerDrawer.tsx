import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import {
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  MenuBook as MenuBookIcon,
  TableChart as TableChartIcon,
  Help as HelpIcon,
  ExitToApp as ExitToAppIcon,
  Timeline as TimelineIcon,
  People as PeopleIcon,
  LibraryBooks as LibraryBooksIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';

interface HamburgerDrawerProps {
  onClose: () => void;
}

export default function HamburgerDrawer({ onClose }: HamburgerDrawerProps) {
  const { user, permissions } = useUserRole();

  return (
    <div>
      <Toolbar />
      
      {/* Menu Header */}
      <Box sx={{ px: 2, py: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: '1.1rem'
          }}
        >
          🎓 Degree Tracker
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.75rem'
          }}
        >
          Academic Degree Management System
        </Typography>
        {user && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: user.role === 'admin' ? 'error.main' : 'success.main',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              display: 'block',
              mt: 0.5
            }}
          >
            {user.role === 'admin' ? '👑 Administrator' : '👤 User'}
          </Typography>
        )}
      </Box>

      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" onClick={onClose}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/progress" onClick={onClose}>
            <ListItemIcon><TimelineIcon /></ListItemIcon>
            <ListItemText primary="My Progress" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/grade-report" onClick={onClose}>
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="Grade Report" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/my-courses" onClick={onClose}>
            <ListItemIcon><MenuBookIcon /></ListItemIcon>
            <ListItemText primary="My Courses" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/my-program" onClick={onClose}>
            <ListItemIcon><TableChartIcon /></ListItemIcon>
            <ListItemText primary="My Program" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/help" onClick={onClose}>
            <ListItemIcon><HelpIcon /></ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
        </ListItem>

        {/* Management Screens - Only show if user has permission */}
        {permissions.canViewManagement && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                System Management
              </Typography>
            </Box>

            {permissions.canEditStudents && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/students" onClick={onClose}>
                  <ListItemIcon><PeopleIcon /></ListItemIcon>
                  <ListItemText primary="Students List" />
                </ListItemButton>
              </ListItem>
            )}

            {permissions.canEditCourses && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/courses" onClick={onClose}>
                  <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
                  <ListItemText primary="Courses List" />
                </ListItemButton>
              </ListItem>
            )}

            {permissions.canEditStudents && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/student-courses" onClick={onClose}>
                  <ListItemIcon><AssignmentIcon /></ListItemIcon>
                  <ListItemText primary="Student Grades" />
                </ListItemButton>
              </ListItem>
            )}

            {permissions.canEditPrograms && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/programs" onClick={onClose}>
                  <ListItemIcon><SettingsIcon /></ListItemIcon>
                  <ListItemText primary="Programs List" />
                </ListItemButton>
              </ListItem>
            )}

            {permissions.canAssignRoles && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/admin" onClick={onClose}>
                  <ListItemIcon><AdminIcon /></ListItemIcon>
                  <ListItemText primary="User Management" />
                </ListItemButton>
              </ListItem>
            )}
          </>
        )}

        <Divider sx={{ my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/logout" onClick={onClose}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}