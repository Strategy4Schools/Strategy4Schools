// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, doc, updateDoc, arrayUnion, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIdvoYCGYNV1_rG9JdNtz_Q1iA66k9I6o",
  authDomain: "strategy4schoolsdb.firebaseapp.com",
  projectId: "strategy4schoolsdb",
  storageBucket: "strategy4schoolsdb.appspot.com",
  messagingSenderId: "125952142437",
  appId: "1:125952142437:web:11d221ac797be1c3e0ea8c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function checkOrCreateUserDocument(user) {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
        // The document does not exist, let's create it
        await setDoc(userDocRef, {
            // Initialize with any necessary data structure. For example:
            incorrectWords: [],
            // You can add more fields here as needed
        });
        console.log("New user document created.");
    } else {
        console.log("User document already exists.");
    }
}

// This function could be called after a user logs in successfully
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in, let's check or create their document
        checkOrCreateUserDocument(user);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    setupBackButton();
    setupDifficultySelection();
    // Removed the fetchWordsAndStartGame call to avoid premature execution.
});

function setupDifficultySelection() {
    document.getElementById('easy').addEventListener('click', () => startGameWithDifficulty('easy'));
    document.getElementById('medium').addEventListener('click', () => startGameWithDifficulty('medium'));
    document.getElementById('hard').addEventListener('click', () => startGameWithDifficulty('hard'));
}

function startGameWithDifficulty(difficulty) {
    let wordListURL = determineWordListURL(difficulty);
    if (wordListURL) {
        loadWords(wordListURL);
    }
}

function determineWordListURL(difficulty) {
    switch (difficulty) {
        case 'easy': 
            // Use the correct path for your easy word list
            return 'https://raw.githubusercontent.com/Strategy4Schools/Strategy4Schools/main/easy_word_list_anagrammable.json';
        case 'medium': 
            // Use the correct path for your medium word list
            return 'https://raw.githubusercontent.com/Strategy4Schools/Strategy4Schools/main/medium_word_list_anagrammable.json';
        case 'hard': 
            // Use the correct path for your hard word list
            return 'https://raw.githubusercontent.com/Strategy4Schools/Strategy4Schools/main/hard_word_list_anagrammable.json';
        default:
            console.error('Invalid difficulty level');
            return null;
    }
}

function loadWords(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Make sure the data structure matches your expectations.
            // If "data" directly contains the words array, assign it to "words".
            // Adjust this line if your data structure is different.
            words = data.anagrams || []; // Adjusted for your data structure
            setNewWord();
            // Hide the difficulty selection and show the main game content.
            document.getElementById('difficultySelectionContainer').style.display = 'none';
            document.querySelector('.main-content').style.display = 'flex';
        })
        .catch(error => {
            console.error('Failed to load words:', error);
        });
}

function saveIncorrectTargetWord(word, definition) {
    const user = auth.currentUser;
    if (!user) {
        console.error("User not logged in");
        return;
    }

    const incorrectWordsRef = doc(db, "users", user.uid);
    updateDoc(incorrectWordsRef, {
        incorrectWords: arrayUnion({ word, definition })
    }).then(() => {
        console.log("Incorrect word saved to Firestore");
    }).catch((error) => {
        console.error("Error saving incorrect word: ", error);
    });
}

function setupBackButton() {
    const backButton = document.getElementById('backToMinigames');
    backButton.addEventListener('click', function() {
        window.location.href = 'brain_play_home.html';
    });
}

let words = [];
let currentAnagrams = [];
let guessedAnagrams = new Set();
let currentWord = '';
let currentDefinition = '';
let randomEntry;
let correctGuessMade = false;

function shuffleWord(word) {
    let shuffled = word.split('').sort(() => 0.5 - Math.random()).join('');
    return shuffled === word ? shuffleWord(word) : shuffled;
}

function setNewWord() {
    randomEntry = words[Math.floor(Math.random() * words.length)];
    currentAnagrams = randomEntry.words.map(w => w.toUpperCase());
    guessedAnagrams.clear();
    pickNewAnagram();
    updateAnagramCounter();

        // Reset button visibility for a new round
    document.querySelector('.buttons-container').style.display = 'flex'; // Re-show 'Submit' and 'Skip'
    document.getElementById('next-word').style.display = 'none'; // Hide 'Next Word' button

    correctGuessMade = false; // Reset flag for new word

    // Splitting definition if it contains the word itself
    currentDefinition = randomEntry.definitions[0].includes(':') ? randomEntry.definitions[0].split(': ')[1] : randomEntry.definitions[0];

    hideAnagramsContainer(); // Ensure the container is hidden when a new word is set

    updateFavoriteIcon();
}

