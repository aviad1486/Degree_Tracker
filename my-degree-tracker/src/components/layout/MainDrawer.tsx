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
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';
import styles from './MainDrawer.module.css';

export default function MainDrawer() {
  const { user, permissions } = useUserRole();

  return (
    <div className={styles.drawerContainer}>
      <Toolbar />
      
      {/* Sidebar Header */}
      <Box className={styles.drawerHeader}>
        <Typography variant="h6" className={styles.drawerTitle}>
          🎓 Degree Tracker
        </Typography>
        <Typography variant="caption" className={styles.drawerSubtitle}>
          Academic Degree Management System
        </Typography>
        {user && (
          <Typography 
            variant="caption" 
            className={`${styles.userRole} ${user.role === 'admin' ? styles.userRoleAdmin : ''}`}
          >
            {user.role === 'admin' ? '👑 Administrator' : '🎯 Student'}
          </Typography>
        )}
      </Box>

      <List className={styles.navigationList}>
        {/* Personal Pages */}
        <ListItem className={styles.listItem} disablePadding>
          <ListItemButton component={Link} to="/" className={styles.listItemButton}>
            <ListItemIcon className={styles.listItemIcon}><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" className={styles.listItemText} />
          </ListItemButton>
        </ListItem>

        <ListItem className={styles.listItem} disablePadding>
          <ListItemButton component={Link} to="/progress" className={styles.listItemButton}>
            <ListItemIcon className={styles.listItemIcon}><TimelineIcon /></ListItemIcon>
            <ListItemText primary="My Progress" className={styles.listItemText} />
          </ListItemButton>
        </ListItem>

        <ListItem className={styles.listItem} disablePadding>
          <ListItemButton component={Link} to="/grade-report" className={styles.listItemButton}>
            <ListItemIcon className={styles.listItemIcon}><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="Grade Report" className={styles.listItemText} />
          </ListItemButton>
        </ListItem>

        <ListItem className={styles.listItem} disablePadding>
          <ListItemButton component={Link} to="/my-courses" className={styles.listItemButton}>
            <ListItemIcon className={styles.listItemIcon}><MenuBookIcon /></ListItemIcon>
            <ListItemText primary="My Courses" className={styles.listItemText} />
          </ListItemButton>
        </ListItem>

        <ListItem className={styles.listItem} disablePadding>
          <ListItemButton component={Link} to="/my-program" className={styles.listItemButton}>
            <ListItemIcon className={styles.listItemIcon}><TableChartIcon /></ListItemIcon>
            <ListItemText primary="My Program" className={styles.listItemText} />
          </ListItemButton>
        </ListItem>

        <ListItem className={styles.listItem} disablePadding>
          <ListItemButton component={Link} to="/help" className={styles.listItemButton}>
            <ListItemIcon className={styles.listItemIcon}><HelpIcon /></ListItemIcon>
            <ListItemText primary="Help & Support" className={styles.listItemText} />
          </ListItemButton>
        </ListItem>

        {/* Management Screens - Only show if user has permission */}
        {permissions.canViewManagement && (
          <>
            <Divider className={styles.sectionDivider} />
            <Box className={styles.sectionHeader}>
              <Typography variant="caption" className={styles.sectionTitle}>
                System Management
              </Typography>
            </Box>

            {permissions.canEditStudents && (
              <ListItem className={styles.listItem} disablePadding>
                <ListItemButton component={Link} to="/students" className={styles.listItemButton}>
                  <ListItemIcon className={styles.listItemIcon}><PeopleIcon /></ListItemIcon>
                  <ListItemText primary="Students List" className={styles.listItemText} />
                </ListItemButton>
              </ListItem>
            )}

            {permissions.canEditCourses && (
              <ListItem className={styles.listItem} disablePadding>
                <ListItemButton component={Link} to="/courses" className={styles.listItemButton}>
                  <ListItemIcon className={styles.listItemIcon}><LibraryBooksIcon /></ListItemIcon>
                  <ListItemText primary="Courses List" className={styles.listItemText} />
                </ListItemButton>
              </ListItem>
            )}

            {permissions.canEditStudents && (
              <ListItem className={styles.listItem} disablePadding>
                <ListItemButton component={Link} to="/student-courses" className={styles.listItemButton}>
                  <ListItemIcon className={styles.listItemIcon}><AssignmentIcon /></ListItemIcon>
                  <ListItemText primary="Student Course Records" className={styles.listItemText} />
                </ListItemButton>
              </ListItem>
            )}

            {permissions.canEditPrograms && (
              <ListItem className={styles.listItem} disablePadding>
                <ListItemButton component={Link} to="/programs" className={styles.listItemButton}>
                  <ListItemIcon className={styles.listItemIcon}><SettingsIcon /></ListItemIcon>
                  <ListItemText primary="Programs List" className={styles.listItemText} />
                </ListItemButton>
              </ListItem>
            )}

            {permissions.canAssignRoles && (
              <ListItem className={styles.listItem} disablePadding>
                <ListItemButton component={Link} to="/admin" className={styles.listItemButton}>
                  <ListItemIcon className={styles.listItemIcon}><AdminIcon /></ListItemIcon>
                  <ListItemText primary="User Management" className={styles.listItemText} />
                </ListItemButton>
              </ListItem>
            )}
          </>
        )}

        <Divider className={styles.sectionDivider} />

        <ListItem className={styles.listItem} disablePadding>
          <ListItemButton component={Link} to="/logout" className={styles.logoutButton}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}