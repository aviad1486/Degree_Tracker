import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, MenuItem, Autocomplete } from "@mui/material";
import SnackbarNotification from "../components/SnackbarNotification";
import { useStudentForm } from "../hooks/useStudentForm";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firestore/config";

const StudentForm: React.FC = () => {
  const {
    data, errors, snackOpen, snackMsg, snackSeverity,
    setSnackOpen, handleChange, handleSubmit, isEdit, setData
  } = useStudentForm();

  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [programOptions, setProgramOptions] = useState<string[]>([]);

  // טוען קורסים מ-Firestore להצגת אפשרויות
  useEffect(() => {
    const fetchCourses = async () => {
      const snap = await getDocs(collection(firestore, "courses"));
      const list = snap.docs.map(d => d.data().courseCode as string);
      setCourseOptions(list);
    };
    fetchCourses();
  }, []);

  // טוען מסלולים מ-Firestore להצגת אפשרויות
  useEffect(() => {
    const fetchPrograms = async () => {
      const snap = await getDocs(collection(firestore, "programs"));
      const list = snap.docs.map(d => d.data().name as string);
      setProgramOptions(list);
    };
    fetchPrograms();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? "Edit Student" : "Add Student"}
      </Typography>

      <TextField
        label="ID"
        value={data.id}
        onChange={handleChange("id")}
        error={!!errors.id}
        helperText={errors.id}
        required fullWidth margin="normal"
        disabled={isEdit}
      />

      <TextField
        label="Full Name"
        value={data.fullName}
        onChange={handleChange("fullName")}
        error={!!errors.fullName}
        helperText={errors.fullName}
        required fullWidth margin="normal"
        disabled={isEdit}
      />

      <TextField
        label="Email"
        value={data.email}
        onChange={handleChange("email")}
        error={!!errors.email}
        helperText={errors.email}
        required fullWidth margin="normal"
        disabled={isEdit}
      />

      {/* בחירת קורסים מרובים */}
      <Autocomplete
        multiple
        options={courseOptions}
        value={data.courses}
        onChange={(_, newValue) => setData(prev => ({ ...prev, courses: newValue }))}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Courses"
            error={!!errors.courses}
            helperText={errors.courses}
            required
            margin="normal"
          />
        )}
      />

      <TextField
        label="Assignments (comma separated)"
        value={data.assignments}
        onChange={handleChange("assignments")}
        error={!!errors.assignments}
        helperText={errors.assignments}
        fullWidth margin="normal"
      />

      <TextField
        label="Grade Sheet (JSON)"
        value={data.gradeSheet}
        onChange={handleChange("gradeSheet")}
        error={!!errors.gradeSheet}
        helperText={errors.gradeSheet}
        required fullWidth margin="normal"
        multiline minRows={3}
      />

      {/* בחירת מסלול יחיד */}
      <Autocomplete
        options={programOptions}
        value={data.program || ""}
        onChange={(_, newValue) => setData(prev => ({ ...prev, program: newValue || "" }))}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Program"
            error={!!errors.program}
            helperText={errors.program}
            required
            margin="normal"
          />
        )}
      />

      <TextField
        select label="Current Semester"
        value={data.semester}
        onChange={handleChange("semester")}
        error={!!errors.semester}
        helperText={errors.semester}
        required fullWidth margin="normal"
      >
        <MenuItem value="A">A</MenuItem>
        <MenuItem value="B">B</MenuItem>
        <MenuItem value="C">C</MenuItem>
      </TextField>

      <TextField
        label="Completed Credits"
        type="number"
        value={data.completedCredits}
        onChange={handleChange("completedCredits")}
        error={!!errors.completedCredits}
        helperText={errors.completedCredits}
        required fullWidth margin="normal"
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

export default StudentForm;
