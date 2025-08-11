// StudyProgram entity interface
export interface Program {
  name: string;                          // unique program name
  totalCreditsRequired: number;          // required credit threshold
  courses: string[];                     // list of course codes in program
  createdAt: string;                     // ISO timestamp of creation
}
