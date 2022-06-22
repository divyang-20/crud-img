import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCD9vWzJxsKCfB9L2Kw_-f2wWPyPFjdGRE",
  authDomain: "crud-im.firebaseapp.com",
  projectId: "crud-im",
  storageBucket: "crud-im.appspot.com",
  messagingSenderId: "970058026778",
  appId: "1:970058026778:web:ff89a52a1dd260769d26a3",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
