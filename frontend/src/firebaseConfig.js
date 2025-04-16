// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCeDAmXU_v-_-rNhC4HGv5gX2ZHJoRSpog",
    authDomain: "comp3421-25-p8.firebaseapp.com",
    projectId: "comp3421-25-p8",
    storageBucket: "comp3421-25-p8.firebasestorage.app",
    messagingSenderId: "272155961485",
    appId: "1:272155961485:web:509edb652ccf4f93845ac4",
    measurementId: "G-J6F75ZCJL6"
  };
  


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

export { db }; // Export Firestore