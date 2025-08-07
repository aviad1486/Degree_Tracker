import React from 'react';
import type { Student } from "../components/Student";

const students: Student[] = [
  {
    id: '123456789',
    fullName: 'אביעד זר',
    email: 'aviad@example.com',
    courses: ['מבני נתונים', 'מערכות הפעלה'],
    assignments: ['פרויקט גמר', 'תרגיל 1'],
    gradeSheet: {
      'מבני נתונים': 95,
      'מערכות הפעלה': 88
    }
  },
  {
    id: '987654321',
    fullName: 'נועם כהן',
    email: 'noam@example.com',
    courses: ['מבוא למדמח', 'מתמטיקה בדידה'],
    assignments: ['עבודה 1', 'עבודה 2'],
    gradeSheet: {
      'מבוא למדמח': 100,
      'מתמטיקה בדידה': 90
    }
  }
];


const StudentTable = () => {
  return (
    <div>
      <h2>רשימת סטודנטים</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>שם מלא</th>
            <th>ת"ז</th>
            <th>מייל</th>
            <th>קורסים</th>
            <th>מטלות</th>
            <th>גיליון ציונים</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.fullName}</td>
              <td>{student.id}</td>
              <td>{student.email}</td>
              <td>{student.courses.join(', ')}</td>
              <td>{student.assignments.join(', ')}</td>
              <td>
                {Object.entries(student.gradeSheet).map(
                  ([course, grade]) => (
                    <div key={course}>
                      {course}: {grade}
                    </div>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;