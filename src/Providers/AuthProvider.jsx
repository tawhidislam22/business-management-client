import { createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase.config';

import useAxiosPublic from '../hooks/useAxiosPublic';

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo
    });
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // Call server to clear cookie
      await axiosPublic.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Send user email to get JWT token stored in cookie
          await axiosPublic.post('/jwt', {
            email: currentUser.email
          });
        } catch (error) {
          console.error('Token generation error:', error);
        }
      } else {
        // Clear token cookie when user logs out
        try {
          await axiosPublic.post('/logout');
        } catch (error) {
          console.error('Logout error:', error);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    updateUserProfile,
    logout
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
