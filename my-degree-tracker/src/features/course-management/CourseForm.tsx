import React from "react";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import SnackbarNotification from "../../components/ui/SnackbarNotification";
import { useCourseForm } from "../../hooks/useCourseForm";

const CourseForm: React.FC = () => {
  const {
    data,
    errors,
    snackOpen,
    snackMsg,
    snackSeverity,
    setSnackOpen,
    handleChange,
    handleSubmit,
    isEdit,
  } = useCourseForm();

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? "Edit Course" : "Add Course"}
      </Typography>

      <TextField
        label="Course Code"
        value={data.courseCode}
        onChange={handleChange("courseCode")}
        error={!!errors.courseCode}
        helperText={errors.courseCode}
        required
        fullWidth
        margin="normal"
        disabled={isEdit}
      />

      <TextField
        label="Course Name"
        value={data.courseName}
        onChange={handleChange("courseName")}
        error={!!errors.courseName}
        helperText={errors.courseName}
        required
        fullWidth
        margin="normal"
      />

      <TextField
        type="number"
        inputProps={{ min: 1 }}
        label="Credits"
        value={data.credits}
        onChange={handleChange("credits")}
        error={!!errors.credits}
        helperText={errors.credits}
        required
        fullWidth
        margin="normal"
      />

      <TextField
        select
        label="Semester"
        value={data.semester}
        onChange={handleChange("semester")}
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
        label="Assignments (comma separated)"
        value={data.assignments}
        onChange={handleChange("assignments")}
        error={!!errors.assignments}
        helperText={errors.assignments}
        required
        fullWidth
        margin="normal"
        multiline
        minRows={2}
      />

      <Box mt={2} textAlign="right">
        <Button variant="contained" onClick={handleSubmit}>
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
