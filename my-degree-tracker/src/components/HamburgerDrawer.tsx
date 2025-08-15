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
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  MenuBook as MenuBookIcon,
  TableChart as TableChartIcon,
  People as PeopleIcon,
  Help as HelpIcon,
  ExitToApp as ExitToAppIcon,
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
}
