// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsBIIxg0M13_abZsfrs-Arvb7KsvVZdpE",
  authDomain: "habit-heatmap.firebaseapp.com",
  projectId: "habit-heatmap",
  storageBucket: "habit-heatmap.appspot.com",
  messagingSenderId: "932472350116",
  appId: "1:932472350116:web:215a805de1603154538d31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth}


/*const firebaseConfig = {
  apiKey: "AIzaSyBsBIIxg0M13_abZsfrs-Arvb7KsvVZdpE",
  authDomain: "habit-heatmap.firebaseapp.com",
  projectId: "habit-heatmap",
  storageBucket: "habit-heatmap.appspot.com",
  messagingSenderId: "932472350116",
  appId: "1:932472350116:web:215a805de1603154538d31"
}; */