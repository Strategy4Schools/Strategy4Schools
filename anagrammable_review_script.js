// Firebase Initialization (ensure these scripts are correctly imported in your HTML or JS module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIdvoYCGYNV1_rG9JdNtz_Q1iA66k9I6o",
  authDomain: "strategy4schoolsdb.firebaseapp.com",
  projectId: "strategy4schoolsdb",
  storageBucket: "strategy4schoolsdb.appspot.com",
  messagingSenderId: "125952142437",
  appId: "1:125952142437:web:11d221ac797be1c3e0ea8c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
    setupBackButton();
    loadIncorrectWordsForReview();
    document.getElementById('favoriteButton').addEventListener('click', toggleFavorite);
    document.getElementById('user-input').addEventListener('keydown', function(event) {
        if (event.key === "Enter" && document.getElementById('submitWord').style.display !== 'none') {
            event.preventDefault(); // Prevent the default action
            window.checkAnagram(); // Only call checkAnagram if we're in guessing phase
        }
    });
});

function setupBackButton() {
    const backButton = document.getElementById('backToMinigames');
    backButton.addEventListener('click', function() {
        window.location.href = 'minigames_home.html';
    });
}

function loadIncorrectWordsForReview() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            const userRef = doc(db, "users", user.uid);
            getDoc(userRef).then(docSnap => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    words = userData.incorrectWords || [];
                    if (words.length > 0) {
                        setNewWord(); // Initialize the review with the first word
                        document.querySelector('.main-content').style.display = 'flex';
                    } else {
                        console.log("No incorrect words found for review.");
                        // Optionally, display a message or handle the empty state
                    }
                } else {
                    console.log("No user document found.");
                }
            }).catch(error => {
                console.error("Error loading incorrect words:", error);
            });
        } else {
            console.log("No user is signed in.");
            // Handle the case where no user is signed in, perhaps redirect to a login page
        }
    });
}

let words = [];
let currentWord = '';
let currentDefinition = '';

function setNewWord() {
    if (words.length === 0) {
        alert("Congratulations, you've reviewed all the incorrect words!");
        window.location.href = 'minigames_home.html';
        return;

        updateFavoriteIcon(); 
    }

    document.getElementById('next-word').style.display = 'none';
    document.getElementById('user-input').disabled = false;
    document.getElementById('submitWord').style.display = '';
    document.getElementById('skipWord').style.display = '';
    document.getElementById('definition').innerText = '';
    document.getElementById('result').innerText = '';
    document.getElementById('result').style.color = '';
    document.getElementById('favoriteContainer').style.display = 'none';

    let wordIndex = Math.floor(Math.random() * words.length);
    let wordEntry = words[wordIndex];
    currentWord = wordEntry.word.toUpperCase();
    currentDefinition = wordEntry.definition;

    // Update anagram counter initially to 0/1
    updateAnagramCounter();

    document.getElementById('anagram').innerText = shuffleWord(currentWord);
    document.getElementById('user-input').value = '';
    updateFavoriteIcon(false);
}

// Make sure this script is placed after the initial setup and variable declarations
window.shuffleAnagram = function() {
    // Attempt to shuffle the currentWord
    let shuffled;
    do {
        shuffled = shuffleWord(currentWord);
    } while (shuffled === currentWord); // Ensure the new shuffle is different

    // Update the DOM with the newly shuffled word
    document.getElementById('anagram').innerText = shuffled;
};

// Ensuring shuffleWord doesn't call itself recursively to avoid infinite loops
function shuffleWord(word) {
    let arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // ES6 array destructuring for swapping
    }
    return arr.join('');
}

window.checkAnagram = function() {
    let userInput = document.getElementById('user-input').value.trim().toUpperCase();
    if (userInput === currentWord) {
        setFeedback('Correct!', '#90EE90');
        let foundIndex = words.findIndex(item => item.word.toUpperCase() === currentWord);
        if (foundIndex !== -1) {
            words[foundIndex].guessedCorrectly = true;
        }
        displayDefinition();
        toggleButtonsVisibility();
        document.getElementById('favoriteContainer').style.display = 'inline-block'; // Show if correct
        document.getElementById('user-input').disabled = true;
        document.getElementById('anagram').innerText = currentWord; // Reveal the correct word if guess is correct
        updateAnagramCounter(true);
        updateFavoriteIcon(true); // Update icon to reflect current favorite status
    } else {
        setFeedback('Try Again!', 'red');
        document.getElementById('favoriteContainer').style.display = 'none'; // Hide if incorrect
        // No update to `document.getElementById('anagram').innerText` here to avoid revealing the answer
    }
};

