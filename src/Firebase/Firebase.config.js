
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Validate environment variables
if (!import.meta.env.VITE_apiKey || !import.meta.env.VITE_authDomain) {
  throw new Error('Firebase configuration is missing. Please check your .env file.');
}

const firebaseConfig = {
  apiKey: "AIzaSyBATIRLgRG1sD8VwrifGmO9R6cPcwU0SWg",
  authDomain: "business-management-f433c.firebaseapp.com",
  projectId: "business-management-f433c",
  storageBucket: "business-management-f433c.firebasestorage.app",
  messagingSenderId: "444044426536",
  appId: "1:444044426536:web:379c4e42f1be6668e2e41d"
};

 const app = initializeApp(firebaseConfig);
  const auth=getAuth(app)
  export { app, auth };