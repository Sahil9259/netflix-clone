
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyBEEMtHShKn5i-C_KP0_tg8IbqM5E4Zns0",
  authDomain: "react-netflix-account.firebaseapp.com",
  projectId: "react-netflix-account",
  storageBucket: "react-netflix-account.appspot.com",
  messagingSenderId: "1076498460784",
  appId: "1:1076498460784:web:fdd04b14ea8ab1ce0fc4b5",
  measurementId: "G-W4L8X2ENFG"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);