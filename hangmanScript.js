let words = ["javascript", "hangman", "website", "programming"];
let selectedWord, correctGuesses, wrongGuesses;
let lives; // Represents half-hearts. Full hearts are lives / 2.
let newlyGuessedLetters = new Set(); // To track newly guessed letters
let isGameActive = true; // Global variable to track game state

function startGame() {
    isGameActive = true;
    selectedWord = words[Math.floor(Math.random() * words.length)];
    correctGuesses = [];
    wrongGuesses = [];
    lives = 6; // 3 full hearts, each represented by 2 half-hearts
    newlyGuessedLetters.clear(); // Clear newly guessed letters
    displayWord();
    displayLives();
    displayAlphabet();
    document.getElementById("wrongLetters").innerHTML = "";
    document.getElementById("playAgain").style.display = "none";
}

document.addEventListener('keydown', (event) => {
    if (!isGameActive) {
        return; // Ignore key presses when the game is not active
    }

    const letter = event.key.toLowerCase();
    if (event.keyCode >= 65 && event.keyCode <= 90 && !newlyGuessedLetters.has(letter)) {
        newlyGuessedLetters.add(letter);
        handleGuess(letter);
    }
});

function displayLives() {
    let livesContainer = document.getElementById("lives");
    let previousLives = livesContainer.getAttribute('data-lives') || 6; // Store previous lives count

    livesContainer.innerHTML = '';
    livesContainer.setAttribute('data-lives', lives); // Update lives count

    for (let i = 0; i < 3; i++) {
        let heart = document.createElement("img");
        let isFullHeart = lives > i * 2 + 1;
        let isHalfHeart = lives > i * 2 && lives <= i * 2 + 1;
        let isEmptyHeart = lives <= i * 2;

        if (isFullHeart) {
            heart.src = 'https://github.com/Strategy4Schools/Strategy4Schools/blob/main/Full%20Heart%20PNG.png?raw=true';
        } else if (isHalfHeart) {
            heart.src = 'https://github.com/Strategy4Schools/Strategy4Schools/blob/main/Half%20Heart%20PNG.png?raw=true';
            if (previousLives > lives) { // Check if a half-heart is lost
                applyAnimation(heart);
            }
        } else if (isEmptyHeart) {
            heart.src = 'https://github.com/Strategy4Schools/Strategy4Schools/blob/main/Empty%20Heart%20PNG.png?raw=true';
            if (previousLives > lives) { // Check if a full-heart is lost
                applyAnimation(heart);
            }
        }
        livesContainer.appendChild(heart);
    }
}

function applyAnimation(heart) {
    // Apply shake and enlarge effect to the heart
    heart.classList.add('shake', 'temp-enlarge');
    setTimeout(() => {
        heart.classList.remove('shake', 'temp-enlarge');
    }, 500); // Duration should match the CSS animation
}


function handleGuess(letter) {
    if (selectedWord.toUpperCase().includes(letter.toUpperCase())) {
        if (!correctGuesses.includes(letter)) {
            correctGuesses.push(letter);
            displayWord();
            changeTileColor(letter, true);

            // Check if all letters are guessed correctly
            if (selectedWord.toUpperCase().split('').every(l => correctGuesses.map(c => c.toUpperCase()).includes(l))) {
                showModal("You guessed the word!", `${selectedWord}: ${wordDefinitions[selectedWord] || ''}`);
            }
        }
    } else {
        if (!wrongGuesses.includes(letter)) {
            wrongGuesses.push(letter);
            lives--;
            displayLives();
            document.getElementById("wrongLetters").innerHTML = "Wrong guesses: " + wrongGuesses.join(", ").toUpperCase();
            changeTileColor(letter, false);
            // Shake only the guessed letter tile
            shakeLetterTile(letter);
            
            checkGameOver();
        }
    }
    disableLetterTile(letter);
}



function shakeLetterTile(letter) {
    const tiles = document.querySelectorAll('.alphabet-tile');
    tiles.forEach(tile => {
        if (tile.textContent.toLowerCase() === letter.toLowerCase()) {
            tile.classList.add('shake');
            setTimeout(() => {
                tile.classList.remove('shake');
            }, 500); // Duration of shake animation
        }
    });
}



