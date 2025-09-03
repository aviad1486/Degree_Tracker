import { addDoc,  collection } from "firebase/firestore";
import type { Student } from "../models/Student";
import { firestore } from "./config";


export async function addStudent(student : Student) {
    await addDoc(collection(firestore, "students"), student);
}