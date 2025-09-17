import React from "react";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import SnackbarNotification from "../../components/ui/SnackbarNotification";
import { useCourseForm } from "../../hooks/useCourseForm";
import { useNavigate } from "react-router-dom";

import styles from "../styles/CourseForm.module.css";

const CourseForm: React.FC = () => {
  const {
    data, errors, snackOpen, snackMsg, snackSeverity,
    setSnackOpen, handleChange, handleSubmit, isEdit
  } = useCourseForm();

  const navigate = useNavigate();

  return (
    <Box className={styles.courseFormContainer}>
      <Typography className={styles.courseFormTitle}>
        {isEdit ? "Edit Course" : "Add Course"}
      </Typography>

      <Box className={styles.courseFormGrid}>
        <Box className={styles.courseFormField}>
          <TextField
            label="Course Code"
            value={data.courseCode}
            onChange={handleChange("courseCode")}
            error={!!errors.courseCode}
            helperText={errors.courseCode}
            required fullWidth
            disabled={isEdit}
          />
        </Box>

        <Box className={styles.courseFormField}>
          <TextField
            label="Course Name"
            value={data.courseName}
            onChange={handleChange("courseName")}
            error={!!errors.courseName}
            helperText={errors.courseName}
            required fullWidth
          />
        </Box>

        <Box className={styles.courseFormField}>
          <TextField
            label="Credits"
            type="number"
            value={data.credits}
            onChange={handleChange("credits")}
            error={!!errors.credits}
            helperText={errors.credits}
            required fullWidth
          />
        </Box>

        <Box className={styles.courseFormField}>
          <TextField
            select
            label="Semester"
            value={data.semester}
            onChange={handleChange("semester")}
            error={!!errors.semester}
            helperText={errors.semester}
            required fullWidth
          >
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
          </TextField>
        </Box>

        <Box className={styles.courseFormField} style={{ gridColumn: "1 / span 2" }}>
          <TextField
            label="Assignments (comma separated)"
            value={data.assignments}
            onChange={handleChange("assignments")}
            error={!!errors.assignments}
            helperText={errors.assignments}
            fullWidth
            multiline
            minRows={3}
          />
        </Box>
      </Box>

      <Box className={styles.formButtons}>
        <Button
          onClick={() => navigate("/courses")}
          className={styles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          className={styles.saveButton}
        >
          {isEdit ? "Update" : "Save"}
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

export default CourseForm;