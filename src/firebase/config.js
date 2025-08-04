import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAV2AJOQNzFvRFTUcEroIHM75W-Pzb4uaM",
  authDomain: "jutrade-app.firebaseapp.com",
  projectId: "jutrade-app",
  storageBucket: "jutrade-app.appspot.com",
  messagingSenderId: "371407940306",
  appId: "1:371407940306:web:cba28f031d8faf5d869b0b",
  measurementId: "G-EVMLGJZBRJ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
