import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface StubPageProps {
  title: string;
  subtitle?: string;
}

const StubPage: React.FC<StubPageProps> = ({ title, subtitle }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>{title}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {subtitle ?? 'This screen will be built in the next phase of the project.'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default StubPage;