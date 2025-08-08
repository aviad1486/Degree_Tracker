import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
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
  const { courseCode } = useParams<{ courseCode: string }>();
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

  useEffect(() => {
    if (isEdit) {
      const courses = JSON.parse(localStorage.getItem('courses') || '[]');
      const course = courses.find((c: any) => c.courseCode === courseCode);
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

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!data.courseCode.trim()) newErrors.courseCode = 'Course code is required';
    if (!data.courseName.trim()) newErrors.courseName = 'Course name is required';
    if (!/^\d+$/.test(data.credits) || parseInt(data.credits, 10) < 1) {
      newErrors.credits = 'Credits must be an integer of at least 1';
    }
    if (!/^[ABC]$/.test(data.semester)) newErrors.semester = 'Select a valid semester';
    if (data.assignments.split(',').map(s => s.trim()).filter(Boolean).length === 0) {
      newErrors.assignments = 'Enter at least one assignment ID';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CourseFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const entry = {
      courseCode: data.courseCode.trim(),
      courseName: data.courseName.trim(),
      credits: parseInt(data.credits, 10),
      semester: data.semester,
      assignments: data.assignments.split(',').map(s => s.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    let updated;
    if (isEdit) {
      updated = courses.map((c: any) => c.courseCode === courseCode ? entry : c);
    } else {
      updated = [...courses, entry];
    }
    localStorage.setItem('courses', JSON.stringify(updated));
    navigate('/courses');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>{isEdit ? 'Edit Course' : 'Add Course'}</Typography>
      {/* All TextFields as before, with labels and helpers */}
      <Box mt={2} textAlign="right">
        <Button variant="contained" onClick={handleSubmit}>{isEdit ? 'Update' : 'Save'}</Button>
      </Box>
    </Box>
  );
};

export default CourseForm;
