// src/models/seed.ts
import type { Student } from "../models/Student";


const SEED_VERSION = "v1"; 

const COURSE_CODES = Array.from({ length: 10 }, (_, i) => `CS10${i + 1}`);

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

  localStorage.setItem("__seed_version", SEED_VERSION);
}
