import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, browserSessionPersistence } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwgXB-7iHMTezuPQ2_efQxC9s54dGPbuQ",
  authDomain: "chatroom-d8254.firebaseapp.com",
  projectId: "chatroom-d8254",
  storageBucket: "chatroom-d8254.appspot.com",
  messagingSenderId: "113982424271",
  appId: "1:113982424271:web:1a1377f6058e94fcba23ba",
  measurementId: "G-LVG5XZ0YB3",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
auth.setPersistence(browserSessionPersistence);
const db = getFirestore();
const storage = getStorage();
export { db, firebaseApp, auth, storage };
