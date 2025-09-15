// src/models/seed.ts
import type { Student } from "../models/Student";
import type { Course } from "../models/Course";
import type { StudentCourse } from "../models/StudentCourse";
import type { Program } from "../models/Program";

import { firestore, auth } from "../firestore/config"; // Import auth
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import client-side function

const SEED_VERSION = "v1";
const COURSE_CODES = Array.from({ length: 10 }, (_, i) => `CS10${i + 1}`);

function makeCourses(): Course[] {
  const semesters: Array<Course["semester"]> = ["A", "B", "C"];
  return COURSE_CODES.map((code, i) => ({
    courseCode: code,
    courseName: `Intro Topic ${i + 1}`,
    credits: (i % 3) + 2,
    semester: semesters[i % semesters.length],
    assignments: [`A${i + 1}`, `B${i + 1}`],
    createdAt: new Date().toISOString(),
  }));
}

function makeStudents(): (Student & { role: "admin" | "student" })[] {
  const semesters: Array<Student["semester"]> = ["A", "B", "C"];
  return Array.from({ length: 10 }, (_, i) => {
    const id = `10000000${i}`;
    const courses = COURSE_CODES.slice(0, 3 + (i % 3));
    const gradeSheet = Object.fromEntries(
      courses.map((c, idx) => {
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
      completedCredits: (i % 8) * 5,
      createdAt: new Date().toISOString(),
      role: i === 0 ? "admin" : "student", // First student is admin
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

// פונקציה שמכניסה נתונים ל־Firestore אם הקולקציה ריקה
async function seedCollection<T>(
  colName: string,
  factory: () => T[],
  idField: keyof T
): Promise<void> {
  const snap = await getDocs(collection(firestore, colName));
  if (snap.empty) {
    const items = factory();
    for (const item of items) {
      try {
        const id = String(item[idField]);
        // 1. Save document to Firestore
        await setDoc(doc(firestore, colName, id), item as any);

        // 2. If it's a student, create an Auth user
        if (colName === "students" && "email" in item && "id" in item) {
          const student = item as Student;
          await createUserWithEmailAndPassword(auth, student.email, student.id);
          console.log(`✅ Auth user created for ${student.email}`);
        }
      } catch (error: any) {
        console.error(`❌ Failed to seed item in ${colName}:`, error.message);
      }
    }
  }
}

// פונקציית bootstrap – רק Firestore
export async function bootstrapFirestore(force = false): Promise<void> {
  const snap = await getDocs(collection(firestore, "__meta"));
  const metaDoc = snap.docs.find((d) => d.id === "seed_version");
  const currentVer = metaDoc?.data()?.value;

  if (!force && currentVer === SEED_VERSION) return;

  await seedCollection<Student & { role: string }>("students", makeStudents, "id");
  await seedCollection<Course>("courses", makeCourses, "courseCode");
  await seedCollection<StudentCourse>("studentCourses", makeStudentCourses, "courseCode");
  await seedCollection<Program>("programs", makePrograms, "name");

  await setDoc(doc(firestore, "__meta", "seed_version"), { value: SEED_VERSION });
}