import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, doc, getDoc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

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
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const username = userData.username;
      const loginStreak = userData.loginStreak; // Assuming the field is correctly named

      // Display the username
      const userNameDisplayElement = document.querySelector('.name');
      if (userNameDisplayElement) {
        userNameDisplayElement.textContent = username;
      }

      // Update daily login streak display
      updateStreakDisplay(loginStreak);
      
      // Optionally check and update login streak
      checkAndUpdateStreak(userRef, userData.lastLoginDate);
    } else {
      console.log("No such document!");
    }
  } else {
    // No user is signed in
    window.location.href = 'login.html';
  }
});

// Function to update the daily login streak display
function updateStreakDisplay(streakDays) {
  const days = document.querySelectorAll('.day');
  days.forEach((day, index) => {
    if (index < streakDays) {
      day.classList.add('crossed-off');
    }
  });
}

// Function to check and update the streak if needed
async function checkAndUpdateStreak(userRef, lastLoginDate) {
  const today = new Date();
  const lastLogin = new Date(lastLoginDate);
  const diffTime = Math.abs(today - lastLogin);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  if (diffDays === 1) {
    // If last login was yesterday, increment the streak
    await updateDoc(userRef, {
      loginStreak: increment(1),
      lastLoginDate: today.toISOString() // Update the last login date
    });
  } else if (diffDays > 1) {
    // If more than one day has passed, reset the streak
    await updateDoc(userRef, {
      loginStreak: 1,
      lastLoginDate: today.toISOString()
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // Event listener for the profile picture
  const profilePic = document.querySelector('.profile-pic');
  if (profilePic) {
    profilePic.addEventListener('click', togglePopup);
  }

  // Event listener for the close button
  const closeButton = document.getElementById('closePopupButton');
  if (closeButton) {
    closeButton.addEventListener('click', togglePopup);
  }

  // Event listener for clicking outside of the popup to close it
  window.addEventListener('click', (event) => {
    const popup = document.getElementById('profilePopup');
    if (popup && event.target === popup) {
      togglePopup();
    }
  });
});

// The togglePopup function
function togglePopup() {
  const popup = document.getElementById('profilePopup');
  const popupContent = document.querySelector('.popup-content');

  // Check if popup is already displayed
  if (popup.style.display === 'none' || popup.style.display === '') {
    popup.style.display = 'block';
    popupContent.classList.add('open');
    popupContent.classList.remove('close');
  } else {
    // When hiding the popup, listen for the end of the animation
    popupContent.classList.add('close');
    popupContent.classList.remove('open');
    popupContent.addEventListener('animationend', () => {
      popup.style.display = 'none';
      popupContent.classList.remove('close'); // Clean up class after animation
    }, { once: true }); // Ensure the listener is removed after it fires
  }
}