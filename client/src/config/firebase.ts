// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "test-f9878.firebaseapp.com",
  databaseURL: "https://test-f9878-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-f9878",
  storageBucket: "test-f9878.appspot.com",
  messagingSenderId: "366181469641",
  appId: "1:366181469641:web:ad80a1042f2bf6c4422c18",
  measurementId: "G-1DD3ZXGGE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
