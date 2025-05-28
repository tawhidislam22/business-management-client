// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
if (!import.meta.env.VITE_apiKey || !import.meta.env.VITE_authDomain) {
  throw new Error('Firebase configuration is missing. Please check your .env file.');
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey?.trim(),
  authDomain: import.meta.env.VITE_authDomain?.trim(),
  projectId: import.meta.env.VITE_projectId?.trim(),
  storageBucket: import.meta.env.VITE_storageBucket?.trim(),
  messagingSenderId: import.meta.env.VITE_messagingSenderId?.trim(),
  appId: import.meta.env.VITE_appId?.trim()
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)