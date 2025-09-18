import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';
import { signOut } from 'firebase/auth';
import { auth } from '../../firestore/config';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [dateTime, setDateTime] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useUserRole();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleUserMenuClose();
  };

  return (
    <AppBar className={styles.headerAppBar}>
      <Toolbar className={styles.headerToolbar}>
        <Box className={styles.leftSection}>
          <IconButton
            className={styles.menuButton}
            edge="start"
            onClick={onMenuClick}
            aria-label="menu"
            sx={{ display: { xs: 'block', sm: 'none' } }}
            title="תפריט ניווט"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            onClick={() => navigate('/')}
            className={`${styles.logoText} ${styles.logoTextDesktop}`}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            🎓 Degree Tracker
          </Typography>
          <Typography
            variant="h6"
            onClick={() => navigate('/')}
            className={`${styles.logoText} ${styles.logoTextMobile}`}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            🎓 DTS
          </Typography>
        </Box>

        <Box className={styles.rightSection}>
          <Typography 
            variant="body2" 
            className={`${styles.dateTime} ${styles.dateTimeDesktop}`}
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            📅 {dateTime.toLocaleString()}
          </Typography>
          <Typography 
            variant="body2" 
            className={`${styles.dateTime} ${styles.dateTimeMobile}`}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            🕒 {dateTime.toLocaleTimeString()}
          </Typography>
          
          {user ? (
            <>
              <IconButton
                className={styles.userButton}
                onClick={handleUserMenuClick}
                size="small"
                aria-controls={open ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleUserMenuClose}
                onClick={handleUserMenuClose}
                className={styles.userMenu}
                PaperProps={{
                  className: styles.userMenu,
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    mt: 1.5,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'rgba(15, 23, 42, 0.95)',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem className={styles.userMenuItemDisabled} disabled>
                  <Typography variant="body2" className={styles.userName}>
                    👤 {user.displayName || user.email}
                  </Typography>
                </MenuItem>
                <MenuItem className={styles.userMenuItemDisabled} disabled>
                  <Typography variant="caption" className={styles.userRole}>
                    {user.role === 'admin' ? '👑 Administrator' : '🎯 Student'}
                  </Typography>
                </MenuItem>
                <MenuItem className={styles.userMenuItem} onClick={handleLogout}>
                  🚪 Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/login')}
              className={styles.loginButton}
            >
              🔐 Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;