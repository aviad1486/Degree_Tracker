import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar 
} from '@mui/material';
import { 
  //PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  //MenuBook as MenuBookIcon,
  LibraryBooks as LibraryBooksIcon,
  //AddTask as AddTaskIcon,
  Assignment as AssignmentIcon,
  //School as SchoolIcon,
  TableChart as TableChartIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function MainDrawer() {
  return (
    <div>
      <Toolbar />
      <List>
        {/* <ListItem disablePadding>
          <ListItemButton component={Link} to="/students/new">
            <ListItemIcon><PersonAddIcon /></ListItemIcon>
            <ListItemText primary="Add Student" />
          </ListItemButton>
        </ListItem> */}

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/students">
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Student List" />
          </ListItemButton>
        </ListItem>

        {/* <ListItem disablePadding>
          <ListItemButton component={Link} to="/courses/new">
            <ListItemIcon><MenuBookIcon /></ListItemIcon>
            <ListItemText primary="Add Course" />
          </ListItemButton>
        </ListItem> */}

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/courses">
            <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
            <ListItemText primary="Course List" />
          </ListItemButton>
        </ListItem>

        {/* <ListItem disablePadding>
          <ListItemButton component={Link} to="/student-courses/new">
            <ListItemIcon><AddTaskIcon /></ListItemIcon>
            <ListItemText primary="Add Student Course" />
          </ListItemButton>
        </ListItem> */}

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/student-courses">
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="Student Course Records" />
          </ListItemButton>
        </ListItem>

        {/* <ListItem disablePadding>
          <ListItemButton component={Link} to="/programs/new">
            <ListItemIcon><SchoolIcon /></ListItemIcon>
            <ListItemText primary="Add Program" />
          </ListItemButton>
        </ListItem> */}

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/programs">
            <ListItemIcon><TableChartIcon /></ListItemIcon>
            <ListItemText primary="Program List" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}