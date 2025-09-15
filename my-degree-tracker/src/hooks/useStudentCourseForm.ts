import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../firestore/config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

interface StudentCourseFormData {
  studentId: string;
  courseCode: string;
  grade: string;
  semester: "A" | "B" | "C";
  year: string;
  attempts: number;
}

type StudentOption = { id: string; fullName: string };

const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

export const useStudentCourseForm = () => {
  const { index } = useParams<{ index?: string }>();
  const navigate = useNavigate();
  const isEdit = index !== undefined;

  const [data, setData] = useState<StudentCourseFormData>({
    studentId: "",
    courseCode: "",
    grade: "",
    semester: "A",
    year: new Date().getFullYear().toString(),
    attempts: 1,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof StudentCourseFormData, string>>
  >({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const [existingStudentOptions, setExistingStudentOptions] = useState<
    StudentOption[]
  >([]);
  const [existingCourseCodes, setExistingCourseCodes] = useState<string[]>([]);

  // טוען את הסטודנטים והקורסים מ-Firestore
  useEffect(() => {
    const fetchData = async () => {
      const studentsSnap = await getDocs(collection(firestore, "students"));
      const coursesSnap = await getDocs(collection(firestore, "courses"));
      const studentCoursesSnap = await getDocs(
        collection(firestore, "studentCourses")
      );

      const students = studentsSnap.docs.map((d) => d.data() as any);
      const courses = coursesSnap.docs.map((d) => d.data() as any);
      const studentCourses = studentCoursesSnap.docs.map((d) => d.data() as any);

      const studentOptions: StudentOption[] = students
        .map((s) => {
          const id = String(s.id ?? "").trim();
          const rawName = (s.fullName ?? s.name ?? s.displayName ?? "")
            .toString()
            .trim();
          const lower = rawName.toLowerCase();
          const validName =
            rawName.length > 0 && lower !== "undefined" && lower !== "null";
          return { id, fullName: validName ? rawName : "" };
        })
        .filter((o) => /^\d{9}$/.test(o.id) && o.fullName.length > 0)
        .sort((a, b) => a.id.localeCompare(b.id));

      setExistingStudentOptions(studentOptions);

      const codesFromCourses = courses.map((c) => c.courseCode);
      const codesFromStudentCourses = studentCourses.map(
        (sc) => sc.courseCode
      );
      setExistingCourseCodes(
        uniq([...codesFromCourses, ...codesFromStudentCourses]).sort()
      );
    };
    fetchData();
  }, []);

  // במצב עריכה → מושך את הרשומה מ-Firestore
  useEffect(() => {
    if (isEdit && index) {
      const fetchRecord = async () => {
        const ref = doc(firestore, "studentCourses", index);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const record: any = snap.data();
          const attemptsCount =
            typeof record.attempts === "number"
              ? Math.max(1, Math.floor(record.attempts))
              : record.attempts
              ? 2
              : 1;

          setData({
            studentId: record.studentId ?? "",
            courseCode: record.courseCode ?? "",
            grade: (record.grade ?? "").toString(),
            semester: record.semester ?? "A",
            year: (record.year ?? new Date().getFullYear()).toString(),
            attempts: attemptsCount,
          });
        }
      };
      fetchRecord();
    }
  }, [isEdit, index]);

  // --- validation
  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!/^\d{9}$/.test(data.studentId))
      newErrors.studentId = "Student ID must be exactly 9 digits";
    if (!data.courseCode.trim())
      newErrors.courseCode = "Course code is required";
    if (
      !/^\d+(?:\.\d+)?$/.test(data.grade) ||
      Number(data.grade) < 0 ||
      Number(data.grade) > 100
    ) {
      newErrors.grade = "Grade must be a number between 0 and 100";
    }
    if (!/^[ABC]$/.test(data.semester))
      newErrors.semester = "Select a valid semester (A, B, or C)";
    if (!/^\d{4}$/.test(data.year) || Number(data.year) < 1960) {
      newErrors.year = "Enter a valid 4-digit year (>= 1960)";
    }
    if (!Number.isInteger(data.attempts) || data.attempts < 1) {
      newErrors.attempts = "Attempts must be an integer ≥ 1";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (field: keyof StudentCourseFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setData((prev) => ({ ...prev, [field]: value as any }));
    };

  const decAttempts = () =>
    setData((prev) => ({
      ...prev,
      attempts: Math.max(1, (prev.attempts ?? 1) - 1),
    }));
  const incAttempts = () =>
    setData((prev) => ({
      ...prev,
      attempts: Math.max(1, (prev.attempts ?? 1) + 1),
    }));

  const handleSubmit = async () => {
    if (!validate()) {
      setSnackMsg("Please fix the form errors");
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }

    const entry = {
      studentId: data.studentId,
      courseCode: data.courseCode.trim(),
      grade: Number(data.grade),
      semester: data.semester,
      year: Number(data.year),
      attempts: data.attempts,
      updatedAt: new Date().toISOString(),
    };

    // שמירה / עדכון ב-Firestore
    await setDoc(
      doc(firestore, "studentCourses", isEdit && index ? index : `${data.studentId}_${data.courseCode}`),
      {
        ...entry,
        ...(isEdit ? {} : { createdAt: new Date().toISOString() }),
      }
    );

    setSnackMsg(isEdit ? "Record updated" : "Record saved successfully");
    setSnackSeverity("success");
    setSnackOpen(true);

    setTimeout(() => navigate("/student-courses"), 2500);
  };

  return {
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
  };
};