function updateAnagramCounter(guessedCorrectly = false) {
    let correctCount = guessedCorrectly ? 1 : 0;
    document.getElementById('anagram-counter').innerText = `${correctCount}/1 solved`;
}

window.skipWord = function() {
    setFeedback('Skipped!', 'red');
    displayDefinition();
    toggleButtonsVisibility();
    // Display the correct word at the top when skipping
    document.getElementById('anagram').innerText = currentWord;
    document.getElementById('favoriteContainer').style.display = 'inline-block'; // Ensure favorite container is shown
    updateFavoriteIcon(true); // Ensure the favorite icon updates accordingly
    document.getElementById('user-input').disabled = true; // Disable input box after skipping
};

function displayDefinition() {
    // Clear existing content
    document.getElementById('definition').innerHTML = '';

    // Create a new container for the definition
    let definitionContainer = document.createElement('div');
    definitionContainer.className = 'definition-container'; // Add this class in your CSS for styling

    // Create the anchor element for the current word
    let wordLink = document.createElement('a');
    wordLink.href = `https://www.collinsdictionary.com/dictionary/english/${encodeURIComponent(currentWord.toLowerCase())}`;
    wordLink.target = "_blank"; // Open the link in a new tab
    wordLink.innerHTML = `${currentWord}<span style="color: white;">:</span>`; // Word and colon in white
    wordLink.style.color = "white"; // Ensures the word is white
    wordLink.style.textDecoration = "underline"; // Optionally, underline to indicate it's clickable

    // Append the word link to the definition container
    definitionContainer.appendChild(wordLink);

    // Append a space and the definition text directly, without altering its color here
    definitionContainer.innerHTML += ` <br>${currentDefinition}`;

    // Append the new container to the definition area
    document.getElementById('definition').appendChild(definitionContainer);

    // Set the initial color for the definition based on whether it was guessed correctly or skipped
    const currentWordObject = words.find(word => word.word.toUpperCase() === currentWord);
    if (currentWordObject.guessedCorrectly) {
        // Apply a specific color to the definition text if guessed correctly
        definitionContainer.style.color = '#90EE90'; // Correct guess color
    } else {
        // Apply a different color to the definition text if skipped or incorrect
        definitionContainer.style.color = 'red'; // Incorrect/skipped guess color
    }
}

window.nextWord = function() {
    setNewWord();
};

function toggleButtonsVisibility() {
    document.getElementById('submitWord').style.display = 'none';
    document.getElementById('skipWord').style.display = 'none';
    document.getElementById('next-word').style.display = '';
}   

function setFeedback(message, color) {
    const resultElement = document.getElementById('result');
    resultElement.innerText = message;
    resultElement.style.color = color;
}

function toggleFavorite() {
    const user = auth.currentUser;
    if (user) {
        const favoriteRef = doc(db, "users", user.uid, "favorites", currentWord);
        getDoc(favoriteRef).then((docSnap) => {
            if (docSnap.exists()) {
                // If the word is already a favorite, remove it from Firestore
                deleteDoc(favoriteRef).then(() => {
                    console.log("Word removed from favorites");
                    updateFavoriteIcon(false); // Update UI after removal
                }).catch(error => {
                    console.error("Error removing word from favorites:", error);
                });
            } else {
                // If the word is not a favorite, add it to Firestore
                setDoc(favoriteRef, {
                    word: currentWord,
                    definition: currentDefinition
                }).then(() => {
                    console.log("Word added to favorites");
                    updateFavoriteIcon(true); // Update UI after adding
                }).catch(error => {
                    console.error("Error adding word to favorites:", error);
                });
            }
        }).catch(error => {
            console.error("Error checking favorite status:", error);
        });
    } else {
        console.error("User not logged in");
    }
}

// Function to update the favorite icon based on Firestore data
function updateFavoriteIcon(shouldDisplay = false) {
    const user = auth.currentUser;
    if (user) {
        const favoriteRef = doc(db, "users", user.uid, "favorites", currentWord);
        getDoc(favoriteRef).then((docSnap) => {
            const isFavorite = docSnap.exists();
            const favoriteButton = document.getElementById('favoriteButton');
            favoriteButton.className = isFavorite ? 'fas fa-star' : 'far fa-star';
            document.getElementById('favoriteLabel').textContent = isFavorite ? 'Remove from Collection' : 'Add Word to Collection';

            // Conditionally make the button visible based on the argument
            if (shouldDisplay) {
                favoriteButton.style.display = 'inline-block';
                document.getElementById('favoriteContainer').style.display = 'inline-block';
            }
        });
    } else {
        console.error("User not logged in");
    }
}

document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the form from being submitted
        if (document.getElementById('next-word').style.display === 'none') {
            window.checkAnagram();
        }
    }
});