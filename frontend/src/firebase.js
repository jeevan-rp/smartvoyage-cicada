import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// Replace these with actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCc5bdpOo_slo-9zkSgR33L1wovIFo98h0",
  authDomain: "smart-voyage-cicada.firebaseapp.com",
  projectId: "smart-voyage-cicada",
  storageBucket: "smart-voyage-cicada.firebasestorage.app",
  messagingSenderId: "320646441767",
  appId: "1:320646441767:web:1c5b8bd2f6fc7cff051702",
  measurementId: "G-NXZTVSSHD8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
