import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBxKzAtSJsm0dJ0ZNy2HGEb1o_0PDCfmQE",
  authDomain: "ubon-project-689ac.firebaseapp.com",
  projectId: "ubon-project-689ac",
  storageBucket: "ubon-project-689ac.appspot.com",
  messagingSenderId: "825283169367",
  appId: "1:825283169367:web:8555e6dad3e1ec61e0a712",
  measurementId: "G-MWFMCD5LFR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db ;


