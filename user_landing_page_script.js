import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIdvoYCGYNV1_rG9JdNtz_Q1iA66k9I6o",
  authDomain: "strategy4schoolsdb.firebaseapp.com",
  projectId: "strategy4schoolsdb",
  storageBucket: "strategy4schoolsdb.appspot.com",
  messagingSenderId: "125952142437",
  appId: "1:125952142437:web:11d221ac797be1c3e0ea8c"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Listen for changes in the user's authentication state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    // Attempt to fetch the user's username from Firestore
    const userRef = doc(db, "users", user.uid); // Assuming your users are stored in a collection named "users"
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const username = docSnap.data().username; // Assuming the username field is named 'username'
      // Display the username
      const userNameDisplayElement = document.querySelector('.name');
      if (userNameDisplayElement) {
        userNameDisplayElement.textContent = username;
      }
    } else {
      console.log("No such document!");
      // Handle cases where the user document might not exist or the username might be missing
    }
  } else {
    // No user is signed in, redirect them to the login page
    window.location.href = 'login.html';
  }
});