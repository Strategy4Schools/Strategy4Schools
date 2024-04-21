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

// Guard the page by listening for changes in the user's authentication state
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // No user is signed in. Redirect them to the login page
    window.location.href = 'login.html'; // Change 'login.html' to the path of your login page
  } else {
    // User is signed in, proceed with additional functionality
    const userRef = doc(db, "users", user.uid); // Path to the user document
    getDoc(userRef).then((docSnap) => {
      if (docSnap.exists()) {
        const username = docSnap.data().username; // Adjust 'username' based on your actual data structure
        // Update the username in the dropdown
        document.querySelector('.dropdown-username').textContent = username;
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
    const allFeaturedGames = [
        [
            { name: "Anagrammable", url: "anagrammable.html", img: "anagrammable_thumbnail_url" },
            { name: "WordGuess", url: "WordGuess.html", img: "wordguess_thumbnail_url" },
            { name: "Flashcards", url: "flashcardscategories.html", img: "flashcards_thumbnail_url" }
        ],
        [
            { name: "Game 4", url: "game4.html", img: "game4_thumbnail_url" },
            { name: "Game 5", url: "game5.html", img: "game5_thumbnail_url" },
            { name: "Game 6", url: "game6.html", img: "game6_thumbnail_url" }
        ]
        // ... Add more sets as needed
    ];

    let currentSetIndex = 0;
    const featuredGamesContainer = document.querySelector('.featuredgames-container');
    const maskWidth = document.querySelector('.featured-games-mask').offsetWidth;


 function updateArrowVisibility() {
        const leftArrow = document.getElementById('left-arrow');
        const rightArrow = document.getElementById('right-arrow');

        // Hide left arrow if the first set is displayed
        if (currentSetIndex === 0) {
            leftArrow.style.display = 'none';
        } else {
            leftArrow.style.display = 'block';
        }

        // Hide right arrow if the last set is displayed
        if (currentSetIndex === allFeaturedGames.length - 1) {
            rightArrow.style.display = 'none';
        } else {
            rightArrow.style.display = 'block';
        }
    }

    // Function to slide featured games to the left or right
    function slideFeaturedGames(direction) {
        const maskWidth = document.querySelector('.featured-games-mask').offsetWidth;

        if (direction === 'left' && currentSetIndex > 0) {
            currentSetIndex--;
        } else if (direction === 'right' && currentSetIndex < allFeaturedGames.length - 1) {
            currentSetIndex++;
        }

        const newTransformValue = -(currentSetIndex * maskWidth);
        featuredGamesContainer.style.transform = `translateX(${newTransformValue}px)`;

        featuredGamesContainer.addEventListener('transitionend', function() {
            updateArrowVisibility();
        }, { once: true });
    }

    // Initial setup
    updateArrowVisibility();

    // Attach event listeners to arrow buttons
    document.getElementById('left-arrow').addEventListener('click', function() {
        slideFeaturedGames('left');
    });

    document.getElementById('right-arrow').addEventListener('click', function() {
        slideFeaturedGames('right');
    });
});



document.addEventListener('scroll', function() {
  var featuredGamesTitle = document.querySelector('#featured-games h2');
  var featuredGamesContainer = document.querySelector('.featured-games-mask');

  var titlePosition = featuredGamesTitle.getBoundingClientRect().top;
  var containerPosition = featuredGamesContainer.getBoundingClientRect().top;
  var screenPosition = window.innerHeight / 1.3;

  if (titlePosition < screenPosition && containerPosition < screenPosition) {
    featuredGamesTitle.style.opacity = '1'; // Trigger the animation
    featuredGamesContainer.style.opacity = '1'; // Trigger the animation
  }
});


function toggleNavMenu() {
    var navMenu = document.getElementById("navMenuDropdown");
    var menuButtonIcon = document.getElementById("navMenuIcon");

    // Toggle the display of the sidebar
    if (navMenu.style.display === "block" || navMenu.style.display === "") {
        // Sidebar is open, so we close it and change the icon to the 'closed' icon
        navMenu.style.display = "none";
        menuButtonIcon.src = 'https://github.com/Strategy4Schools/Strategy4Schools/blob/main/hamburger%20closed%20menu%20icon.png?raw=true'; // Closed icon
    } else {
        // Sidebar is closed, so we open it and change the icon to the 'open' icon
        navMenu.style.display = "hide";
        menuButtonIcon.src = 'https://github.com/Strategy4Schools/Strategy4Schools/blob/main/hamburger%20open%20menu%20icon.png?raw=true'; // Open icon
    }
}