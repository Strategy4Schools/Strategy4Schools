// Elements from DOM
const wordleGrid = document.getElementById('wordleGrid');
const virtualKeyboard = document.getElementById('virtualKeyboard');

// Game variables
let wordList = []
let currentGuess = [];
let guesses = [];
let wordLength = 5; // Default word length
let correctWord; // Declare without assigning

// Key state tracking
let keyState = {};

// Setup Game Function
function setupGame(selectedWordLength) {
    wordLength = selectedWordLength;
    loadWords(`https://raw.githubusercontent.com/Strategy4Schools/Strategy4Schools/main/${selectedWordLength}_Letter_Words_CSW21_With_Definitions.json`);
}

// Load JSON Data
function loadWords(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            wordList = data;
            correctWord = getNewWord();
            initializeGrid(); // Initialize the grid
            resetGame(); // Reset game state
        })
        .catch(error => {
            console.error('Error loading words:', error);
        });
}

function startGame() {
    setupGame(wordLength); // wordLength is already defined as 5
    loadWords(`https://raw.githubusercontent.com/Strategy4Schools/Strategy4Schools/main/${wordLength}_Letter_Words_CSW21_With_Definitions.json`);
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

// Virtual keyboard event listener
virtualKeyboard.addEventListener('click', function(event) {
    if (event.target.classList.contains('keyboard-key')) {
        const key = event.target.textContent;
        if (key === '⌫') {
            deleteLastLetter();
        } else if (key === 'ENTER') {
            submitGuess();
        } else {
            addLetter(key);
        }
    }
});

// Add a letter to the current guess
function addLetter(letter) {
    if (currentGuess.length < wordLength) {
        currentGuess.push(letter);
        updateGrid();
    }
}

// Delete the last letter of the current guess
function deleteLastLetter() {
    currentGuess.pop();
    updateGrid();
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
        return null; // Or handle this case as appropriate
    }
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
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
    document.removeEventListener('keydown', handlePopupKeydown); // Remove the keydown listener
    resetGame();

    // Hide the play-again-bottom button
    document.getElementById('play-again-bottom').style.display = 'none';
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

// Start the game
function startGame() {
    setupGame(wordLength); // wordLength is already defined as 5
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



startGame();

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('popupBox').style.display = 'none';
    
    // Re-enable the play-again-bottom button
    const playAgainButton = document.getElementById('play-again-bottom');
    playAgainButton.style.pointerEvents = 'auto';
    playAgainButton.style.opacity = '1';
});