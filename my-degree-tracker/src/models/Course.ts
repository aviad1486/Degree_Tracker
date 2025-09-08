export interface Course {
  courseCode: string;                    // unique course code
  courseName: string;                    // descriptive course name
  credits: number;                       // credit value >= 1
  semester: 'A' | 'B' | 'C';             // semester offered
  assignments: string[];                 // associated assignment IDs
  createdAt: string;                     // ISO timestamp of creation
}
