import { useEffect, useState, createContext, useMemo } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPublic = useAxiosPublic();

  const createUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created successfully:", userCredential.user);
    } catch (error) {
      console.error("Error creating user:", error.message);
      setError("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully:", userCredential.user);
    } catch (error) {
      console.error("Error signing in:", error.message);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error.message);
      setError("Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User signed in with Google successfully:", result.user);

      const userInfo = {
        email: result.user.email,
        name: result.user.displayName,
        photo: result.user.photoURL,
      };
      await axiosPublic.post("/users", userInfo);
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (name, photo) => {
    if (!auth.currentUser) return Promise.reject("No user is signed in.");
    setLoading(true);
    setError(null);
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      console.log("User profile updated successfully.");

      const userInfo = {
        email: auth.currentUser.email,
        name: name,
        photo: photo,
      };
      await axiosPublic.put("/users", userInfo);
    } catch (error) {
      console.error("Error updating user profile:", error.message);
      setError("Failed to update user profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userInfo = { email: currentUser.email };
        try {
          const res = await axiosPublic.post("/jwt", userInfo);
          if (res.data?.token) {
            localStorage.setItem("access-token", res.data.token);
          } else {
            console.warn("No token received from server.");
          }
        } catch (err) {
          console.error("Error fetching JWT:", err.message);
          localStorage.removeItem("access-token");
        } finally {
          setLoading(false);
        }
      } else {
        localStorage.removeItem("access-token");
        setLoading(false);
      }
    });

    return () => unSubscribe();
  }, [axiosPublic]);

  const info = useMemo(
    () => ({
      user,
      loading,
      error,
      createUser,
      signIn,
      logOut,
      googleSignIn,
      updateUserProfile,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={info}>{children}</AuthContext.Provider>;
};

export default AuthProvider;