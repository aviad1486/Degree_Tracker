import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';

// Interface for course form data
interface CourseFormData {
  courseCode: string;
  courseName: string;
  credits: string;
  semester: 'A' | 'B' | 'C';
  assignments: string;
}

const CourseForm: React.FC = () => {
  const [data, setData] = useState<CourseFormData>({
    courseCode: '',
    courseName: '',
    credits: '1',
    semester: 'A',
    assignments: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!data.courseCode.trim()) newErrors.courseCode = 'Course code is required';
    if (!data.courseName.trim()) newErrors.courseName = 'Course name is required';
    if (!/^\d+$/.test(data.credits) || parseInt(data.credits, 10) < 1) {
      newErrors.credits = 'Credits must be an integer of at least 1';
    }
    if (!/^[ABC]$/.test(data.semester)) {
      newErrors.semester = 'Select a valid semester (A, B, or C)';
    }
    const list = data.assignments.split(',').map(s => s.trim()).filter(Boolean);
    if (list.length === 0) newErrors.assignments = 'Enter at least one assignment ID';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CourseFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newCourse = {
      courseCode: data.courseCode.trim(),
      courseName: data.courseName.trim(),
      credits: parseInt(data.credits, 10),
      semester: data.semester,
      assignments: data.assignments.split(',').map(s => s.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('courses') || '[]');
    existing.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(existing));
    setData({ courseCode: '', courseName: '', credits: '1', semester: 'A', assignments: '' });
    alert('Course added successfully!');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>Add Course</Typography>
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
        label="Credits"
        value={data.credits}
        onChange={handleChange('credits')}
        error={!!errors.credits}
        helperText={errors.credits}
        fullWidth
        margin="normal"
        type="number"
        inputProps={{ min: 1 }}
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
        label="Assignments (comma separated IDs)"
        value={data.assignments}
        onChange={handleChange('assignments')}
        error={!!errors.assignments}
        helperText={errors.assignments}
        fullWidth
        margin="normal"
      />
      <Box mt={2} textAlign="right">
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </Box>
    </Box>
  );
};

export default CourseForm;
