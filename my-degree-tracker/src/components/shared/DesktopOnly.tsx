import React from 'react';
import { useMediaQuery, useTheme, Box, Typography, Card, CardContent, Button } from '@mui/material';
import { DesktopWindows, PhoneIphone, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface DesktopOnlyProps {
  children: React.ReactNode;
  pageName?: string;
}

/**
 * Component that shows its children only on desktop/tablet devices.
 * On mobile, it displays a message that the page is desktop-only.
 */
const DesktopOnly: React.FC<DesktopOnlyProps> = ({ 
  children, 
  pageName = "Management" 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Use Material-UI's theme breakpoints for consistent detection
  // This will be true for screens smaller than 'md' (900px)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          p: 3
        }}
      >
        <Card 
          sx={{ 
            maxWidth: 400,
            textAlign: 'center',
            boxShadow: 3
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3 }}>
              <PhoneIphone 
                sx={{ 
                  fontSize: 64, 
                  color: 'text.secondary',
                  mb: 2 
                }} 
              />
              <DesktopWindows 
                sx={{ 
                  fontSize: 64, 
                  color: 'primary.main',
                  ml: 2 
                }} 
              />
            </Box>
            
            <Typography 
              variant="h5" 
              component="h1" 
              gutterBottom
              color="primary"
            >
              Desktop Required
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              paragraph
            >
              {pageName} features are optimized for desktop and tablet devices to provide the best user experience.
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 3 }}
            >
              Please access this page from a computer or tablet with a screen width of at least 900px.
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              fullWidth
              sx={{ mt: 2 }}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // On desktop/tablet, show the actual content
  return <>{children}</>;
};

export default DesktopOnly;