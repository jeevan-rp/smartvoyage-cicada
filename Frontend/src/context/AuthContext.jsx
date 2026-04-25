import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          localStorage.setItem('token', idToken);
          
          // Try to get profile from backend
          try {
            const response = await authService.getProfile();
            setUser(response.data);
          } catch (profileError) {
            console.warn("Backend profile not found, trying to sync/register...");
            // If getProfile fails, it might be a new user from a redirect
            // We can try to call googleLogin to ensure they are registered in the backend
            const loginResponse = await authService.googleLogin(idToken);
            setUser(loginResponse.data.user);
          }
        } catch (error) {
          console.error("Auth sync error:", error);
          // Don't log them out immediately, maybe backend is just slow
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const { idToken } = await signInWithGoogle();
      localStorage.setItem('token', idToken);
      const response = await authService.googleLogin(idToken);
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
