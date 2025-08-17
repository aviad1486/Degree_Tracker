// src/models/seed.ts
import type { Student } from "../models/Student";
import type { Course } from "../models/Course";
import type { StudentCourse } from "../models/StudentCourse";
import type { Program } from "../models/Program";

const SEED_VERSION = "v1"; 

const COURSE_CODES = Array.from({ length: 10 }, (_, i) => `CS10${i + 1}`);

function makeCourses(): Course[] {
  const semesters: Array<Course["semester"]> = ["A", "B", "C"];
  return COURSE_CODES.map((code, i) => ({
    courseCode: code,
    courseName: `Intro Topic ${i + 1}`,
    credits: (i % 3) + 2, // 2–4
    semester: semesters[i % semesters.length],
    assignments: [`A${i + 1}`, `B${i + 1}`],
    createdAt: new Date().toISOString(),
  }));
}

function makeStudents(): Student[] {
  const semesters: Array<Student["semester"]> = ["A", "B", "C"];
  return Array.from({ length: 10 }, (_, i) => {
    const id = `10000000${i}`; 
    const courses = COURSE_CODES.slice(0, 3 + (i % 3)); 
    const gradeSheet = Object.fromEntries(
      courses.map((c, idx) => {
        // grades: 60-100
        const grade = 60 + ((i * 7 + idx * 13) % 41);
        return [c, grade];
      })
    );
    return {
      id,
      fullName: `Student ${i + 1}`,
      email: `student${i + 1}@example.com`,
      courses,
      assignments: [`HW${i + 1}`, `PRJ${i + 1}`],
      gradeSheet,
      program: `Program ${((i % 10) + 1)}`,
      semester: semesters[i % semesters.length],
      completedCredits: (i % 8) * 5, // 0,5,10...
      createdAt: new Date().toISOString(),
    };
  });
}

function makeStudentCourses(): StudentCourse[] {
  return Array.from({ length: 10 }, (_, i) => ({
    studentId: `10000000${i}`,
    courseCode: COURSE_CODES[(i + 2) % COURSE_CODES.length],
    grade: 60 + ((i * 11) % 41),
    semester: (["A", "B", "C"] as const)[i % 3],
    year: 2021 + (i % 4),
    retaken: false,
    createdAt: new Date().toISOString(),
  }));
}

function makePrograms(): Program[] {
  return Array.from({ length: 10 }, (_, i) => ({
    name: `Program ${i + 1}`,
    totalCreditsRequired: 120,
    courses: COURSE_CODES.slice(0, 5 + (i % 3)), 
    createdAt: new Date().toISOString(),
  }));
}

function seedKey<T>(key: string, factory: () => T[]): void {
  try {
    const raw = localStorage.getItem(key);
    const withData = raw && JSON.parse(raw);
    if (!Array.isArray(withData) || withData.length === 0) {
      localStorage.setItem(key, JSON.stringify(factory()));
    }
  } catch {
    localStorage.setItem(key, JSON.stringify(factory()));
  }
}

export function bootstrapLocalStorage(force = false): void {
  const seededVer = localStorage.getItem("__seed_version");
  if (!force && seededVer === SEED_VERSION) return;

  seedKey<Student>("students", makeStudents);
  seedKey<Course>("courses", makeCourses);
  seedKey<StudentCourse>("studentCourses", makeStudentCourses);
  seedKey<Program>("programs", makePrograms);

  localStorage.setItem("__seed_version", SEED_VERSION);
}
