import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TableChartIcon from '@mui/icons-material/TableChart';
import HelpIcon from '@mui/icons-material/Help';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const NavigationDrawer: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'עמוד הבית', icon: <HomeIcon />, path: '/' },
    { text: 'ההתקדמות שלי', icon: <SchoolIcon />, path: null },
    { text: 'דוח ציונים', icon: <BarChartIcon />, path: null },
    { text: 'קורסים', icon: <MenuBookIcon />, path: null },
    { text: 'מסלול לימוד', icon: <TableChartIcon />, path: null },
    { text: 'עזרה והדרכה', icon: <HelpIcon />, path: null },
    { text: 'התנתקות', icon: <ExitToAppIcon />, path: null },
  ];

  return (
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
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => item.path && navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default NavigationDrawer;
