import type { Student } from "../models/Student";
import type { Course } from "../models/Course";
import type { StudentCourse } from "../models/StudentCourse";
import type { Program } from "../models/Program";
import type { User } from "../models/User";

import { firestore } from "../firestore/config";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

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

function makeStudentCourses(): (StudentCourse & { id: string })[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `sc_${i}`, // Unique ID for each student course record
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
        // Save document to Firestore
        await setDoc(doc(firestore, colName, id), item as any);
        console.log(`✅ Added ${id} to ${colName}`);
      } catch (error: any) {
        console.error(`❌ Failed to seed item in ${colName}:`, error.message);
      }
    }
    console.log(`🎉 Seeded ${items.length} items in ${colName} collection`);
  } else {
    console.log(`⏭️ Collection ${colName} already has data, skipping...`);
  }
}

// פונקציית bootstrap – רק Firestore
export async function bootstrapFirestore(force = false): Promise<void> {
  console.log('🌱 Starting database seeding...');
  
  const snap = await getDocs(collection(firestore, "__meta"));
  const metaDoc = snap.docs.find((d) => d.id === "seed_version");
  const currentVer = metaDoc?.data()?.value;

  if (!force && currentVer === SEED_VERSION) {
    console.log('⏭️ Database already seeded with current version, skipping...');
    return;
  }

  console.log('📚 Seeding all collections...');
  await seedCollection<Student & { role: string }>("students", makeStudents, "id");
  await seedCollection<Course>("courses", makeCourses, "courseCode");
  await seedCollection<StudentCourse & { id: string }>("studentCourses", makeStudentCourses, "id");
  await seedCollection<Program>("programs", makePrograms, "name");

  await setDoc(doc(firestore, "__meta", "seed_version"), { value: SEED_VERSION });
  console.log('🎉 Database seeding completed successfully!');
}

/**
 * Creates an admin user in Firestore
 */
export const createInitialAdminUser = async (
  uid: string,
  email: string,
  displayName?: string
): Promise<boolean> => {
  try {
    const adminUser: User = {
      uid,
      email,
      displayName,
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userDoc = doc(firestore, 'users', uid);
    await setDoc(userDoc, adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('User details:', adminUser);
    return true;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return false;
  }
};