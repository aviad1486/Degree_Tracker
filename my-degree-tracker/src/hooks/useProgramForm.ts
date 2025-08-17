import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface ProgramFormData {
  name: string;
  totalCreditsRequired: string;
  courses: string;
}

type AnyRec = Record<string, any>;
const norm = (s: string) => (s || '').trim().toLowerCase();

export const useProgramForm = () => {
  const { name } = useParams<{ name?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(name);

  const [data, setData] = useState<ProgramFormData>({
    name: '',
    totalCreditsRequired: '0',
    courses: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProgramFormData, string>>>({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [snackSeverity, setSnackSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  useEffect(() => {
    if (isEdit && name) {
      const programs: AnyRec[] = JSON.parse(localStorage.getItem('programs') || '[]');
      const decoded = decodeURIComponent(name);
      const program = programs.find(p => p.name === decoded);
      if (program) {
        setData({
          name: program.name,
          totalCreditsRequired: program.totalCreditsRequired.toString(),
          courses: program.courses.join(', '),
        });
      }
    }
  }, [name, isEdit]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!data.name.trim()) newErrors.name = 'Program name is required';
    if (!/^\d+$/.test(data.totalCreditsRequired) || parseInt(data.totalCreditsRequired, 10) < 0) {
      newErrors.totalCreditsRequired = 'Total credits must be a non-negative integer';
    }
    if (data.courses.split(',').map(s => s.trim()).filter(Boolean).length === 0) {
      newErrors.courses = 'Enter at least one course code';
    }

    // Unique by name (case-insensitive)
    const all: AnyRec[] = JSON.parse(localStorage.getItem('programs') || '[]');
    const nm = norm(data.name);
    const clash = all.some(p =>
      norm(p.name) === nm && (!isEdit || p.name !== name)
    );
    if (clash) newErrors.name = 'Program name already exists';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ProgramFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!validate()) {
      setSnackMsg('Please fix the form errors');
      setSnackSeverity('error');
      setSnackOpen(true);
      return;
    }
    const entry = {
      name: data.name.trim(),
      totalCreditsRequired: parseInt(data.totalCreditsRequired, 10),
      courses: data.courses.split(',').map(s => s.trim()),
      createdAt: new Date().toISOString(),
    };
    const programs: AnyRec[] = JSON.parse(localStorage.getItem('programs') || '[]');
    const updated = isEdit
      ? programs.map(p => (p.name === (name as string) ? entry : p))
      : [...programs, entry];
    localStorage.setItem('programs', JSON.stringify(updated));
    setSnackMsg(isEdit ? 'Program updated successfully' : 'Program added successfully');
    setSnackSeverity('success');
    setSnackOpen(true);
    setTimeout(() => navigate('/programs'), 2500);
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
