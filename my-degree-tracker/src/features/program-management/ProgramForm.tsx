import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Autocomplete } from "@mui/material";
import SnackbarNotification from "../../components/ui/SnackbarNotification";
import { useProgramForm } from "../../hooks/useProgramForm";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firestore/config";
import { useNavigate } from "react-router-dom";

import styles from "../styles/ProgramForm.module.css";

const ProgramForm: React.FC = () => {
  const {
    data, errors, snackOpen, snackMsg, snackSeverity,
    setSnackOpen, handleChange, handleSubmit, isEdit, setData
  } = useProgramForm();

  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const navigate = useNavigate();

  // טוען קורסים להצגת אפשרויות
  useEffect(() => {
    const fetchCourses = async () => {
      const snap = await getDocs(collection(firestore, "courses"));
      const list = snap.docs.map((d) => d.data().courseCode as string);
      setCourseOptions(list);
    };
    fetchCourses();
  }, []);

  return (
    <Box className={styles.programFormContainer}>
      <Typography variant="h3" className={styles.programFormTitle}>
        {isEdit ? "Edit Study Program" : "Add Study Program"}
      </Typography>

      <Box className={styles.programFormFields}>
        <TextField
          label="Program Name"
          value={data.name}
          onChange={handleChange("name")}
          error={!!errors.name}
          helperText={errors.name}
          required fullWidth margin="normal"
          disabled={isEdit}
          className={styles.programFormField}
        />

        <TextField
          label="Total Credits Required"
          type="number"
          value={data.totalCreditsRequired}
          onChange={handleChange("totalCreditsRequired")}
          error={!!errors.totalCreditsRequired}
          helperText={errors.totalCreditsRequired}
          required fullWidth margin="normal"
          className={styles.programFormField}
        />

        <Autocomplete
          multiple
          options={courseOptions}
          value={data.courses}
          onChange={(_, newValue) =>
            setData((prev) => ({ ...prev, courses: newValue }))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Courses"
              error={!!errors.courses}
              helperText={errors.courses}
              required
              margin="normal"
              className={styles.programFormField}
            />
          )}
        />
      </Box>

      <Box className={styles.formButtons}>
        <Button
          onClick={() => navigate("/programs")}
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

export default ProgramForm;