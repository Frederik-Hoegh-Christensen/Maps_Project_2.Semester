
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfjkABDWzuEwouTmjqCO6zz-OP4OxznaA",
  authDomain: "uxexamgrp9.firebaseapp.com",
  projectId: "uxexamgrp9",
  storageBucket: "uxexamgrp9.appspot.com",
  messagingSenderId: "215072236932",
  appId: "1:215072236932:web:2fbe671dbbce9be403a9d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export function getFirebaseConfig(){
    return firebaseConfig;
}