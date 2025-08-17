import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error" | "info" | "warning">("success");

  // Load existing course in edit mode
  useEffect(() => {
    if (isEdit && courseCode) {
      const courses: AnyRec[] = JSON.parse(localStorage.getItem("courses") || "[]");
      const course = courses.find((c) => c.courseCode === courseCode);
      if (course) {
        setData({
          courseCode: course.courseCode,
          courseName: course.courseName,
          credits: course.credits.toString(),
          semester: course.semester,
          assignments: course.assignments.join(", "),
        });
      }
    }
  }, [courseCode, isEdit]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!data.courseCode.trim()) newErrors.courseCode = "Course code is required";
    if (!data.courseName.trim()) newErrors.courseName = "Course name is required";
    if (!/^\d+$/.test(data.credits) || parseInt(data.credits, 10) < 1) {
      newErrors.credits = "Credits must be a positive integer";
    }
    if (!/^[ABC]$/.test(data.semester)) newErrors.semester = "Select a valid semester";
    if (data.assignments.split(",").map((s) => s.trim()).filter(Boolean).length === 0) {
      newErrors.assignments = "Enter at least one assignment";
    }

    // Unique course code
    const all: AnyRec[] = JSON.parse(localStorage.getItem("courses") || "[]");
    const codeNorm = norm(data.courseCode);
    const clash = all.some(
      (c) => norm(c.courseCode) === codeNorm && (!isEdit || c.courseCode !== courseCode)
    );
    if (clash) newErrors.courseCode = "Course code already exists";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CourseFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!validate()) {
      setSnackMsg("Please fix the form errors");
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }

    const entry = {
      courseCode: data.courseCode.trim(),
      courseName: data.courseName.trim(),
      credits: parseInt(data.credits, 10),
      semester: data.semester,
      assignments: data.assignments.split(",").map((s) => s.trim()),
      createdAt: new Date().toISOString(),
    };

    const courses: AnyRec[] = JSON.parse(localStorage.getItem("courses") || "[]");

    const updated = isEdit
      ? courses.map((c) => (c.courseCode === courseCode ? entry : c))
      : [...courses, entry];

    localStorage.setItem("courses", JSON.stringify(updated));

    setData({ courseCode: "", courseName: "", credits: "1", semester: "A", assignments: "" });
    setSnackMsg(isEdit ? "Course updated successfully" : "Course added successfully");
    setSnackSeverity("success");
    setSnackOpen(true);

    setTimeout(() => navigate("/courses"), 1200);
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
