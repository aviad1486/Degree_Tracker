import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { firestore } from "../firestore/config";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
} from "firebase/firestore";

type AnyRec = Record<string, any>;
const norm = (s: string) => (s || "").trim().toLowerCase();

export interface CourseFormData {
  courseCode: string;
  courseName: string;
  credits: string;
  semester: "A" | "B" | "C";
  assignments: string;
}

export function useCourseForm() {
  const { courseCode } = useParams<{ courseCode?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(courseCode);

  const [data, setData] = useState<CourseFormData>({
    courseCode: "",
    courseName: "",
    credits: "1",
    semester: "A",
    assignments: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CourseFormData, string>>
  >({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // --- Load existing course in edit mode
  useEffect(() => {
    if (isEdit && courseCode) {
      (async () => {
        const ref = doc(firestore, "courses", courseCode);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const course = snap.data() as AnyRec;
          setData({
            courseCode: course.courseCode,
            courseName: course.courseName,
            credits: String(course.credits ?? "1"),
            semester: course.semester,
            assignments: Array.isArray(course.assignments)
              ? course.assignments.join(", ")
              : String(course.assignments || ""),
          });
        }
      })();
    }
  }, [isEdit, courseCode]);

  // --- Validation
  const validate = async (): Promise<boolean> => {
    const newErrors: typeof errors = {};
    if (!data.courseCode.trim())
      newErrors.courseCode = "Course code is required";
    if (!data.courseName.trim())
      newErrors.courseName = "Course name is required";
    if (!/^\d+$/.test(data.credits) || parseInt(data.credits, 10) < 1) {
      newErrors.credits = "Credits must be a positive integer";
    }
    if (!/^[ABC]$/.test(data.semester))
      newErrors.semester = "Select a valid semester";
    if (
      data.assignments
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean).length === 0
    ) {
      newErrors.assignments = "Enter at least one assignment";
    }

    // --- Unique courseCode check
    const snap = await getDocs(collection(firestore, "courses"));
    const codeNorm = norm(data.courseCode);
    const clash = snap.docs.some((d) => {
      const c = d.data() as AnyRec;
      return (
        norm(c.courseCode) === codeNorm &&
        (!isEdit || d.id !== courseCode)
      );
    });
    if (clash) newErrors.courseCode = "Course code already exists";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Handle input change
  const handleChange =
    (field: keyof CourseFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isEdit && field === "courseCode") return; // לא משנים מזהה במצב עריכה
      setData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // --- Save course
  const handleSubmit = async () => {
    if (!(await validate())) {
      setSnackMsg("Please fix the form errors");
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }

    const effectiveCourseCode =
      isEdit && courseCode ? courseCode : data.courseCode.trim();

    const entry = {
      courseCode: effectiveCourseCode,
      courseName: data.courseName.trim(),
      credits: parseInt(data.credits, 10),
      semester: data.semester,
      assignments: data.assignments.split(",").map((s) => s.trim()),
      ...(isEdit
        ? { updatedAt: new Date().toISOString() }
        : { createdAt: new Date().toISOString() }),
    };

    const ref = doc(firestore, "courses", effectiveCourseCode);
    if (isEdit) {
      await updateDoc(ref, entry);
    } else {
      await setDoc(ref, entry);
    }

    setData({
      courseCode: "",
      courseName: "",
      credits: "1",
      semester: "A",
      assignments: "",
    });
    setSnackMsg(isEdit ? "Course updated successfully" : "Course added successfully");
    setSnackSeverity("success");
    setSnackOpen(true);

    setTimeout(() => navigate("/courses"), 2500);
  };

  return {
    data,
    errors,
    snackOpen,
    snackMsg,
    snackSeverity,
    setSnackOpen,
    handleChange,
    handleSubmit,
    isEdit,
  };
}