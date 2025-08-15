import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import SnackbarNotification from '../components/SnackbarNotification';

interface ProgramFormData {
  name: string;
  totalCreditsRequired: string;
  courses: string;
}

const ProgramForm: React.FC = () => {
  const { name } = useParams<{ name?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(name);

  const [data, setData] = useState<ProgramFormData>({
    name: '',
    totalCreditsRequired: '0',
    courses: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProgramFormData, string>>>({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [snackSeverity, setSnackSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  // Prefill in edit mode
  useEffect(() => {
    if (isEdit && name) {
      const programs: any[] = JSON.parse(localStorage.getItem('programs') || '[]');
      const decoded = decodeURIComponent(name);
      const program = programs.find(p => p.name === decoded);
      if (program) {
        setData({
          name: program.name,
          totalCreditsRequired: program.totalCreditsRequired.toString(),
          courses: program.courses.join(', '),
        });
      }
    }
  }, [name, isEdit]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!data.name.trim()) newErrors.name = 'Program name is required';
    if (!/^\d+$/.test(data.totalCreditsRequired) || parseInt(data.totalCreditsRequired, 10) < 0) {
      newErrors.totalCreditsRequired = 'Total credits must be a non-negative integer';
    }
    if (data.courses.split(',').map(s => s.trim()).filter(Boolean).length === 0) {
      newErrors.courses = 'Enter at least one course code';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ProgramFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!validate()) {
      setSnackMsg('Please fix the form errors');
      setSnackSeverity('error');
      setSnackOpen(true);
      return;
    }
    const entry = {
      name: data.name.trim(),
      totalCreditsRequired: parseInt(data.totalCreditsRequired, 10),
      courses: data.courses.split(',').map(s => s.trim()),
      createdAt: new Date().toISOString(),
    };
    const programs: any[] = JSON.parse(localStorage.getItem('programs') || '[]');
    const updated = isEdit
      ? programs.map(p => (p.name === entry.name ? entry : p))
      : [...programs, entry];
    localStorage.setItem('programs', JSON.stringify(updated));
    setSnackMsg(isEdit ? 'Program updated successfully' : 'Program added successfully');
    setSnackSeverity('success');
    setSnackOpen(true);
    setTimeout(() => navigate('/programs'), 2000);
  };

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