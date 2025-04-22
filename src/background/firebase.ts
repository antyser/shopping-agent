import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from 'firebase/firestore'; // Add later when needed
// import { getAnalytics } from "firebase/analytics"; // Add later when needed

// TODO: Move this configuration to environment variables
const firebaseConfig = {
  apiKey: "AIzaSyARclFxYWLZ7TU3N4oPsc8d3JG5w12P5Uk",
  authDomain: "shopping-agent-d0446.firebaseapp.com",
  projectId: "shopping-agent-d0446",
  storageBucket: "shopping-agent-d0446.appspot.com", // Corrected property name
  messagingSenderId: "921094659766",
  appId: "1:921094659766:web:595d3b6e742935a19e5017",
  measurementId: "G-GQVE04DJMZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
// export const db = getFirestore(app); // Uncomment when Firestore is needed
// export const analytics = getAnalytics(app); // Uncomment when Analytics is needed

console.log("Firebase initialized and Auth exported.");
