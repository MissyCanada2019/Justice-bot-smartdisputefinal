// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCg2ZAL_nPz1TOIzQY8DOLID_zd7vpMHLg",
  authDomain: "justicebotai.firebaseapp.com",
  databaseURL: "https://justicebotai-default-rtdb.firebaseio.com",
  projectId: "justicebotai",
  storageBucket: "justicebotai.firebasestorage.app",
  messagingSenderId: "259991262013",
  appId: "1:259991262013:web:76252ba14ec2f093676b54",
  measurementId: "G-TER916JV2K"
};

// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
