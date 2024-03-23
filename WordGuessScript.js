// Elements from DOM
const wordleGrid = document.getElementById('wordleGrid');
const virtualKeyboard = document.getElementById('virtualKeyboard');
const difficultySelection = document.getElementById('difficultySelection'); // Added for difficulty selection

// Game variables
let wordList = []
let currentGuess = [];
let guesses = [];
const wordLength = 5; // Fixed word length
let correctWord; // Declare without assigning

// Key state tracking
let keyState = {};

// Modify or remove the initial startGame() call
// startGame(); // This is now initiated by selecting difficulty

// Difficulty selection event listeners
document.getElementById('easy').addEventListener('click', function() { startGameWithDifficulty('easy'); });
document.getElementById('medium').addEventListener('click', function() { startGameWithDifficulty('medium'); });
document.getElementById('hard').addEventListener('click', function() { startGameWithDifficulty('hard'); });

function startGameWithDifficulty(difficulty) {
    let wordListURL;
    switch(difficulty) {
        case 'easy':
            wordListURL = 'https://raw.githubusercontent.com/Strategy4Schools/Strategy4Schools/main/Year%207%20Word%20List%20WordGuess.json';
            break;
        case 'medium':
            wordListURL = 'path/to/medium_word_list.json';
            break;
        case 'hard':
            wordListURL = 'path/to/hard_word_list.json';
            break;
        default:
            wordListURL = 'path/to/default_word_list.json'; // Fallback to a default word list if needed
    }
    loadWords(wordListURL);

    document.getElementById('infoButtonContainer').style.display = 'none'; // Hide the info button container

    difficultySelection.style.display = 'none';


    difficultySelection.style.display = 'none';

    wordleGrid.style.display = 'grid'; // Or 'flex' depending on your layout
    virtualKeyboard.style.display = 'flex'; // Adjust this according to your layout
}

// Initialize the game grid
function initializeGrid() {
    wordleGrid.innerHTML = '';
    let gridSize = wordLength * 6; // 6 attempts
    for (let i = 0; i < gridSize; i++) {
        let div = document.createElement('div');
        wordleGrid.appendChild(div);
    }
    wordleGrid.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;
}

// Virtual keyboard event listener
virtualKeyboard.addEventListener('click', function(event) {
    if (event.target.classList.contains('keyboard-key')) {
        const key = event.target.textContent;
        console.log(`Virtual keyboard key pressed: ${key}`); // Debug log
        if (key === '⌫') {
            console.log('Deleting last letter');
            deleteLastLetter();
        } else if (key === 'ENTER') {
            console.log('Submitting guess');
            submitGuess();
        } else {
            console.log(`Adding letter: ${key}`);
            addLetter(key);
        }
    }
});

// Load JSON Data
async function loadWords(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        wordList = data;
        correctWord = getNewWord();
        initializeGrid(); // Initialize the grid
        resetGame(); // Reset game state
    } catch (error) {
        console.error('Error loading words:', error);
        // Fallback to a default word list if necessary
        wordList = getDefaultWordList();
        correctWord = getNewWord();
        initializeGrid();
        resetGame();
    }
}

// Add a letter to the current guess
function addLetter(letter) {
    if (currentGuess.length < wordLength) {
        currentGuess.push(letter);
        updateGrid();
    }
}

// All the other functions (deleteLastLetter, updateGrid, getNewWord, submitGuess, etc.) remain unchanged

// Default word list for fallback
function getDefaultWordList() {
    return [
        { word: "apple", definition: "A fruit" },
        // Add more default words here
    ];
}

// Initialize the game grid
function initializeGrid() {
    wordleGrid.innerHTML = '';
    let gridSize = wordLength * 6; // 6 attempts
    for (let i = 0; i < gridSize; i++) {
        let div = document.createElement('div');
        wordleGrid.appendChild(div);
    }
    wordleGrid.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;
}

function deleteLastLetter() {
    if (currentGuess.length > 0) {
        // Remove the last letter from the current guess
        currentGuess.pop();
        console.log(`Current guess after deletion: ${currentGuess.join('')}`); // Log the current guess for debugging
        updateGrid(); // Call updateGrid to refresh the display
    } else {
        console.log("No letters to delete.");
    }
}

