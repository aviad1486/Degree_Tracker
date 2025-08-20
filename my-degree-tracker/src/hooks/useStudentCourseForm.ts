import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface StudentCourseFormData {
  studentId: string;
  courseCode: string;
  grade: string;
  semester: 'A' | 'B' | 'C';
  year: string;
  retaken: number;
}

type AnyRecord = Record<string, any>;
type StudentOption = { id: string; fullName: string };

const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

export const useStudentCourseForm = () => {
  const { index } = useParams<{ index?: string }>();
  const navigate = useNavigate();
  const isEdit = index !== undefined;

  const [data, setData] = useState<StudentCourseFormData>({
    studentId: '',
    courseCode: '',
    grade: '',
    semester: 'A',
    year: new Date().getFullYear().toString(),
    retaken: 1,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StudentCourseFormData, string>>>({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [snackSeverity, setSnackSeverity] =
    useState<'success' | 'error' | 'info' | 'warning'>('success');

  const [existingStudentOptions, setExistingStudentOptions] = useState<StudentOption[]>([]);
  const [existingCourseCodes, setExistingCourseCodes] = useState<string[]>([]);

  // --- load options
  useEffect(() => {
    const students: AnyRecord[] = JSON.parse(localStorage.getItem('students') || '[]');
    const courses: AnyRecord[] = JSON.parse(localStorage.getItem('courses') || '[]');
    const studentCourses: AnyRecord[] = JSON.parse(localStorage.getItem('studentCourses') || '[]');

    const studentOptions: StudentOption[] = students
      .map((s) => {
        const id = String(s.id ?? '').trim();
        const rawName = (s.fullName ?? s.name ?? s.displayName ?? '').toString().trim();
        const lower = rawName.toLowerCase();
        const validName = rawName.length > 0 && lower !== 'undefined' && lower !== 'null';
        return { id, fullName: validName ? rawName : '' };
      })
      .filter((o) => /^\d{9}$/.test(o.id) && o.fullName.length > 0)
      .sort((a, b) => a.id.localeCompare(b.id));

    setExistingStudentOptions(studentOptions);

    const codesFromCourses = courses.map((c) => c.courseCode);
    const codesFromStudentCourses = studentCourses.map((sc) => sc.courseCode);
    setExistingCourseCodes(uniq([...codesFromCourses, ...codesFromStudentCourses]).sort());
  }, []);

  // --- edit prefill
  useEffect(() => {
    if (isEdit && index !== undefined) {
      const records: any[] = JSON.parse(localStorage.getItem('studentCourses') || '[]');
      const idx = parseInt(index, 10);
      const record = records[idx];
      if (record) {
        const retakenCount =
          typeof record.retaken === 'number'
            ? Math.max(1, Math.floor(record.retaken))
            : record.retaken
            ? 2
            : 1;

        setData({
          studentId: record.studentId ?? '',
          courseCode: record.courseCode ?? '',
          grade: (record.grade ?? '').toString(),
          semester: record.semester ?? 'A',
          year: (record.year ?? new Date().getFullYear()).toString(),
          retaken: retakenCount,
        });
      }
    }
  }, [index, isEdit]);

  // --- validation
  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!/^\d{9}$/.test(data.studentId)) newErrors.studentId = 'Student ID must be exactly 9 digits';
    if (!data.courseCode.trim()) newErrors.courseCode = 'Course code is required';
    if (!/^\d+(?:\.\d+)?$/.test(data.grade) || Number(data.grade) < 0 || Number(data.grade) > 100) {
      newErrors.grade = 'Grade must be a number between 0 and 100';
    }
    if (!/^[ABC]$/.test(data.semester)) newErrors.semester = 'Select a valid semester (A, B, or C)';
    if (!/^\d{4}$/.test(data.year) || Number(data.year) < 1960) {
      newErrors.year = 'Enter a valid 4-digit year (>= 1960)';
    }
    if (!Number.isInteger(data.retaken) || data.retaken < 1) {
      newErrors.retaken = 'Attempts must be an integer ≥ 1';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof StudentCourseFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setData((prev) => ({ ...prev, [field]: value as any }));
  };

  const decAttempts = () =>
    setData((prev) => ({ ...prev, retaken: Math.max(1, (prev.retaken ?? 1) - 1) }));
  const incAttempts = () =>
    setData((prev) => ({ ...prev, retaken: Math.max(1, (prev.retaken ?? 1) + 1) }));

  const upsertStudentGrade = (studentId: string, courseCode: string, grade: number) => {
    const students: AnyRecord[] = JSON.parse(localStorage.getItem('students') || '[]');
    const idx = students.findIndex((s) => s.id === studentId);
    if (idx === -1) return;
    const s = students[idx];
    const sheet =
      s.gradeSheet && typeof s.gradeSheet === 'object' && !Array.isArray(s.gradeSheet)
        ? { ...s.gradeSheet }
        : {};
    sheet[courseCode] = grade;
    students[idx] = { ...s, gradeSheet: sheet };
    localStorage.setItem('students', JSON.stringify(students));
  };

  const handleSubmit = () => {
    if (!validate()) {
      setSnackMsg('Please fix the form errors');
      setSnackSeverity('error');
      setSnackOpen(true);
      return;
    }

    const trimmedCourse = data.courseCode.trim();
    const records: AnyRecord[] = JSON.parse(localStorage.getItem('studentCourses') || '[]');

    // --- EDIT MODE: update specific index, preserve original studentId (same approach as StudentForm)
    if (isEdit && index !== undefined) {
      const idx = parseInt(index, 10);
      const prev = records[idx];
      if (prev) {
        const originalStudentId = prev.studentId;
        const updated = {
          ...prev,
          courseCode: trimmedCourse,
          grade: Number(data.grade),
          semester: data.semester,
          year: Number(data.year),
          retaken: Math.max(1, data.retaken ?? 1),
          updatedAt: new Date().toISOString(),
          studentId: originalStudentId, // lock student id logically
        };

        records[idx] = updated;
        localStorage.setItem('studentCourses', JSON.stringify(records));
        upsertStudentGrade(originalStudentId, trimmedCourse, Number(data.grade));

        setSnackMsg('Record updated');
        setSnackSeverity('success');
        setSnackOpen(true);

        setTimeout(() => navigate('/student-courses'), 2500);
        return;
      }
    }

    // --- CREATE MODE (unchanged)
    const matchIdx = records.findIndex(
      (r) => r.studentId === data.studentId && r.courseCode === trimmedCourse
    );

    if (matchIdx !== -1) {
      const existing = records[matchIdx];
      const existingAttempts =
        typeof existing.retaken === 'number' ? existing.retaken : existing.retaken ? 2 : 1;

      const updated = {
        ...existing,
        grade: Number(data.grade),
        semester: data.semester,
        year: Number(data.year),
        retaken: Math.max(1, existingAttempts + 1),
        updatedAt: new Date().toISOString(),
      };

      records[matchIdx] = updated;
      localStorage.setItem('studentCourses', JSON.stringify(records));
      upsertStudentGrade(data.studentId, trimmedCourse, Number(data.grade));

      setSnackMsg('Existing record found — attempts incremented by 1');
      setSnackSeverity('success');
      setSnackOpen(true);
    } else {
      const entry = {
        studentId: data.studentId,
        courseCode: trimmedCourse,
        grade: Number(data.grade),
        semester: data.semester,
        year: Number(data.year),
        retaken: data.retaken,
        createdAt: new Date().toISOString(),
      };

      const updated = [...records, entry];
      localStorage.setItem('studentCourses', JSON.stringify(updated));
      upsertStudentGrade(data.studentId, trimmedCourse, Number(data.grade));

      setSnackMsg('Record saved successfully');
      setSnackSeverity('success');
      setSnackOpen(true);
    }

    setTimeout(() => navigate('/student-courses'), 2500);
  };

  return {
    data, setData,
    errors,
    snackOpen, setSnackOpen,
    snackMsg, snackSeverity,
    existingStudentOptions, existingCourseCodes,
    isEdit,
    handleChange, decAttempts, incAttempts,
    handleSubmit,
  };
};