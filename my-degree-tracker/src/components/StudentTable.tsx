// Student.ts
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

// StudentTable.tsx
import React from 'react';
import type { Student } from '../components/Student';

const students: Student[] = [
  {
    id: '123456789',
    fullName: 'Aviad Zer',
    email: 'aviad.zer@example.com',
    courses: ['CS101', 'OS201'],
    assignments: ['FinalProject', 'Exercise1'],
    gradeSheet: {
      'CS101': 95,
      'OS201': 88
    },
    program: 'Computer Science',
    semester: 'A',
    completedCredits: 30,
    createdAt: '2025-08-07T09:00:00Z'
  },
  {
    id: '987654321',
    fullName: 'Noam Cohen',
    email: 'noam.cohen@example.com',
    courses: ['CS100', 'Math200'],
    assignments: ['Assignment1', 'Assignment2'],
    gradeSheet: {
      'CS100': 100,
      'Math200': 90
    },
    program: 'Software Engineering',
    semester: 'B',
    completedCredits: 24,
    createdAt: '2025-08-01T10:30:00Z'
  }
];

const StudentTable: React.FC = () => {
  return (
    <div>
      <h2>Student List</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>ID</th>
            <th>Email</th>
            <th>Courses</th>
            <th>Assignments</th>
            <th>Program</th>
            <th>Semester</th>
            <th>Completed Credits</th>
            <th>Grade Sheet</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.fullName}</td>
              <td>{student.id}</td>
              <td>{student.email}</td>
              <td>{student.courses.join(', ')}</td>
              <td>{student.assignments.join(', ')}</td>
              <td>{student.program}</td>
              <td>{student.semester}</td>
              <td>{student.completedCredits}</td>
              <td>
                {Object.entries(student.gradeSheet).map(([course, grade]) => (
                  <div key={course}>
                    {course}: {grade}
                  </div>
                ))}
              </td>
              <td>{new Date(student.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
