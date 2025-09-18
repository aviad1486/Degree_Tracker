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
import SnackbarNotification from '../../components/ui/SnackbarNotification';
import { useStudentCourseForm } from '../../hooks/useStudentCourseForm';
import { useNavigate } from "react-router-dom";

import styles from "../styles/StudentCourseForm.module.css";

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
  
  const navigate = useNavigate();

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.formCard}>
        <Typography variant="h3" className={styles.formTitle}>
          {isEdit ? 'Edit Student Course Record' : 'Add Student Course Record'}
        </Typography>

        {/* Student ID */}
        <Autocomplete
          freeSolo
          options={existingStudentOptions}
          value={existingStudentOptions.find((o) => o.id === data.studentId) ?? null}
          inputValue={data.studentId}
          disabled={isEdit}
          onInputChange={(_, newInput) => {
            if (isEdit) return;
            setData((prev) => ({ ...prev, studentId: newInput.slice(0, 9) }));
          }}
          onChange={(_, newValue) => {
            if (isEdit) return;
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
              className={styles.formField}
            />
          )}
        />

        {/* Course Code */}
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
              className={styles.formField}
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
          className={styles.formField}
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
          className={styles.formField}
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
          className={styles.formField}
        />

        {/* Attempts */}
        <Box mt={2}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Attempts (times taken)
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <ButtonGroup variant="outlined" aria-label="retaken attempts controls">
              <Button onClick={decAttempts}>-</Button>
              <Button disabled>{data.retaken}</Button>
              <Button onClick={incAttempts}>+</Button>
            </ButtonGroup>
            {errors.retaken && (
              <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                {errors.retaken}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Buttons */}
        <Box mt={3} className={styles.actionsContainer}>
          <Button variant="outlined" color="error" className={styles.cancelButton} onClick={() => navigate("/student-courses")}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} className={styles.saveButton}>
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
    </Box>
  );
};

export default StudentCourseForm;