import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZbOfD0UmzraIeSqPoqH6cBJKN8_Yual4",
  authDomain: "my-task-manager-d0846.firebaseapp.com",
  projectId: "my-task-manager-d0846",
  storageBucket: "my-task-manager-d0846.firebasestorage.app",
  messagingSenderId: "727316550236",
  appId: "1:727316550236:web:b2b165522e1e5dcaee8c99",
  measurementId: "G-8KJR0YC6EB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);