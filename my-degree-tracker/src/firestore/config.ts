// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFEri7AlTDFTjZZJJZ07Bwm3FW3kyYNHk",
  authDomain: "degree-tracker-fe674.firebaseapp.com",
  projectId: "degree-tracker-fe674",
  storageBucket: "degree-tracker-fe674.firebasestorage.app",
  messagingSenderId: "581428430033",
  appId: "1:581428430033:web:c1f3ea1158d8d5cc2f71f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);