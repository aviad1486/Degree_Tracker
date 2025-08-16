import { Box, Typography, Paper } from '@mui/material';

export default function MyProgram() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>My Study Program</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Your study program will appear here in the next phase of the project.
        </Typography>
      </Paper>
    </Box>
  );
}
