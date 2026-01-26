// /firebase/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBadgX-HeL2Wzzfi9gNqHfdukHUv3WKzwY",
  authDomain: "acadify-84e11.firebaseapp.com",
  projectId: "acadify-84e11",
  storageBucket: "acadify-84e11.firebasestorage.app",
  messagingSenderId: "536785071444",
  appId: "1:536785071444:web:51250807cd76a8f4bfecc1"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

const db = getFirestore(app);
export const storage = getStorage(app); // 👈 ADD THIS LINE

export { auth, db };