import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem, FormControlLabel, Checkbox } from '@mui/material';

// Interface for student-course form data
interface StudentCourseFormData {
  studentId: string;
  courseCode: string;
  grade: string;
  semester: 'A' | 'B' | 'C';
  year: string;
  retaken: boolean;
}

const StudentCourseForm: React.FC = () => {
  const [data, setData] = useState<StudentCourseFormData>({
    studentId: '',
    courseCode: '',
    grade: '',
    semester: 'A',
    year: new Date().getFullYear().toString(),
    retaken: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof StudentCourseFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!/^\d{9}$/.test(data.studentId)) newErrors.studentId = 'Student ID must be exactly 9 digits';
    if (!data.courseCode.trim()) newErrors.courseCode = 'Course code is required';
    if (!/^\d+(\.\d+)?$/.test(data.grade) || Number(data.grade) < 0 || Number(data.grade) > 100) {
      newErrors.grade = 'Grade must be a number between 0 and 100';
    }
    if (!/^[ABC]$/.test(data.semester)) newErrors.semester = 'Select a valid semester (A, B, or C)';
    if (!/^\d{4}$/.test(data.year) || Number(data.year) < 2000) {
      newErrors.year = 'Enter a valid 4-digit year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof StudentCourseFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'retaken' ? (e.target as HTMLInputElement).checked : e.target.value;
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newEntry = {
      studentId: data.studentId,
      courseCode: data.courseCode.trim(),
      grade: Number(data.grade),
      semester: data.semester,
      year: Number(data.year),
      retaken: data.retaken,
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('studentCourses') || '[]');
    existing.push(newEntry);
    localStorage.setItem('studentCourses', JSON.stringify(existing));
    setData({ studentId: '', courseCode: '', grade: '', semester: 'A', year: new Date().getFullYear().toString(), retaken: false });
    alert('Student course record added successfully!');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>Add Student Course Record</Typography>
      <TextField
        label="Student ID"
        value={data.studentId}
        onChange={handleChange('studentId')}
        error={!!errors.studentId}
        helperText={errors.studentId}
        fullWidth
        margin="normal"
      />
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
        label="Grade"
        value={data.grade}
        onChange={handleChange('grade')}
        error={!!errors.grade}
        helperText={errors.grade}
        fullWidth
        margin="normal"
        type="number"
        inputProps={{ min: 0, max: 100 }}
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
        label="Year"
        value={data.year}
        onChange={handleChange('year')}
        error={!!errors.year}
        helperText={errors.year}
        fullWidth
        margin="normal"
        type="number"
        inputProps={{ min: 2000, max: new Date().getFullYear() }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={data.retaken}
            onChange={handleChange('retaken')}
          />
        }
        label="Retaken"
      />
      <Box mt={2} textAlign="right">
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </Box>
    </Box>
  );
};

export default StudentCourseForm;
