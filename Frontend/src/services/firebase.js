import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAec7yF8ZaMYZfp77dw1ylqrR-3M2VOmb8",
  authDomain: "skecthsync.firebaseapp.com",
  projectId: "skecthsync",
  storageBucket: "skecthsync.firebasestorage.app",
  messagingSenderId: "388100601757",
  appId: "1:388100601757:web:d7863d8dc6727d1fffa174",
  measurementId: "G-D9MRH75MBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)