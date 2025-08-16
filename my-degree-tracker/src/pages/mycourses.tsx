import { Box, Typography, Paper } from '@mui/material';

export default function MyCourses() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>My Courses</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Your courses will appear here in the next phase of the project.
        </Typography>
      </Paper>
    </Box>
  );
}
