export interface Student {
  fullName: string;
  id: string;
  email: string;
  courses: string[];    
  assignments: string[]; 
  gradeSheet: Record<string, number>; 
}