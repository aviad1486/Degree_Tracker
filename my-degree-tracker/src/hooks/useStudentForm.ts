import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Student } from "../models/Student";

import { firestore } from "../firestore/config";
import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";

const norm = (s: string) => (s || "").trim().toLowerCase();

export interface StudentFormData {
  id: string;
  fullName: string;
  email: string;
  courses: string;
  assignments: string;
  gradeSheet: string;
  program: string;
  semester: "A" | "B" | "C";
  completedCredits: string;
}

export function useStudentForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [data, setData] = useState<StudentFormData>({
    id: "",
    fullName: "",
    email: "",
    courses: "",
    assignments: "",
    gradeSheet: "",
    program: "",
    semester: "A",
    completedCredits: "0",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error" | "info" | "warning">(
    "success"
  );

  // preload if edit → טעינת סטודנט לפי id מ-Firestore
  useEffect(() => {
    if (isEdit && id) {
      const fetchStudent = async () => {
        const ref = doc(firestore, "students", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const student = snap.data() as Student;
          setData({
            id: student.id,
            fullName: student.fullName,
            email: student.email,
            courses: (student.courses || []).join(", "),
            assignments: (student.assignments || []).join(", "),
            gradeSheet: JSON.stringify(student.gradeSheet || {}),
            program: student.program,
            semester: student.semester,
            completedCredits: String(student.completedCredits ?? "0"),
          });
        }
      };
      fetchStudent();
    }
  }, [id, isEdit]);

  const validate = async (): Promise<boolean> => {
    const newErrors: typeof errors = {};
    if (!/^\d{9}$/.test(data.id)) newErrors.id = "ID must be exactly 9 digits";
    if (!/\S+\s+\S+/.test(data.fullName)) newErrors.fullName = "Please enter a full name";
    if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(data.email)) newErrors.email = "Invalid email";

    const courseList = data.courses.split(",").map(s => s.trim()).filter(Boolean);
    if (courseList.length === 0) newErrors.courses = "Enter at least one course";

    try {
      const sheet = JSON.parse(data.gradeSheet);
      if (typeof sheet !== "object" || Array.isArray(sheet)) throw new Error();
      for (const [, grade] of Object.entries(sheet)) {
        if (typeof grade !== "number" || grade < 0 || grade > 100) throw new Error();
      }
    } catch {
      newErrors.gradeSheet = 'Enter valid JSON (e.g. {"CS101": 85})';
    }

    if (!data.program.trim()) newErrors.program = "Please select a program";
    if (!/^[ABC]$/.test(data.semester)) newErrors.semester = "Select a valid semester";
    if (!/^\d+$/.test(data.completedCredits) || parseInt(data.completedCredits, 10) < 0) {
      newErrors.completedCredits = "Completed credits must be non-negative";
    }

    // uniqueness check מול Firestore
    const snap = await getDocs(collection(firestore, "students"));
    const students = snap.docs.map(d => d.data() as Student);

    const emailNorm = norm(data.email);
    const programNorm = norm(data.program);

    const emailClash = students.some(s => norm(s.email) === emailNorm && s.id !== data.id);
    if (emailClash) newErrors.email = "Email already exists for a different student ID";

    const sameIdProgram = students.some(
      s => s.id === data.id && norm(s.program) === programNorm && (!isEdit || s.id !== id)
    );
    if (sameIdProgram) newErrors.program = "This ID is already registered to this program";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof StudentFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!(await validate())) {
      setSnackMsg("Please fix the form errors");
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }

    const newStudent: Student = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      courses: data.courses.split(",").map(s => s.trim()).filter(Boolean),
      assignments: data.assignments.split(",").map(s => s.trim()).filter(Boolean),
      gradeSheet: JSON.parse(data.gradeSheet),
      program: data.program,
      semester: data.semester,
      completedCredits: parseInt(data.completedCredits, 10),
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(firestore, "students", newStudent.id), newStudent);

    setSnackMsg(isEdit ? "Student updated successfully!" : "Student added successfully!");
    setSnackSeverity("success");
    setSnackOpen(true);
    setTimeout(() => navigate("/students"), 2500);
  };

  return {
    data, errors, snackOpen, snackMsg, snackSeverity,
    setSnackOpen, handleChange, handleSubmit, isEdit
  };
}