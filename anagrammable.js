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
            return 'https://raw.githubusercontent.com/Strategy4Schools/Strategy4Schools/main/anagrammable_year_7_word_list.json';
        case 'medium': 
            // Use the correct path for your medium word list
            return 'path/to/medium_word_list.json';
        case 'hard': 
            // Use the correct path for your hard word list
            return 'path/to/hard_word_list.json';
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

function setupBackButton() {
    const backButton = document.getElementById('backToMinigames');
    backButton.addEventListener('click', function() {
        window.location.href = 'minigames_home.html';
    });
}

let words = [];
let currentAnagrams = [];
let guessedAnagrams = new Set();
let currentWord = '';
let currentDefinition = '';
let randomEntry;

function shuffleWord(word) {
    let shuffled = word.split('').sort(() => 0.5 - Math.random()).join('');
    return shuffled === word ? shuffleWord(word) : shuffled;
}

document.getElementById('favoriteButton').addEventListener('click', function() {
    // Retrieve the current list of favorites or initialize an empty array if none exists
    let favorites = JSON.parse(localStorage.getItem('gameFavorites')) || [];
    const word = currentWord; // Adapt based on how you set the current word in your game

    // Determine if the word is currently favorited
    const isFavorited = favorites.includes(word);

    if (isFavorited) {
        // If the word is currently a favorite, remove it from the favorites list
        favorites = favorites.filter(favorite => favorite !== word);
    } else {
        // If the word is not a favorite, add it to the favorites list
        favorites.push(word);
    }

    // Update localStorage with the new list of favorites
    localStorage.setItem('gameFavorites', JSON.stringify(favorites));

    // Toggle the favorite-active class based on the new state
    this.classList.toggle('favorite-active', !isFavorited);

    // Update the button text immediately to reflect the new state
    updateFavoriteButtonText(!isFavorited);
});

function updateFavoriteButtonText(isFavorited) {
    const favoriteButton = document.getElementById('favoriteButton');
    // Use innerHTML or textContent depending on whether you're including other HTML elements in your button
    favoriteButton.innerHTML = isFavorited ? '<i class="fas fa-star"></i> Remove from Collection' : '<i class="far fa-star"></i> Add Word to Collection';
    
    // Optionally update the icon color immediately
    const favoriteIcon = favoriteButton.querySelector('i');
    favoriteIcon.style.color = isFavorited ? 'gold' : 'gold';
}

function checkIfFavorite(word) {
    const favorites = JSON.parse(localStorage.getItem('gameFavorites')) || [];
    // Determine if the current word is in the list of favorites
    const isFavorited = favorites.includes(word);

    // Update the favorite button to reflect whether the current word is favorited
    updateFavoriteButtonText(isFavorited);

    // Toggle the favorite-active class based on whether the word is favorited
    document.getElementById('favoriteButton').classList.toggle('favorite-active', isFavorited);
}


function setNewWord() {
    randomEntry = words[Math.floor(Math.random() * words.length)];
    currentAnagrams = randomEntry.words.map(w => w.toUpperCase());
    guessedAnagrams.clear();
    pickNewAnagram();
    updateAnagramCounter();
    document.getElementById('favoriteButtonContainer').style.display = 'none';
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
    // After setting a new anagram, check if it's favorited and update button text
    checkIfFavorite(currentWord);
}

function checkIfFavorite(currentWord) {
    const favorites = JSON.parse(localStorage.getItem('anagramFavorites')) || [];
    const isFavorited = favorites.includes(currentWord);
    updateFavoriteButtonText(isFavorited);
    document.getElementById('favoriteButton').classList.toggle('favorite-active', isFavorited);
}

function updateGuessedWordsDisplay(guessedWord) {
    let guessedWordsDiv = document.getElementById('guessed-words');
    let definitionIndex = currentAnagrams.indexOf(guessedWord);
    
    let wordElement = document.createElement('p');
    let definition = randomEntry.definitions[definitionIndex];
    definition = definition.replace(guessedWord + ': ', '');

    let wordLink = document.createElement('a');
    wordLink.href = `https://www.collinsdictionary.com/dictionary/english/${guessedWord.toLowerCase()}`;
    wordLink.textContent = guessedWord;
    wordLink.target = '_blank';
    wordLink.title = "View definition on Collins Dictionary";

    wordElement.appendChild(wordLink);
    wordElement.innerHTML += ": " + definition;
    wordElement.style.color = 'green';

    guessedWordsDiv.appendChild(wordElement);
}

