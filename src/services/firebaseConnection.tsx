import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChjPmH-ceGNjFmgbRUyFXExJiryiX56B4",
  authDomain: "echocrm-c5696.firebaseapp.com",
  projectId: "echocrm-c5696",
  storageBucket: "echocrm-c5696.appspot.com",
  messagingSenderId: "970791041329",
  appId: "1:970791041329:web:7540b1b079e2b3513ed810",
  measurementId: "G-X32FRGZ51Z",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };
