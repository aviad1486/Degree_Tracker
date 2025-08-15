import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import SnackbarNotification from '../components/SnackbarNotification'; // עדכן נתיב לפי הפרויקט שלך

interface StudentFormData {
  id: string;
  fullName: string;
  email: string;
  courses: string; 
  assignments: string;
  gradeSheet: string;
  program: string;
  semester: 'A' | 'B' | 'C';
  completedCredits: string;
}

const StudentForm: React.FC = () => {
  const [data, setData] = useState<StudentFormData>({
    id: '',
    fullName: '',
    email: '',
    courses: '',
    assignments: '',
    gradeSheet: '',
    program: '',
    semester: 'A',
    completedCredits: '0',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [snackSeverity, setSnackSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!/^\d{9}$/.test(data.id)) newErrors.id = 'ID must be exactly 9 digits';
    if (!/\S+\s+\S+/.test(data.fullName)) newErrors.fullName = 'Please enter a full name (at least two words)';
    if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(data.email)) newErrors.email = 'Invalid email address';

    const courseList = data.courses.split(',').map(s => s.trim()).filter(Boolean);
    if (courseList.length === 0) newErrors.courses = 'Enter at least one course, separated by commas';

    try {
      const sheet = JSON.parse(data.gradeSheet);
      if (typeof sheet !== 'object' || Array.isArray(sheet)) throw new Error();
      for (const [course, grade] of Object.entries(sheet)) {
        if (typeof grade !== 'number' || grade < 0 || grade > 100) throw new Error();
      }
    } catch {
      newErrors.gradeSheet = 'Enter valid JSON for grade sheet (e.g. {"CS101": 85})';
    }

    if (!data.program.trim()) newErrors.program = 'Please select a program';
    if (!/^[ABC]$/.test(data.semester)) newErrors.semester = 'Select a valid semester (A, B, or C)';
    if (!/^\d+$/.test(data.completedCredits) || parseInt(data.completedCredits, 10) < 0) {
      newErrors.completedCredits = 'Enter a non-negative integer for completed credits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof StudentFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
  if (!validate()) {
    setSnackMsg('Please fix the form errors');
    setSnackSeverity('error');
    setSnackOpen(true);
    return;
  }
    const newStudent = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      courses: data.courses.split(',').map(s => s.trim()).filter(Boolean),
      assignments: data.assignments.split(',').map(s => s.trim()).filter(Boolean),
      gradeSheet: JSON.parse(data.gradeSheet),
      program: data.program,
      semester: data.semester,
      completedCredits: parseInt(data.completedCredits, 10),
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('students') || '[]');
    existing.push(newStudent);
    localStorage.setItem('students', JSON.stringify(existing));

    setData({
      id: '',
      fullName: '',
      email: '',
      courses: '',
      assignments: '',
      gradeSheet: '',
      program: '',
      semester: 'A',
      completedCredits: '0'
    });

    setSnackMsg('Student added successfully!');
    setSnackSeverity('success');
    setSnackOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>Student Form</Typography>
      <TextField label="ID" value={data.id} onChange={handleChange('id')} error={!!errors.id} helperText={errors.id} required fullWidth margin="normal" />
      <TextField label="Full Name" value={data.fullName} onChange={handleChange('fullName')} error={!!errors.fullName} helperText={errors.fullName} required fullWidth margin="normal" />
      <TextField label="Email" value={data.email} onChange={handleChange('email')} error={!!errors.email} helperText={errors.email} required fullWidth margin="normal" />
      <TextField label="Courses (comma separated)" value={data.courses} onChange={handleChange('courses')} error={!!errors.courses} helperText={errors.courses} required fullWidth margin="normal" />
      <TextField label="Assignments (comma separated)" value={data.assignments} onChange={handleChange('assignments')} error={!!errors.assignments} helperText={errors.assignments} fullWidth margin="normal" />
      <TextField label="Grade Sheet (JSON)" value={data.gradeSheet} onChange={handleChange('gradeSheet')} error={!!errors.gradeSheet} helperText={errors.gradeSheet} required fullWidth margin="normal" multiline minRows={3} />
      <TextField label="Program" value={data.program} onChange={handleChange('program')} error={!!errors.program} helperText={errors.program} required fullWidth margin="normal" />
      <TextField select label="Current Semester" value={data.semester} onChange={handleChange('semester')} error={!!errors.semester} helperText={errors.semester} required fullWidth margin="normal">
        <MenuItem value="A">A</MenuItem>
        <MenuItem value="B">B</MenuItem>
        <MenuItem value="C">C</MenuItem>
      </TextField>
      <TextField label="Completed Credits" value={data.completedCredits} onChange={handleChange('completedCredits')} error={!!errors.completedCredits} helperText={errors.completedCredits} required fullWidth margin="normal" />
      <Box mt={2} textAlign="right">
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </Box>

      {/* קומפוננטת Snackbar מופרדת */}
      <SnackbarNotification
        open={snackOpen}
        severity={snackSeverity}
        message={snackMsg}
        onClose={() => setSnackOpen(false)}
      />
    </Box>
  );
};

export default StudentForm;