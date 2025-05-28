import { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import useAxiosPublic from '../hooks/useAxiosPublic';

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  // Create user with email and password
  const createUser = async (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in with email and password
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Update user profile
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo
    });
  };

  // Sign out
  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Observer for user state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      if (currentUser) {
        // Get user role from backend
        axiosPublic.get(`/users/role/${currentUser.email}`)
          .then(res => {
            setRole(res.data.role);
          })
          .catch(error => {
            console.error('Error fetching user role:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  const authInfo = {
    user,
    role,
    loading,
    createUser,
    signIn,
    googleSignIn,
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