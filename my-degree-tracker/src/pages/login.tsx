import { Box, Typography, Paper } from '@mui/material';

export default function Login() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          The login functionality will be available in the next phase of the project.
        </Typography>
      </Paper>
    </Box>
  );
}
