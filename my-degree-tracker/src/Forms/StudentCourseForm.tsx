import React from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  ButtonGroup,
  Autocomplete,
} from '@mui/material';
import SnackbarNotification from '../components/SnackbarNotification';
import { useStudentCourseForm } from '../hooks/useStudentCourseForm';

const StudentCourseForm: React.FC = () => {
  const {
    data,
    setData,
    errors,
    snackOpen,
    setSnackOpen,
    snackMsg,
    snackSeverity,
    existingStudentOptions,
    existingCourseCodes,
    isEdit,
    handleChange,
    decAttempts,
    incAttempts,
    handleSubmit,
  } = useStudentCourseForm();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Student Course Record' : 'Add Student Course Record'}
      </Typography>

      {/* Student ID with autocomplete (LOCKED on edit) */}
      <Autocomplete
        freeSolo
        options={existingStudentOptions}
        value={existingStudentOptions.find((o) => o.id === data.studentId) ?? null}
        inputValue={data.studentId}
        disabled={isEdit} // lock only when editing (same idea as StudentForm)
        onInputChange={(_, newInput) => {
          if (isEdit) return; // block edits in edit mode
          setData((prev) => ({ ...prev, studentId: newInput.slice(0, 9) }));
        }}
        onChange={(_, newValue) => {
          if (isEdit) return; // block edits in edit mode
          if (typeof newValue === 'string') {
            setData((prev) => ({ ...prev, studentId: newValue }));
          } else if (newValue) {
            setData((prev) => ({ ...prev, studentId: newValue.id }));
          } else {
            setData((prev) => ({ ...prev, studentId: '' }));
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

      {/* Course Code with autocomplete */}
      <Autocomplete
        freeSolo
        options={existingCourseCodes}
        value={data.courseCode}
        onInputChange={(_, newValue) =>
          setData((prev) => ({ ...prev, courseCode: newValue }))
        }
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

      {/* Course Attempts counter */}
      <Box mt={2}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Attempts (times taken)
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <ButtonGroup variant="outlined" aria-label="retaken attempts controls">
            <Button onClick={decAttempts} aria-label="decrease attempts">
              -
            </Button>
            <Button disabled aria-label="current attempts">
              {data.retaken}
            </Button>
            <Button onClick={incAttempts} aria-label="increase attempts">
              +
            </Button>
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