function changeTileColor(letter, isCorrect) {
    const tiles = document.querySelectorAll('.alphabet-tile');
    tiles.forEach(tile => {
        if (tile.textContent.toLowerCase() === letter.toLowerCase()) {
            if (isCorrect) {
                tile.classList.add('correct'); // Permanent change for correct guesses
            } else {
                // Add incorrect class for color change
                tile.classList.add('incorrect'); 
                // Add temporary enlargement
                tile.classList.add('temp-enlarge');
                setTimeout(() => {
                    // Remove temporary enlargement right after the animation ends
                    tile.classList.remove('temp-enlarge'); 
                }, 500); // Match this duration with the CSS transition time
            }
        }
    });
}







function displayWord() {
    const wordContainer = document.getElementById("wordToGuess");
    wordContainer.innerHTML = ''; // Clear existing content

    selectedWord.split('').forEach((letter, index) => {
        const letterSpan = document.createElement('span');
        if (correctGuesses.includes(letter)) {
            letterSpan.textContent = letter;

            // Apply flip animation only if this is a newly guessed letter
            if (newlyGuessedLetters.has(letter.toLowerCase())) {
                letterSpan.classList.add('flip');
            }
        } else {
            letterSpan.textContent = "_";
        }
        wordContainer.appendChild(letterSpan);
    });

    newlyGuessedLetters.clear();
}


function checkGameOver() {
    if (lives <= 0) {
        showModal("You ran out of lives", `The word was: ${selectedWord}. ${wordDefinitions[selectedWord] || ''}`);
    }
    // Check for win condition
    if (!document.getElementById("wordToGuess").textContent.includes("_")) {
        showModal("You guessed the word!", `${selectedWord}: ${wordDefinitions[selectedWord] || ''}`);
    }
}

document.getElementById("gameResultModal").onclick = function(event) {
    event.stopPropagation();
};

function displayAlphabet() {
    const alphabetRows = [
        'qwertyuiop',
        'asdfghjkl',
        'zxcvbnm'
    ];
    const alphabetContainer = document.getElementById("alphabet");
    alphabetContainer.innerHTML = '';

    alphabetRows.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = 'alphabet-row';

        row.split('').forEach(letter => {
            const tile = document.createElement("div");
            tile.innerText = letter.toUpperCase(); // Converts each letter to uppercase
            tile.classList.add("alphabet-tile");
            tile.onclick = () => handleGuess(letter);
            rowDiv.appendChild(tile);
        });

        alphabetContainer.appendChild(rowDiv);
    });
}


function disableLetterTile(letter) {
    const tiles = document.getElementsByClassName("alphabet-tile");
    for (let tile of tiles) {
        if (tile.innerText === letter) {
            tile.classList.add("disabled");
            tile.onclick = null;
        }
    }
}

let wordDefinitions = {
    "javascript": "A programming language commonly used in web development.",
    "hangman": "A guessing game where players try to guess a word by suggesting letters.",
    "website": "A set of related web pages located under a single domain name.",
    "programming": "The process of designing and building an executable computer program."
};

function showModal(message, definition) {
    isGameActive = false;
    document.getElementById("resultMessage").textContent = message;
    document.getElementById("wordDefinition").textContent = definition;
    document.getElementById("gameResultModal").style.display = "block";

    document.addEventListener('keydown', handleEnterKey);
}


function handleEnterKey(event) {
    if (event.keyCode === 13) { // Check if the key is Enter
        document.getElementById("playAgainButton").click(); // Simulate click on the Play Again button
    }
}


function hideModal() {
    document.getElementById("gameResultModal").style.display = "none";
    document.removeEventListener('keydown', handleEnterKey); // Remove the event listener
}

window.onclick = function(event) {
    if (event.target === document.getElementById("gameResultModal")) {
        hideModal();
    }
};

document.getElementById("playAgainButton").onclick = function() {
    resetGame();
    hideModal();
};


function resetGame() {
    isGameActive = true;
    // Reset game state
    correctGuesses = [];
    wrongGuesses = [];
    lives = 6; // Reset lives
    newlyGuessedLetters.clear();
    startGame(); // Restart the game
}

window.onload = startGame;
