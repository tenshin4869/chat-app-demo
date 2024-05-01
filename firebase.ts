//firebaseのセットアップ

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnPnAyLZEJW4W-XvbYbZAiG82pFHXx8HU",
  authDomain: "chat-app-demo-423e0.firebaseapp.com",
  projectId: "chat-app-demo-423e0",
  storageBucket: "chat-app-demo-423e0.appspot.com",
  messagingSenderId: "257536354629",
  appId: "1:257536354629:web:ab5ec0c7cd1be66a67f62c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
