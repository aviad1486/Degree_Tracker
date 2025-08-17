import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import SnackbarNotification from '../components/SnackbarNotification';
import { useProgramForm } from '../hooks/useProgramForm';

const ProgramForm: React.FC = () => {
  const {
    data,
    errors,
    snackOpen,
    setSnackOpen,
    snackMsg,
    snackSeverity,
    isEdit,
    handleChange,
    handleSubmit,
  } = useProgramForm();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Study Program' : 'Add Study Program'}
      </Typography>

      <TextField
        label="Program Name"
        value={data.name}
        onChange={handleChange('name')}
        error={!!errors.name}
        helperText={errors.name}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        type="number"
        inputProps={{ min: 0 }}
        label="Total Credits Required"
        value={data.totalCreditsRequired}
        onChange={handleChange('totalCreditsRequired')}
        error={!!errors.totalCreditsRequired}
        helperText={errors.totalCreditsRequired}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Courses (comma separated codes)"
        value={data.courses}
        onChange={handleChange('courses')}
        error={!!errors.courses}
        helperText={errors.courses}
        required
        fullWidth
        margin="normal"
      />
      <Box mt={2} textAlign="right">
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? 'Update' : 'Save'}
        </Button>
      </Box>

      <SnackbarNotification
        open={snackOpen}
        severity={snackSeverity}
        message={snackMsg}
        onClose={() => setSnackOpen(false)}
      />
    </Box>
  );
};

export default ProgramForm;
