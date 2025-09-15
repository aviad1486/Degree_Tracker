import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        minHeight: { xs: 56, sm: 64 },
        px: { xs: 1, sm: 2 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            aria-label="menu"
            sx={{ 
              display: { xs: 'block', sm: 'none' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
            title="תפריט ניווט"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            onClick={() => navigate('/')}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Degree Tracker System
          </Typography>
          <Typography
            variant="h6"
            onClick={() => navigate('/')}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: { xs: 'block', sm: 'none' }
            }}
          >
            DTS
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Typography 
            variant="body2" 
            sx={{ 
              display: { xs: 'none', md: 'block' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            {dateTime.toLocaleString()}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              display: { xs: 'block', md: 'none' },
              fontSize: '0.75rem'
            }}
          >
            {dateTime.toLocaleTimeString()}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={() => navigate('/login')}
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;