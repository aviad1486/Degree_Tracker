import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 800 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Degree Tracker System 🎓
        </Typography>
        <Typography variant="body1">
          Use the navigation menu on the left to manage students, courses, programs, and more.
        </Typography>
      </Paper>
    </Box>
  );
};

export default HomePage;