import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar,
  Divider,
  Typography,
  Box
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
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function MainDrawer() {
  return (
    <div>
      <Toolbar />
      
      {/* Sidebar Header */}
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
      </Box>

      <List>
        {/* Personal Pages */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/progress">
            <ListItemIcon><TimelineIcon /></ListItemIcon>
            <ListItemText primary="My Progress" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/grade-report">
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="Grade Report" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/my-courses">
            <ListItemIcon><MenuBookIcon /></ListItemIcon>
            <ListItemText primary="My Courses" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/my-program">
            <ListItemIcon><TableChartIcon /></ListItemIcon>
            <ListItemText primary="My Program" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/help">
            <ListItemIcon><HelpIcon /></ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
        </ListItem>

        {/* Management Screens */}
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

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/students">
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Students List" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/courses">
            <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
            <ListItemText primary="Courses List" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/student-courses">
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="Student Grades" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/programs">
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Programs List" />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/logout">
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}