function displayAllAnagrams() {
    let anagramsDiv = document.getElementById('anagrams-container');
    anagramsDiv.innerHTML = '';

    currentAnagrams.forEach((anagram, index) => {
        if (!guessedAnagrams.has(anagram)) {
            let anagramElement = document.createElement('p');
            let definition = randomEntry.definitions[index];
            definition = definition.replace(anagram + ': ', '');

            let anagramLink = document.createElement('a');
            anagramLink.href = `https://www.collinsdictionary.com/dictionary/english/${anagram.toLowerCase()}`;
            anagramLink.textContent = anagram;
            anagramLink.target = '_blank';
            anagramLink.title = "View definition on Collins Dictionary";

            anagramElement.appendChild(anagramLink);
            anagramElement.innerHTML += ": " + definition;
            anagramElement.style.color = 'red';

            anagramsDiv.appendChild(anagramElement);

            document.getElementById('favoriteButtonContainer').style.display = 'block';
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

    // Additional logic for when the game finishes can be added here
}

// Initial setup for the 'Next Word' button to ensure it starts hidden
window.onload = function() {
    document.getElementById('next-word').style.display = 'none';
};

window.checkAnagram = function() {
    checkAnagramLogic();
}

window.skipWord = function() {
    let skipMessageDiv = document.getElementById('anagrams-container');
    skipMessageDiv.innerHTML = '<div style="color: orange;">Skipped!</div>';
    displayAllAnagrams();
    document.getElementById('user-input').disabled = true;
    document.getElementById('next-word').style.display = 'block';
    updateAnagramCounter(); // Update counter here
}

window.nextWord = function() {
    setNewWord();
    document.getElementById('guessed-words').innerHTML = '';
    document.getElementById('anagrams-container').innerHTML = '';
    document.getElementById('next-word').style.display = 'none';
    document.getElementById('user-input').disabled = false;
    document.getElementById('user-input').focus();
}

window.shuffleAnagram = function() {
    let shuffledWord = shuffleWord(currentWord);
    document.getElementById('anagram').innerText = shuffledWord;
}

document.body.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (event.ctrlKey) {
            window.skipWord();
        } else if (document.getElementById('next-word').style.display === 'block') {
            window.nextWord();
        } else if (!document.getElementById('user-input').disabled) {
            window.checkAnagram();
        }
    }
});

function checkAnagramLogic() {
    let userInput = document.getElementById('user-input').value.trim().toUpperCase();
    if (currentAnagrams.includes(userInput) && !guessedAnagrams.has(userInput)) {
        document.getElementById('result').innerText = 'Correct!';
        checkIfFavorite(currentWord); // Ensure this is called with the correct current word
        document.getElementById('favoriteButtonContainer').style.display = 'flex'; // Make favorite button visible

        guessedAnagrams.add(userInput);
        updateGuessedWordsDisplay(userInput);
    } else {
        document.getElementById('result').innerText = 'Try Again!';
    }
    updateAnagramCounter(); // Update counter here regardless of whether the guess was correct

    if (guessedAnagrams.size === currentAnagrams.length) {
        document.getElementById('next-word').style.display = 'block';
        document.getElementById('user-input').value = '';
        document.getElementById('user-input').disabled = true;
    } else {
        document.getElementById('user-input').value = '';
        document.getElementById('user-input').focus();

            if (guessedAnagrams.size === currentAnagrams.length) {
        checkIfFavorite(currentWord); // Ensure this is called with the correct current word
        document.getElementById('favoriteButtonContainer').style.display = 'flex'; // Make favorite button visible
        }
    }
}

function updateGuessedWordsDisplay(guessedWord) {
    let guessedWordsDiv = document.getElementById('guessed-words');
    let definitionIndex = currentAnagrams.indexOf(guessedWord);
    
    let wordElement = document.createElement('p');
    let definition = randomEntry.definitions[definitionIndex];
    definition = definition.replace(guessedWord + ': ', '');

    let wordLink = document.createElement('a');
    wordLink.href = `https://www.collinsdictionary.com/dictionary/english/${guessedWord.toLowerCase()}`;
    wordLink.textContent = guessedWord;
    wordLink.target = '_blank';

    wordElement.appendChild(wordLink);
    wordElement.innerHTML += ": " + definition;
    wordElement.style.color = 'green';

    guessedWordsDiv.appendChild(wordElement);
}

function updateAnagramCounter() {
    let remainingAnagrams = currentAnagrams.length - guessedAnagrams.size;
    let totalAnagrams = currentAnagrams.length;
    let counterText = `${totalAnagrams - remainingAnagrams}/${totalAnagrams} solved`;

    document.getElementById('anagram-counter').innerText = counterText;
}