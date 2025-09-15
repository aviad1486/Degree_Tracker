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

interface ProgramFormData {
  name: string;
  totalCreditsRequired: string;
  courses: string[];
}

const norm = (s: string) => (s || "").trim().toLowerCase();

export const useProgramForm = () => {
  const { name } = useParams<{ name?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(name);

  const [data, setData] = useState<ProgramFormData>({
    name: "",
    totalCreditsRequired: "0",
    courses: [],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProgramFormData, string>>
  >({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // preload if edit → טוען את הפרוגרם מ-Firestore
  useEffect(() => {
    if (isEdit && name) {
      const fetchProgram = async () => {
        const decoded = decodeURIComponent(name);
        const ref = doc(firestore, "programs", decoded);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const program: any = snap.data();
          setData({
            name: program.name,
            totalCreditsRequired: program.totalCreditsRequired.toString(),
            courses: program.courses || [],
          });
        }
      };
      fetchProgram();
    }
  }, [name, isEdit]);

  const validate = async (): Promise<boolean> => {
    const newErrors: typeof errors = {};
    if (!data.name.trim()) newErrors.name = "Program name is required";
    if (
      !/^\d+$/.test(data.totalCreditsRequired) ||
      parseInt(data.totalCreditsRequired, 10) < 0
    ) {
      newErrors.totalCreditsRequired =
        "Total credits must be a non-negative integer";
    }
    if (data.courses.length === 0) {
      newErrors.courses = "Enter at least one course code";
    }

    // Unique by name (case-insensitive)
    const snap = await getDocs(collection(firestore, "programs"));
    const all = snap.docs.map((d) => d.data() as any);
    const nm = norm(data.name);
    const clash = all.some(
      (p) => norm(p.name) === nm && (!isEdit || p.name !== name)
    );
    if (clash) newErrors.name = "Program name already exists";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (field: keyof ProgramFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async () => {
    if (!(await validate())) {
      setSnackMsg("Please fix the form errors");
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }
    const entry = {
      name: data.name.trim(),
      totalCreditsRequired: parseInt(data.totalCreditsRequired, 10),
      courses: data.courses,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(firestore, "programs", entry.name), entry);

    setSnackMsg(isEdit ? "Program updated successfully" : "Program added successfully");
    setSnackSeverity("success");
    setSnackOpen(true);
    setTimeout(() => navigate("/programs"), 2500);
  };

  return {
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
  };
};