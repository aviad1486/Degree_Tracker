export interface StudentCourse {
  studentId: string;                     // ID referencing a Student
  courseCode: string;                    // code referencing a Course
  grade: number;                         // grade between 0 and 100
  semester: 'A' | 'B' | 'C';             // semester taken
  year: number;                          // 4-digit year
  Attempts: boolean;                      // whether the course was retaken
  createdAt: string;                     // ISO timestamp of record creation
}