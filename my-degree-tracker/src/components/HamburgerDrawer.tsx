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
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface HamburgerDrawerProps {
  onClose: () => void;
}

export default function HamburgerDrawer({ onClose }: HamburgerDrawerProps) {
  return (
    <div>
      <Toolbar />
      
      {/* כותרת התפריט */}
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
          מערכת ניהול תואר אקדמי
        </Typography>
      </Box>

      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" onClick={onClose}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="דף הבית" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/progress" onClick={onClose}>
            <ListItemIcon><TimelineIcon /></ListItemIcon>
            <ListItemText primary="ההתקדמות שלי" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/grade-report" onClick={onClose}>
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="דוח ציונים" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/my-courses" onClick={onClose}>
            <ListItemIcon><MenuBookIcon /></ListItemIcon>
            <ListItemText primary="הקורסים שלי" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/my-program" onClick={onClose}>
            <ListItemIcon><TableChartIcon /></ListItemIcon>
            <ListItemText primary="המסלול שלי" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/help" onClick={onClose}>
            <ListItemIcon><HelpIcon /></ListItemIcon>
            <ListItemText primary="עזרה ותמיכה" />
          </ListItemButton>
        </ListItem>

        {/* מסכי ניהול */}
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
            ניהול מערכת
          </Typography>
        </Box>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/students" onClick={onClose}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="רשימת סטודנטים" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/courses" onClick={onClose}>
            <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
            <ListItemText primary="רשימת קורסים" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/student-courses" onClick={onClose}>
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="ציוני סטודנטים" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/programs" onClick={onClose}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="רשימת תוכניות" />
          </ListItemButton>
        </ListItem>

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
