import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, ButtonGroup, Autocomplete } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import SnackbarNotification from '../components/SnackbarNotification';

interface StudentCourseFormData {
  studentId: string;
  courseCode: string;
  grade: string;
  semester: 'A' | 'B' | 'C';
  year: string;
  retaken: number;
}

type AnyRecord = Record<string, any>;
type StudentOption = { id: string; fullName: string };

const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

const StudentCourseForm: React.FC = () => {
  const { index } = useParams<{ index?: string }>();
  const navigate = useNavigate();
  const isEdit = index !== undefined;

  const [data, setData] = useState<StudentCourseFormData>({
    studentId: '',
    courseCode: '',
    grade: '',
    semester: 'A',
    year: new Date().getFullYear().toString(),
    retaken: 1,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof StudentCourseFormData, string>>>({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [snackSeverity, setSnackSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  // options for selects/autocomplete
  const [existingStudentOptions, setExistingStudentOptions] = useState<StudentOption[]>([]);
  const [existingCourseCodes, setExistingCourseCodes] = useState<string[]>([]);

  // Load options from localStorage (ONLY from "students"; filter out missing/invalid names)
  useEffect(() => {
    const students: AnyRecord[] = JSON.parse(localStorage.getItem('students') || '[]');
    const courses: AnyRecord[] = JSON.parse(localStorage.getItem('courses') || '[]');
    const studentCourses: AnyRecord[] = JSON.parse(localStorage.getItem('studentCourses') || '[]');

    const studentOptions: StudentOption[] = students
      .map((s) => {
        const id = String(s.id ?? '').trim();
        // take any of the possible name fields; normalize and trim
        const rawName = (s.fullName ?? s.name ?? s.displayName ?? '').toString().trim();
        const lower = rawName.toLowerCase();
        const validName = rawName.length > 0 && lower !== 'undefined' && lower !== 'null';
        return { id, fullName: validName ? rawName : '' };
      })
      // keep only: valid 9-digit id + non-empty name
      .filter((o) => /^\d{9}$/.test(o.id) && o.fullName.length > 0)
      .sort((a, b) => a.id.localeCompare(b.id));

    setExistingStudentOptions(studentOptions);

    // Course codes can be merged with studentCourses history (this is fine)
    const codesFromCourses = courses.map((c) => c.courseCode);
    const codesFromStudentCourses = studentCourses.map((sc) => sc.courseCode);
    setExistingCourseCodes(uniq([...codesFromCourses, ...codesFromStudentCourses]).sort());
  }, []);

  // Prefill in edit mode
  useEffect(() => {
    if (isEdit && index !== undefined) {
      const records: any[] = JSON.parse(localStorage.getItem('studentCourses') || '[]');
      const idx = parseInt(index, 10);
      const record = records[idx];
      if (record) {
        const retakenCount =
          typeof record.retaken === 'number'
            ? Math.max(1, Math.floor(record.retaken))
            : record.retaken
            ? 2
            : 1;

        setData({
          studentId: record.studentId ?? '',
          courseCode: record.courseCode ?? '',
          grade: (record.grade ?? '').toString(),
          semester: record.semester ?? 'A',
          year: (record.year ?? new Date().getFullYear()).toString(),
          retaken: retakenCount,
        });
      }
    }
  }, [index, isEdit]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!/^\d{9}$/.test(data.studentId)) newErrors.studentId = 'Student ID must be exactly 9 digits';
    if (!data.courseCode.trim()) newErrors.courseCode = 'Course code is required';
    if (!/^\d+(?:\.\d+)?$/.test(data.grade) || Number(data.grade) < 0 || Number(data.grade) > 100) {
      newErrors.grade = 'Grade must be a number between 0 and 100';
    }
    if (!/^[ABC]$/.test(data.semester)) newErrors.semester = 'Select a valid semester (A, B, or C)';
    if (!/^\d{4}$/.test(data.year) || Number(data.year) < 1960) {
      newErrors.year = 'Enter a valid 4-digit year (>= 1960)';
    }
    if (!Number.isInteger(data.retaken) || data.retaken < 1) {
      newErrors.retaken = 'Attempts must be an integer ≥ 1';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof StudentCourseFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setData((prev) => ({ ...prev, [field]: value as any }));
  };

  const decAttempts = () => setData((prev) => ({ ...prev, retaken: Math.max(1, (prev.retaken ?? 1) - 1) }));
  const incAttempts = () => setData((prev) => ({ ...prev, retaken: Math.max(1, (prev.retaken ?? 1) + 1) }));

  // keep students.gradeSheet in sync
  const upsertStudentGrade = (studentId: string, courseCode: string, grade: number) => {
    const students: AnyRecord[] = JSON.parse(localStorage.getItem('students') || '[]');
    const idx = students.findIndex((s) => s.id === studentId);
    if (idx === -1) return;
    const s = students[idx];
    const sheet = s.gradeSheet && typeof s.gradeSheet === 'object' && !Array.isArray(s.gradeSheet) ? { ...s.gradeSheet } : {};
    sheet[courseCode] = grade;
    students[idx] = { ...s, gradeSheet: sheet };
    localStorage.setItem('students', JSON.stringify(students));
  };

  const handleSubmit = () => {
    if (!validate()) {
      setSnackMsg('Please fix the form errors');
      setSnackSeverity('error');
      setSnackOpen(true);
      return;
    }

    const trimmedCourse = data.courseCode.trim();
    const records: AnyRecord[] = JSON.parse(localStorage.getItem('studentCourses') || '[]');

    const matchIdx = records.findIndex((r) => r.studentId === data.studentId && r.courseCode === trimmedCourse);

    if (matchIdx !== -1) {
      const existing = records[matchIdx];
      const existingAttempts = typeof existing.retaken === 'number' ? existing.retaken : existing.retaken ? 2 : 1;

      const updated = {
        ...existing,
        grade: Number(data.grade),
        semester: data.semester,
        year: Number(data.year),
        retaken: Math.max(1, existingAttempts + 1),
        updatedAt: new Date().toISOString(),
      };

      records[matchIdx] = updated;
      localStorage.setItem('studentCourses', JSON.stringify(records));
      upsertStudentGrade(data.studentId, trimmedCourse, Number(data.grade));

      setSnackMsg('Existing record found — attempts incremented by 1');
      setSnackSeverity('success');
      setSnackOpen(true);
    } else {
      const entry = {
        studentId: data.studentId,
        courseCode: trimmedCourse,
        grade: Number(data.grade),
        semester: data.semester,
        year: Number(data.year),
        retaken: data.retaken,
        createdAt: new Date().toISOString(),
      };

      const updated = [...records, entry];
      localStorage.setItem('studentCourses', JSON.stringify(updated));
      upsertStudentGrade(data.studentId, trimmedCourse, Number(data.grade));

      setSnackMsg('Record saved successfully');
      setSnackSeverity('success');
      setSnackOpen(true);
    }

    setTimeout(() => navigate('/student-courses'), 1500);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Student Course Record' : 'Add Student Course Record'}
      </Typography>

      {/* Student ID with autocomplete (shows "ID — Name", saves only ID) */}
      <Autocomplete
        freeSolo
        options={existingStudentOptions}                       // רק סטודנטים עם שם תקין
        value={existingStudentOptions.find(o => o.id === data.studentId) ?? null}
        inputValue={data.studentId}                            // מציג בתיבה רק את ה-ID
        onInputChange={(_, newInput) =>
          setData(prev => ({ ...prev, studentId: newInput.slice(0, 9) }))
        }
        onChange={(_, newValue) => {
          if (typeof newValue === 'string') {
            setData(prev => ({ ...prev, studentId: newValue }));
          } else if (newValue) {
            setData(prev => ({ ...prev, studentId: newValue.id }));
          } else {
            setData(prev => ({ ...prev, studentId: '' }));
          }
        }}
        getOptionLabel={(option) =>
          typeof option === 'string'
            ? option
            : `${option.id} — ${option.fullName}`
        }
        isOptionEqualToValue={(opt, val) =>
          typeof val === 'string' ? opt.id === val : opt.id === val?.id
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Student ID"
            error={!!errors.studentId}
            helperText={errors.studentId}
            required
            fullWidth
            margin="normal"
            inputProps={{ ...params.inputProps, maxLength: 9 }}
          />
        )}
      />

      {/* Course Code with autocomplete (free text allowed) */}
      <Autocomplete
        freeSolo
        options={existingCourseCodes}
        value={data.courseCode}
        onInputChange={(_, newValue) => setData((prev) => ({ ...prev, courseCode: newValue }))}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Course Code"
            error={!!errors.courseCode}
            helperText={errors.courseCode}
            required
            fullWidth
            margin="normal"
          />
        )}
      />

      <TextField
        label="Grade"
        value={data.grade}
        onChange={handleChange('grade')}
        error={!!errors.grade}
        helperText={errors.grade}
        required
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
        required
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
        required
        fullWidth
        margin="normal"
        type="number"
        inputProps={{ min: 1960, max: new Date().getFullYear() }}
      />

      {/* Attempts counter */}
      <Box mt={2}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Attempts (times taken)
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <ButtonGroup variant="outlined" aria-label="retaken attempts controls">
            <Button onClick={decAttempts} aria-label="decrease attempts">-</Button>
            <Button disabled aria-label="current attempts">{data.retaken}</Button>
            <Button onClick={incAttempts} aria-label="increase attempts">+</Button>
          </ButtonGroup>
          {errors.retaken && (
            <Typography variant="caption" color="error" sx={{ ml: 1 }}>
              {errors.retaken}
            </Typography>
          )}
        </Box>
      </Box>

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

export default StudentCourseForm;
