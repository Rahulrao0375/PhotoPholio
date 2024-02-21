//import { initializeApp } from "firebase/app";
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration



const firebaseConfig = {
  apiKey: "AIzaSyDqSiETTzehiMoj9z3Sz123RvUXpze003A",
  authDomain: "blogging-app-b6f08.firebaseapp.com",
  projectId: "blogging-app-b6f08",
  storageBucket: "blogging-app-b6f08.appspot.com",
  messagingSenderId: "793653811116",
  appId: "1:793653811116:web:71812710158c912e230c09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);