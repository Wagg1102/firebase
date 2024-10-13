import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD6C7H50L-Pe9JiJoD0QNdCoM6fxjKzoRE",
  authDomain: "test-2-d7f20.firebaseapp.com",
  projectId: "test-2-d7f20",
  storageBucket: "test-2-d7f20.appspot.com",
  messagingSenderId: "829837963079",
  appId: "1:829837963079:web:d01cd671c91ec13b106662",
  measurementId: "G-N9980D7ZM9"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
