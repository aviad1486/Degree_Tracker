// src/components/Drawers/MainDrawer.tsx
import { List, ListItem, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';

export default function MainDrawer() {
  return (
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
}
