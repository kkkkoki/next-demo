import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6ZheEcuGYldniVqL-rwziiomEhH2KJ8Q",
  authDomain: "next-demo-e72cf.firebaseapp.com",
  projectId: "next-demo-e72cf",
  storageBucket: "next-demo-e72cf.appspot.com",
  messagingSenderId: "1225390619",
  appId: "1:1225390619:web:1f7ef306db2322988c56be",
  measurementId: "G-PEVJMCGJR2"
};

if (!getApps()?.length) {
  initializeApp(firebaseConfig);
}

export const storage = getStorage();
export const auth = getAuth();
export const functions = getFunctions();
export const db = getFirestore();