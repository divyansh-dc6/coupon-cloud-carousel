// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjrmyrN4P3gE76yX31_5PeZOLYb8urzdI",
  authDomain: "coupon-cloud-carousel.firebaseapp.com",
  projectId: "coupon-cloud-carousel",
  storageBucket: "coupon-cloud-carousel.firebasestorage.app",
  messagingSenderId: "1015303929192",
  appId: "1:1015303929192:web:baa24be28e50aa0abb6add",
  measurementId: "G-4DBP59N1YK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 


export { db, auth };