// Function to handle keydown events
function handleKeydown(event) {
    let key = event.key.toUpperCase();
    if (key === 'ENTER') {
        event.preventDefault();  // Prevent the default enter key behavior
        submitGuess();
    } else if (key === 'BACKSPACE') {
        deleteLastLetter();
    } else if (key.length === 1 && key >= 'A' && key <= 'Z' && currentGuess.length < wordLength) {
        addLetter(key);
    }
}

// Update the grid display
function updateGrid() {
    let tiles = wordleGrid.children;
    let guessIndex = guesses.length * wordLength;
    for (let i = 0; i < currentGuess.length; i++) {
        let tile = tiles[guessIndex + i];
        if (tile.textContent !== currentGuess[i]) {
            tile.textContent = currentGuess[i];
            tile.classList.add('bounce');
            tile.addEventListener('animationend', () => {
                tile.classList.remove('bounce');
            }, { once: true });
        }
    }
    for (let i = currentGuess.length; i < wordLength; i++) {
        tiles[guessIndex + i].textContent = '';
    }
}

// Define all your functions here
function getNewWord() {
    if (wordList.length === 0) {
        console.error('Word list is empty');
        return null; // Handle this case as appropriate
    }
    const randomIndex = Math.floor(Math.random() * wordList.length);
    correctWord = wordList[randomIndex]; // Assuming correctWord is an object with word details
    checkIfFavorite(); // Check if the new word is a favorite
    return correctWord;
}

// Submit a guess
function submitGuess() {
    if (currentGuess.length === wordLength) {
        let guess = currentGuess.join('').toUpperCase();
        // Check if the guess is a valid word
        if (isWordInList(guess)) {
            guesses.push(guess);
            checkGuess(guess);
            currentGuess = [];
        } else {
            alert('Invalid word');
        }
    } else {
        alert('Not enough letters');
    }
}

// Utility function to check if a word is in the wordList
function isWordInList(word) {
    return wordList.some(item => item.word.toUpperCase() === word);
}

// Check the submitted guess
function checkGuess(guess) {
    if (!correctWord) {
        console.error('No word to check against');
        return; // Exit the function if correctWord is not defined
    }
    let correct = guess === correctWord.word;
    let letterCount = {}; // Track the count of each letter in the correct word
    let guessState = new Array(wordLength).fill('absent'); // Array to track the state of each guessed letter

    // Populate letterCount with the number of each letter in the correctWord
    for (let char of correctWord.word) {
        letterCount[char] = (letterCount[char] || 0) + 1;
    }

    // First pass to check for correct letters
    for (let i = 0; i < wordLength; i++) {
        if (guess[i] === correctWord.word[i]) {
            guessState[i] = 'correct';
            letterCount[guess[i]]--;
        }
    }

    // Second pass to check for present letters that are not yet correct
    for (let i = 0; i < wordLength; i++) {
        if (guessState[i] !== 'correct' && letterCount[guess[i]] > 0 && correctWord.word.includes(guess[i])) {
            guessState[i] = 'present';
            letterCount[guess[i]]--;
        }
    }

    // Update keyState and display for each letter in the guess
    for (let i = 0; i < wordLength; i++) {
        let letter = guess[i].toUpperCase();
        if (guessState[i] === 'correct') {
            keyState[letter] = 'correct';
        } else if (guessState[i] === 'present' && !keyState[letter] !== 'correct') {
            keyState[letter] = 'present';
        } else if (guessState[i] === 'absent' && keyState[letter]) {
            keyState[letter] = 'absent';
        }
    }

    // Update the display with the correct colors
    for (let i = 0; i < wordLength; i++) {
        let tile = wordleGrid.children[guesses.length * wordLength - wordLength + i];
        let letter = guess[i];

        // Update key state based on the guessed letter state
        if (guessState[i] === 'correct') {
            keyState[letter] = 'correct';
        } else if (guessState[i] === 'present' && keyState[letter] !== 'correct') {
            keyState[letter] = 'present';
        } else if (guessState[i] === 'absent' && !(letter in keyState)) {
            keyState[letter] = 'absent';
        }

        setTimeout(() => {
            tile.textContent = letter;
            tile.style.color = 'white';
            if (guessState[i] === 'correct') {
                tile.style.backgroundColor = 'green';
            } else if (guessState[i] === 'present') {
                tile.style.backgroundColor = '#FDDA0D'; // yellow color
            } else {
                tile.style.backgroundColor = 'grey';
            }
        }, i * 200);
    }

    if (correct) {
        setTimeout(() => showPopup('Congratulations!<br>You guessed the word!'), 250 + wordLength * 200);
        endGame();
    } else if (guesses.length === 6) {
        setTimeout(() => showPopup(`Game over!<br>The correct word was ${correctWord.word}`), 250 + wordLength * 200);
        endGame();
    }

    // Update the virtual keyboard after all the tiles have been colored
    setTimeout(updateKeyboard, wordLength * 100);

    updateKeyboard();
}

