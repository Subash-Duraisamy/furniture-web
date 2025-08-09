// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwypbkahQyHN_3QDq6tocz4kIwbF9ec1U",
  authDomain: "furniture-web-917db.firebaseapp.com",
  projectId: "furniture-web-917db",
  storageBucket: "furniture-web-917db.appspot.com",  // fixed here
  messagingSenderId: "826679704456",
  appId: "1:826679704456:web:bdd98f9882cabad880583d",
  measurementId: "G-1JGZE4E36Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth,db };
