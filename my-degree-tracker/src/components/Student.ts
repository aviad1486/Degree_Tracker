export interface Student {
  id: string;
  fullName: string;
  email: string;
  courses: string[];         // array of course codes
  assignments: string[];     // array of assignment IDs
  gradeSheet: Record<string, number>;
  program: string;
  semester: 'A' | 'B' | 'C';
  completedCredits: number;
  createdAt: string;         // ISO timestamp
}
