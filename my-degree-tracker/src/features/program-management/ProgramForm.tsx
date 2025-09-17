import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Autocomplete } from "@mui/material";
import SnackbarNotification from "../../components/ui/SnackbarNotification";
import { useProgramForm } from "../../hooks/useProgramForm";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firestore/config";

const ProgramForm: React.FC = () => {
  const {
    data,
    setData,
    errors,
    snackOpen,
    setSnackOpen,
    snackMsg,
    snackSeverity,
    isEdit,
    handleChange,
    handleSubmit,
  } = useProgramForm();

  const [courseOptions, setCourseOptions] = useState<string[]>([]);

  // טוען את רשימת הקורסים מ-Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      const snap = await getDocs(collection(firestore, "courses"));
      const list = snap.docs.map((d) => d.data().courseCode as string);
      setCourseOptions(list);
    };
    fetchCourses();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? "Edit Study Program" : "Add Study Program"}
      </Typography>

      <TextField
        label="Program Name"
        value={data.name}
        onChange={handleChange("name")}
        error={!!errors.name}
        helperText={errors.name}
        required
        fullWidth
        margin="normal"
        disabled={isEdit}
      />

      <TextField
        type="number"
        inputProps={{ min: 0 }}
        label="Total Credits Required"
        value={data.totalCreditsRequired}
        onChange={handleChange("totalCreditsRequired")}
        error={!!errors.totalCreditsRequired}
        helperText={errors.totalCreditsRequired}
        required
        fullWidth
        margin="normal"
      />

      {/* בחירת קורסים מרובים מתוך רשימת קורסים */}
      <Autocomplete
        multiple
        options={courseOptions}
        value={data.courses}
        onChange={(_, newValue) => setData((prev) => ({ ...prev, courses: newValue }))}
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

export default ProgramForm;
