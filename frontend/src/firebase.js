import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "task-manager-benson.firebaseapp.com",
  projectId: "task-manager-benson",
  storageBucket: "task-manager-benson.firebasestorage.app",
  messagingSenderId: "527698378865",
  appId: "1:527698378865:web:16a73f981f6b5aa7b1dbd0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);