// Update the keyboard colors   
function updateKeyboard() {
    const keys = virtualKeyboard.querySelectorAll('.keyboard-key');
    keys.forEach(key => {
        const letter = key.textContent.toUpperCase();

        // Prioritize the 'correct' state
        if (keyState[letter] === 'correct') {
            key.className = 'keyboard-key correct';
        } else if (keyState[letter] === 'present') {
            key.className = 'keyboard-key present';
        } else if (keyState[letter] === 'absent') {
            key.className = 'keyboard-key absent';
        } else {
            key.className = 'keyboard-key';
        }
    });
}

// Show popup message
function showPopup(message) {
    const popupBox = document.getElementById('popupBox');
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.innerHTML = message;
    popupBox.style.display = 'flex';

    // Disable the play-again-bottom button
    document.getElementById('play-again-bottom').style.pointerEvents = 'none';
    document.getElementById('play-again-bottom').style.opacity = '0.5';

    // Add keydown listener for 'Enter' key to restart the game
    document.addEventListener('keydown', handlePopupKeydown);
}

function handlePopupKeydown(event) {
    if (event.key === 'Enter') {
        closePopup(); // Close the popup and start a new game
    }
}

function closePopup() {
    const popupBox = document.getElementById('popupBox');
    popupBox.style.display = 'none';

    hideConfirmationMessageInstantly();

    // Enable the 'Play Again' button at the bottom
    const playAgainBottomButton = document.getElementById('play-again-bottom');
    playAgainBottomButton.style.pointerEvents = 'auto'; // Make it clickable
    playAgainBottomButton.style.opacity = '1'; // Make it fully visible

    // Add click event listener to 'Play Again' button at the bottom if it doesn't already have one
    playAgainBottomButton.removeEventListener('click', resetGame); // Remove any existing event listener to prevent duplicates
    playAgainBottomButton.addEventListener('click', resetGame); // Add the event listener

    document.removeEventListener('keydown', handlePopupKeydown); // Remove the keydown listener
}

function hideConfirmationMessageInstantly() {
    const confirmationMessage = document.getElementById('confirmationMessage');
    if (confirmationMessage) {
        confirmationMessage.style.opacity = '0';
        confirmationMessage.style.visibility = 'hidden';
        confirmationMessage.classList.remove('show');
        // Also, clear any timeout set for automatically hiding the confirmation message
        clearTimeout(confirmationMessage.hideTimeout);
    }
}

// Show Definition Popup
function showDefinitionPopup() {
    const definitionPopupBox = document.getElementById('definitionPopupBox');
    const definitionPopupMessage = document.getElementById('definitionPopupMessage');
    
    const wordUrl = `https://www.collinsdictionary.com/dictionary/english/${correctWord.word}`;

    definitionPopupMessage.innerHTML = `${correctWord.word}: ${correctWord.definition}<br><a href="${wordUrl}" target="_blank" class="definition-link">More about ${correctWord.word}</a>`;
    definitionPopupBox.style.display = 'flex';
}


function closeDefinitionPopup() {
    const definitionPopupBox = document.getElementById('definitionPopupBox');
    definitionPopupBox.style.display = 'none';
}

// End the game
function endGame() {
    document.removeEventListener('keydown', handleKeydown);
    const playAgainButton = document.getElementById('play-again-bottom');
    playAgainButton.style.display = 'block'; // Show the play again button
    playAgainButton.style.pointerEvents = 'none'; // Keep it disabled
    playAgainButton.style.opacity = '0.5'; // Visually indicate it's disabled
}

