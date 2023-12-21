// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "final-project-305b7.firebaseapp.com",
  projectId: "final-project-305b7",
  storageBucket: "final-project-305b7.appspot.com",
  messagingSenderId: "667563966800",
  appId: "1:667563966800:web:ecff6b0f87576e95a5ec55",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
