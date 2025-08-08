// StudyProgram entity interface
export interface StudyProgram {
  name: string;                          // unique program name
  totalCreditsRequired: number;          // required credit threshold
  courses: string[];                     // list of course codes in program
  createdAt: string;                     // ISO timestamp of creation
}