document.getElementById('play-again-bottom').addEventListener('click', function() {
    this.style.display = 'none'; // Hide the button
    resetGame();
});


// Reset the game to start again
function resetGame() {
    currentGuess = [];
    guesses = [];
    correctWord = getNewWord();
    initializeGrid();
    keyState = {}; // Reset the key states
    updateKeyboard(); // Update keyboard to default state
    document.addEventListener('keydown', handleKeydown);
}



// Load JSON Data
async function loadWords(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        wordList = data;
        correctWord = getNewWord();
        initializeGrid(); // Initialize the grid
        resetGame(); // Reset game state
    } catch (error) {
        console.error('Error loading words:', error);
        // Fallback to a default word list
        wordList = getDefaultWordList();
        correctWord = getNewWord();
        initializeGrid();
        resetGame();
    }
}

// Default word list
function getDefaultWordList() {
    return [
        { word: "apple", definition: "A fruit" },
        // Add more default words here
    ];
}

document.getElementById('closePopupButton').addEventListener('click', function() {
    closePopup();
});

function resetAndStartNewGame() {
    closePopup(); // Close the popup window
    resetGame();  // Reset the game state and start a new game

    // Hide the 'play again bottom' button
    const playAgainBottomButton = document.getElementById('play-again-bottom');
    playAgainBottomButton.style.display = 'none'; // This hides the button
}

document.getElementById('favoriteButton').addEventListener('click', function() {
    let favorites = JSON.parse(localStorage.getItem('wordGuessFavorites')) || [];
    const favoriteIcon = this.querySelector('i');
    const confirmationMessage = document.createElement('div');

    if (!favorites.includes(correctWord.word)) {
        favorites.push(correctWord.word);
        favoriteIcon.className = 'fas fa-star'; // Filled star
        this.classList.add('favorite-active');
        showConfirmation('Word added to favorites!');
    } else {
        // If removing from favorites is allowed
        const index = favorites.indexOf(correctWord.word);
        favorites.splice(index, 1);
        favoriteIcon.className = 'far fa-star'; // Outline star
        this.classList.remove('favorite-active');
        showConfirmation('Word removed from favorites.');
    }
    localStorage.setItem('wordGuessFavorites', JSON.stringify(favorites));
    checkIfFavorite();
});

function showConfirmation(message) {
    const confirmationBox = document.getElementById('confirmationMessage') || document.createElement('div');
    confirmationBox.setAttribute('id', 'confirmationMessage');
    confirmationBox.textContent = message;
    if (!document.contains(confirmationBox)) {
        document.body.appendChild(confirmationBox);
    }

    confirmationBox.style.opacity = '1';
    confirmationBox.style.visibility = 'visible';
    confirmationBox.classList.add('show');

    // Clear any previous timeout to hide the message
    clearTimeout(confirmationBox.hideTimeout);

    // Set a new timeout to automatically hide the message
    confirmationBox.hideTimeout = setTimeout(() => {
        hideConfirmationMessageInstantly();
    }, 1000); // Adjust the time as necessary
}

function addToFavorites(word) {
    let favorites = JSON.parse(localStorage.getItem('wordGuessFavorites')) || [];
    if (!favorites.includes(word)) {
        favorites.push(word);
        localStorage.setItem('wordGuessFavorites', JSON.stringify(favorites));
        console.log(`${word} added to favorites!`);
    } else {
        console.log(`${word} is already in favorites.`);
    }
}

function checkIfFavorite() {
    let favorites = JSON.parse(localStorage.getItem('wordGuessFavorites')) || [];
    const favoriteButton = document.getElementById('favoriteButton');
    const favoriteIcon = favoriteButton.querySelector('i'); // Assuming the icon is within the button

    // Check if the current word is in favorites and update the button state accordingly
    if (favorites.some(favWord => favWord === correctWord.word)) {
        favoriteButton.classList.add('favorite-active');
        favoriteIcon.className = 'fas fa-star'; // Solid star for favorited words
    } else {
        favoriteButton.classList.remove('favorite-active');
        favoriteIcon.className = 'far fa-star'; // Outline star otherwise
    }
}