function pickNewAnagram() {
    if (guessedAnagrams.size === currentAnagrams.length) {
        setNewWord();
        return;
    }

    let nextWord;
    do {
        nextWord = currentAnagrams[Math.floor(Math.random() * currentAnagrams.length)];
    } while (guessedAnagrams.has(nextWord));

    currentWord = nextWord;
    let shuffledWord = shuffleWord(currentWord);
    document.getElementById('anagram').innerText = shuffledWord;
    document.getElementById('user-input').value = '';
    document.getElementById('result').innerText = '';
    document.getElementById('definition').innerText = '';
    document.getElementById('user-input').focus();
}

function createAndAppendAnagramDefinition(parentElement, anagram, definition, isGuessed) {
    let containerDiv = document.createElement('div'); // Container for each word-definition pair
    containerDiv.style.display = 'inline-block'; // Make the container only as wide as its content
    containerDiv.style.backgroundColor = 'transparent'; // Optional: Set background to transparent
    containerDiv.style.marginRight = '10px'; // Add some margin to the right for spacing between entries
    containerDiv.style.padding = '5px'; // Add padding around the content for better readability

    // Create the anchor element for the anagram word
    let anagramLink = document.createElement('a');
    anagramLink.href = `https://www.collinsdictionary.com/dictionary/english/${anagram.toLowerCase()}`;
    anagramLink.textContent = anagram;
    anagramLink.target = '_blank';
    anagramLink.title = "View definition on Collins Dictionary";
    anagramLink.style.color = "white"; // Set the word color to white
    anagramLink.style.textDecoration = "underline"; // Indicate it's clickable

    containerDiv.appendChild(anagramLink);

    // Append a new line break for stacking the definition below the word
    containerDiv.appendChild(document.createElement('br'));

    // Append the definition text with additional padding at the top
    let definitionText = document.createElement('span');
    definitionText.textContent = definition.replace(anagram + ': ', ''); // Adjust the definition text as necessary
    definitionText.style.color = isGuessed ? '#90EE90' : 'red'; // Green if guessed, red otherwise
    definitionText.style.display = 'block'; // Make the definition block-level for the padding to take effect

    containerDiv.appendChild(definitionText);

    // Append the whole container to the parent element
    parentElement.appendChild(containerDiv);
}

// Modified updateGuessedWordsDisplay function
function updateGuessedWordsDisplay(guessedWord) {
    let anagramsDiv = document.getElementById('anagrams-container');
    anagramsDiv.innerHTML = '';

    let guessedWordsDiv = document.getElementById('guessed-words');
    let definitionIndex = currentAnagrams.indexOf(guessedWord);
    let definition = randomEntry.definitions[definitionIndex];
    createAndAppendAnagramDefinition(guessedWordsDiv, guessedWord, definition, true);
}

// Modified displayAllAnagrams function
function displayAllAnagrams() {
    let anagramsDiv = document.getElementById('anagrams-container');
    anagramsDiv.innerHTML = '';

    currentAnagrams.forEach((anagram, index) => {
        let definition = randomEntry.definitions[index];
        // Only display unguessed anagrams or modify this as needed to display all
        if (!guessedAnagrams.has(anagram)) {
            createAndAppendAnagramDefinition(anagramsDiv, anagram, definition, false);
        }
    });
}

function finishGame() {
    // Hide the 'Submit' and 'Skip' buttons
    document.querySelector('.buttons-container').style.display = 'none';

    // Show the 'Next Word' button and adjust its position/style if needed
    let nextWordButton = document.getElementById('next-word');
    nextWordButton.style.display = 'block';
    // Adjust styling as needed, e.g., centering the button
    nextWordButton.style.margin = '0 auto';

    showAnagramsContainer(); // Show the anagrams when the game ends
}

// Initial setup for the 'Next Word' button to ensure it starts hidden
window.onload = function() {
    document.getElementById('next-word').style.display = 'none';
};

window.checkAnagram = function() {
    checkAnagramLogic();
}

window.skipWord = function() {
    // Show the solved anagram when the user skips
    document.getElementById('anagram').innerText = currentWord; // Display the solved word
    document.getElementById('result').innerText = 'Skipped!';
    document.getElementById('result').style.color = 'red'; // Keep as orange or change to red for consistency

    let skipMessageDiv = document.getElementById('anagrams-container');
    skipMessageDiv.innerHTML = '<div style="color: orange;">Skipped!</div>';
    displayAllAnagrams(); // Show all anagrams, indicating the round is over
    document.getElementById('user-input').disabled = true;
    document.getElementById('next-word').style.display = 'block';
    updateAnagramCounter(); // Update counter here
    document.getElementById('favoriteButton').style.display = 'inline-block'; // Show the star when skipped
    showAnagramsContainer(); // Also show the container when a word is skipped
    roundEnd();
}  

window.nextWord = function() {
    setNewWord();
    document.getElementById('guessed-words').innerHTML = '';
    document.getElementById('anagrams-container').innerHTML = '';
    document.getElementById('next-word').style.display = 'none';
    document.getElementById('user-input').disabled = false;
    document.getElementById('user-input').focus();
    document.getElementById('favoriteContainer').style.display = 'none';    
}

