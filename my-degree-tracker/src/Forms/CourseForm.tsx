import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

// Interface for course form data
interface CourseFormData {
  courseCode: string;
  courseName: string;
  credits: string;
  semester: 'A' | 'B' | 'C';
  assignments: string;
}

const CourseForm: React.FC = () => {
  const { courseCode } = useParams<{ courseCode?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(courseCode);

  const [data, setData] = useState<CourseFormData>({
    courseCode: '',
    courseName: '',
    credits: '1',
    semester: 'A',
    assignments: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [snackSeverity, setSnackSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');


  // Prefill form for edit
  useEffect(() => {
    if (isEdit && courseCode) {
      const courses: any[] = JSON.parse(localStorage.getItem('courses') || '[]');
      const course = courses.find(c => c.courseCode === courseCode);
      if (course) {
        setData({
          courseCode: course.courseCode,
          courseName: course.courseName,
          credits: course.credits.toString(),
          semester: course.semester,
          assignments: course.assignments.join(', '),
        });
      }
    }
  }, [courseCode]);

  // Validation logic
  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!data.courseCode.trim()) newErrors.courseCode = 'Course code is required';
    if (!data.courseName.trim()) newErrors.courseName = 'Course name is required';
    if (!/^\d+$/.test(data.credits) || parseInt(data.credits, 10) < 1) {
      newErrors.credits = 'Credits must be a positive integer';
    }
    if (!/^[ABC]$/.test(data.semester)) newErrors.semester = 'Select a valid semester';
    if (data.assignments.split(',').map(s => s.trim()).filter(Boolean).length === 0) {
      newErrors.assignments = 'Enter at least one assignment';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (field: keyof CourseFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // Submit handler
  const handleSubmit = () => {
    if (!validate()) {
      setSnackMsg('Please fix the form errors');
      setSnackSeverity('error');
      setSnackOpen(true);
      return;
    }
    const entry = {
      courseCode: data.courseCode.trim(),
      courseName: data.courseName.trim(),
      credits: parseInt(data.credits, 10),
      semester: data.semester,
      assignments: data.assignments.split(',').map(s => s.trim()),
      createdAt: new Date().toISOString(),
    };
    const courses: any[] = JSON.parse(localStorage.getItem('courses') || '[]');
    const updated = isEdit
      ? courses.map(c => (c.courseCode === courseCode ? entry : c))
      : [...courses, entry];
    localStorage.setItem('courses', JSON.stringify(updated));
    setData({courseCode: '', courseName: '', credits: '1', semester: 'A', assignments: ''});
    setSnackMsg(isEdit ? 'Course updated successfully' : 'Course added successfully');
    setSnackSeverity('success');
    setSnackOpen(true);
    setTimeout(() => navigate('/courses'), 2000);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>{isEdit ? 'Edit Course' : 'Add Course'}</Typography>

      <TextField
        label="Course Code"
        value={data.courseCode}
        onChange={handleChange('courseCode')}
        error={!!errors.courseCode}
        helperText={errors.courseCode}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Course Name"
        value={data.courseName}
        onChange={handleChange('courseName')}
        error={!!errors.courseName}
        helperText={errors.courseName}
        fullWidth
        margin="normal"
      />

      <TextField
        type="number"
        inputProps={{ min: 1 }}
        label="Credits"
        value={data.credits}
        onChange={handleChange('credits')}
        error={!!errors.credits}
        helperText={errors.credits}
        fullWidth
        margin="normal"
      />

      <TextField
        select
        label="Semester"
        value={data.semester}
        onChange={handleChange('semester')}
        error={!!errors.semester}
        helperText={errors.semester}
        fullWidth
        margin="normal"
      >
        <MenuItem value="A">A</MenuItem>
        <MenuItem value="B">B</MenuItem>
        <MenuItem value="C">C</MenuItem>
      </TextField>

      <TextField
        label="Assignments (comma separated)"
        value={data.assignments}
        onChange={handleChange('assignments')}
        error={!!errors.assignments}
        helperText={errors.assignments}
        fullWidth
        margin="normal"
        multiline
        minRows={2}
      />

      <Box mt={2} textAlign="right">
        <Button variant="contained" onClick={handleSubmit}>{isEdit ? 'Update' : 'Save'}</Button>
      </Box>
      <Snackbar
        open={snackOpen}
        autoHideDuration={1500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseForm;