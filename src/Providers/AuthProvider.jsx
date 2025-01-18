import { useEffect, useState } from "react";
import { createContext } from "react";
import { auth } from "../Firebase/Firebase.config";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";

export const AuthContext=createContext(null)
const googleProvider=new GoogleAuthProvider()
const AuthProvider = ({children}) => {
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true)
    const createUser=(email,password)=>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email,password)
    }
    const signIn=(email,password)=>{
        setLoading(true);
        return signInWithEmailAndPassword(auth,email,password)
    }
    const logOut=()=>{
        setLoading(true);
        return signOut(auth)
    }
    const googleSignIn=()=>{
        setLoading(true);
        return signInWithPopup(auth,googleProvider)
    }
    const updateUserProfile=(name,photo)=>{
        if (!auth.currentUser) return Promise.reject("No user is signed in.");
        updateProfile(auth.currentUser,{
            displayName:name,photoURL:photo
        })
    }
    useEffect(()=>{
        const unSubscribe=onAuthStateChanged(auth,currentUser=>{
            setUser(currentUser);
            setLoading(false)
        })
        return ()=>{
            return unSubscribe()
        }
    },[])
    const info={
        user,
        loading,
        createUser,
        signIn,
        logOut,
        googleSignIn,
        updateUserProfile
    }
    return (
        <AuthContext.Provider value={info}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;