window.shuffleAnagram = function() {
    let shuffledWord = shuffleWord(currentWord);
    document.getElementById('anagram').innerText = shuffledWord;
}

document.body.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (event.ctrlKey) {
            // Only allow skipping if the next word button is not visible and a correct guess hasn't been made
            if (document.getElementById('next-word').style.display === 'none' && !correctGuessMade) {
                window.skipWord();
            }
        } else if (document.getElementById('next-word').style.display === 'block') {
            window.nextWord();
        } else if (!document.getElementById('user-input').disabled) {
            window.checkAnagram();
        }
    }
});

function checkAnagramLogic() {
    let userInput = document.getElementById('user-input').value.trim().toUpperCase();
    let inputShuffleContainer = document.querySelector('.input-shuffle-container');

    if (currentAnagrams.includes(userInput) && !guessedAnagrams.has(userInput)) {
    document.getElementById('result').innerText = 'Correct!';
    document.getElementById('result').style.color = '#90EE90'; // Set text color to green for correct
    correctGuessMade = true;
        document.getElementById('anagram').innerText = currentWord; // Show the solved word for correct guesses
        guessedAnagrams.add(userInput);
        updateGuessedWordsDisplay(userInput);
        document.getElementById('favoriteButton').style.display = 'inline-block';
    } else {
        document.getElementById('result').innerText = 'Try Again!';
        document.getElementById('result').style.color = 'red'; // Set text color to red for try again
        // Incorrectly saving user input instead of the target word
        // saveIncorrectTargetWord(userInput); // This is incorrect based on your goal

        // Correct approach: Save the actual target word and its definition
        saveIncorrectTargetWord(currentWord, currentDefinition);

        inputShuffleContainer.classList.add('shake');
        setTimeout(() => inputShuffleContainer.classList.remove('shake'), 500);
    }
    updateAnagramCounter();

    if (guessedAnagrams.size === currentAnagrams.length) {
        document.getElementById('next-word').style.display = 'block';
        document.getElementById('user-input').disabled = true;
        displayAllAnagrams();
        roundEnd();
    } else {
        document.getElementById('user-input').value = '';
        document.getElementById('user-input').focus();
    }
}

function showAnagramsContainer() {
    document.getElementById('anagrams-container').style.display = 'block'; // Show the container
}

function hideAnagramsContainer() {
    document.getElementById('anagrams-container').style.display = 'none'; // Hide the container
}

function updateAnagramCounter() {
    let remainingAnagrams = currentAnagrams.length - guessedAnagrams.size;
    let totalAnagrams = currentAnagrams.length;
    let counterText = `${totalAnagrams - remainingAnagrams}/${totalAnagrams} solved`;

    document.getElementById('anagram-counter').innerText = counterText;
}

document.getElementById('favoriteContainer').addEventListener('click', async function() {
    const user = auth.currentUser;
    if (!user) {
        console.error("User not logged in");
        return;
    }
    
    // Reference to a subcollection named 'favorites' for storing each favorite word as a separate document
    const favoriteWordRef = doc(db, "users", user.uid, "favorites", currentWord); // 'currentWord' should be a variable holding the word to be favorited/unfavorited
    const docSnap = await getDoc(favoriteWordRef);

    if (!docSnap.exists()) {
        // If the word is not already favorited, add it to Firestore
        await setDoc(favoriteWordRef, { word: currentWord, definition: currentDefinition });
        console.log(`${currentWord} added to favorites.`);
    } else {
        // If the word is already favorited, remove it from Firestore
        await deleteDoc(favoriteWordRef);
        console.log(`${currentWord} removed from favorites.`);
    }

    // Update the UI to reflect the current state of the favorite word
    updateFavoriteIcon();
});

async function updateFavoriteIcon() {
    const user = auth.currentUser;
    if (!user) {
        console.error("User not logged in");
        return;
    }
    
    const favoriteWordRef = doc(db, "users", user.uid, "favorites", currentWord);
    const docSnap = await getDoc(favoriteWordRef);
    const isFavorite = docSnap.exists();

    document.getElementById('favoriteButton').className = isFavorite ? 'fas fa-star' : 'far fa-star';
    document.getElementById('favoriteLabel').textContent = isFavorite ? 'Remove from Collection' : 'Add Word to Collection';
}

function roundEnd() {
    // Hide 'Submit' and 'Skip' buttons
    document.querySelector('.buttons-container').style.display = 'none';
    // Show 'Next Word' button
    document.getElementById('next-word').style.display = 'inline-block';
    document.getElementById('favoriteContainer').style.display = 'inline-block'; // Show favorite container
    updateFavoriteIcon(); // This will update the icon and the label according to the current word's favorite status

    if (!correctGuessMade) {
    saveIncorrectTargetWord(currentWord, currentDefinition);
    }
};
