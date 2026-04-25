import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCc5bdpOo_slo-9zkSgR33L1wovIFo98h0",
  authDomain: "smart-voyage-cicada.firebaseapp.com",
  projectId: "smart-voyage-cicada",
  storageBucket: "smart-voyage-cicada.firebasestorage.app",
  messagingSenderId: "320646441767",
  appId: "1:320646441767:web:1c5b8bd2f6fc7cff051702",
  measurementId: "G-NXZTVSSHD8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// If signInWithPopup fails due to COOP policy, try signInWithRedirect
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return { user: result.user, idToken };
  } catch (error) {
    console.error("Error signing in with Google", error);
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      await signInWithRedirect(auth, googleProvider);
    }
    throw error;
  }
};

export { signInWithRedirect };
