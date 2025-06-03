// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD6WipoFU0iiC-I9CmgUExAXOVAOvXM0sw",
  authDomain: "react-business-3b68b.firebaseapp.com",
  projectId: "react-business-3b68b",
  storageBucket: "react-business-3b68b.firebasestorage.app",
  messagingSenderId: "191196309579",
  appId: "1:191196309579:web:21bcf30346002d39f485ce",
  measurementId: "G-KW240D8515"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 export const authentication =getAuth(app);
 export const db=getFirestore(app)

