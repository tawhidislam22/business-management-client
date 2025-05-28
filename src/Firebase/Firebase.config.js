
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Validate environment variables
if (!import.meta.env.VITE_apiKey || !import.meta.env.VITE_authDomain) {
  throw new Error('Firebase configuration is missing. Please check your .env file.');
}

const firebaseConfig = {
  apiKey: "AIzaSyB9lyIRU_ySwl3fmVjBJan1ZZB56HYpF2w",
  authDomain: "coffee-store-client-f2742.firebaseapp.com",
  projectId: "coffee-store-client-f2742",
  storageBucket: "coffee-store-client-f2742.firebasestorage.app",
  messagingSenderId: "38198709231",
  appId: "1:38198709231:web:4a310a75ccd2a069f7841a"
};

 const app = initializeApp(firebaseConfig);
  const auth=getAuth(app)
  export { app, auth };