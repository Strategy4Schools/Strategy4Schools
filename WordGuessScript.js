    // Elements from DOM
    const wordleGrid = document.getElementById('wordleGrid');
    const virtualKeyboard = document.getElementById('virtualKeyboard');

    // Words list
    const words = ['APPLE', 'BRAVE', 'CRISP', 'DELVE', 'EPOCH'];

    // Function to get a new word
    function getNewWord() {
        return words[Math.floor(Math.random() * words.length)];
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

    // Game variables
    let currentGuess = [];
    let guesses = [];
    let wordLength = 5; // Default word length
    let correctWord = getNewWord(); // Fetch a new word to start

    // Function to handle keydown events
    function handleKeydown(event) {
        let key = event.key.toUpperCase();
        if (key === 'ENTER') {
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
            if (tile.textContent !== currentGuess[i]) { // Only bounce if the letter is different
                tile.textContent = currentGuess[i];
                tile.classList.add('bounce');

                // Remove the bounce class after the animation ends
                tile.addEventListener('animationend', () => {
                    tile.classList.remove('bounce');
                }, { once: true }); // Ensures the listener is removed after it fires
            }
        }
        for (let i = currentGuess.length; i < wordLength; i++) {
            tiles[guessIndex + i].textContent = '';
        }
    }

    // Submit a guess
    function submitGuess() {
        if (currentGuess.length === wordLength) {
            let guess = currentGuess.join('');
            guesses.push(guess);
            checkGuess(guess);
            currentGuess = [];
        } else {
            alert('Not enough letters');
        }
    }

    // Check the submitted guess
    function checkGuess(guess) {
        let correct = guess === correctWord;

        for (let i = 0; i < wordLength; i++) {
            let letter = guess[i];
            let tile = wordleGrid.children[guesses.length * wordLength - wordLength + i];

            // Apply the guessed class to trigger the animation
            tile.classList.add('guessed');

            // Set the background and text color after a delay to allow the animation to play
            setTimeout(() => {
                tile.textContent = letter;
                tile.style.color = 'white'; // Set text color to white for visibility
                if (correctWord[i] === letter) {
                    tile.style.backgroundColor = 'green';
                } else if (correctWord.includes(letter)) {
                    tile.style.backgroundColor = '#c9b458'; //darker yellow
                } else {
                    tile.style.backgroundColor = 'grey';
                }
            }, i * 125); // Gradual delay for each letter
        }

        if (correct) {
            setTimeout(() => showPopup('Congratulations! You guessed the word!'), 250 + wordLength * 100);
            endGame();
        } else if (guesses.length === 6) {
            setTimeout(() => showPopup(`Game over! The correct word was ${correctWord}.`), 250 + wordLength * 100);
            endGame();
        }
    }

    // Show popup message
    function showPopup(message) {
        const popupBox = document.getElementById('popupBox');
        const popupMessage = document.getElementById('popupMessage');
        popupMessage.textContent = message;
        popupBox.style.display = 'flex';
    }

    // Close the popup and reset the game
    function closePopup() {
        const popupBox = document.getElementById('popupBox');
        popupBox.style.display = 'none';
        resetGame();
    }

    // End the game
    function endGame() {
        document.removeEventListener('keydown', handleKeydown);
    }

    // Reset the game to start again
    function resetGame() {
        currentGuess = [];
        guesses = [];
        correctWord = getNewWord();
        initializeGrid();
        document.addEventListener('keydown', handleKeydown);
    }

    // Start the game
    function startGame() {
        correctWord = getNewWord();
        initializeGrid();
        document.addEventListener('keydown', handleKeydown);
    }

    startGame();
