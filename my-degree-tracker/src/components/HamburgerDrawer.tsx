import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import {
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  MenuBook as MenuBookIcon,
  TableChart as TableChartIcon,
  Help as HelpIcon,
  ExitToApp as ExitToAppIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface HamburgerDrawerProps {
  onClose: () => void;
}

export default function HamburgerDrawer({ onClose }: HamburgerDrawerProps) {
  return (
    <div>
      <Toolbar />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" onClick={onClose}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home Page" />
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
            <ListItemText primary="My Programs" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/help" onClick={onClose}>
            <ListItemIcon><HelpIcon /></ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
        </ListItem>

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
