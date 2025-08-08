import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

interface ProgramFormData {
  name: string;
  totalCreditsRequired: string;
  courses: string;
}

const ProgramForm: React.FC = () => {
  const [data, setData] = useState<ProgramFormData>({
    name: '',
    totalCreditsRequired: '0',
    courses: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProgramFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!data.name.trim()) newErrors.name = 'Program name is required';
    if (!/^\d+$/.test(data.totalCreditsRequired) || parseInt(data.totalCreditsRequired, 10) < 0) {
      newErrors.totalCreditsRequired = 'Total credits must be a non-negative integer';
    }
    const list = data.courses.split(',').map(s => s.trim()).filter(Boolean);
    if (list.length === 0) newErrors.courses = 'Enter at least one course code';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ProgramFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newProgram = {
      name: data.name.trim(),
      totalCreditsRequired: parseInt(data.totalCreditsRequired, 10),
      courses: data.courses.split(',').map(s => s.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('programs') || '[]');
    existing.push(newProgram);
    localStorage.setItem('programs', JSON.stringify(existing));
    setData({ name: '', totalCreditsRequired: '0', courses: '' });
    alert('Program added successfully!');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>Add Study Program</Typography>
      <TextField
        label="Program Name"
        value={data.name}
        onChange={handleChange('name')}
        error={!!errors.name}
        helperText={errors.name}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Total Credits Required"
        value={data.totalCreditsRequired}
        onChange={handleChange('totalCreditsRequired')}
        error={!!errors.totalCreditsRequired}
        helperText={errors.totalCreditsRequired}
        fullWidth
        margin="normal"
        type="number"
        inputProps={{ min: 0 }}
      />
      <TextField
        label="Courses (comma separated codes)"
        value={data.courses}
        onChange={handleChange('courses')}
        error={!!errors.courses}
        helperText={errors.courses}
        fullWidth
        margin="normal"
      />
      <Box mt={2} textAlign="right">
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </Box>
    </Box>
  );
};

export default ProgramForm;
