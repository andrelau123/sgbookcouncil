// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVUhl5UblUjEeYRdBfN4C2m9pZYPOtPRM",
  authDomain: "sgbookcouncil.firebaseapp.com",
  projectId: "sgbookcouncil",
  storageBucket: "sgbookcouncil.firebasestorage.app",
  messagingSenderId: "284893267364",
  appId: "1:284893267364:web:9e65edb8d3bc5ca27aad31",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

export default auth;
