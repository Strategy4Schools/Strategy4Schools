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
    let incorrectWords = JSON.parse(localStorage.getItem('incorrectWords')) || [];
    if (incorrectWords.length === 0) {
        alert("No incorrect words to review.");
        window.location.href = 'minigames_home.html';
        return;
    }
    words = incorrectWords.map(word => ({...word, guessedCorrectly: false}));
    setNewWord();
    document.querySelector('.main-content').style.display = 'flex';
}

let words = [];
let currentWord = '';
let currentDefinition = '';

function setNewWord() {
    if (words.length === 0) {
        alert("Congratulations, you've reviewed all the incorrect words!");
        window.location.href = 'minigames_home.html';
        return;
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

    // Add the word and its definition to the container
    definitionContainer.innerHTML = `<strong>Word:</strong> ${currentWord} <br><strong>Definition:</strong> ${currentDefinition}`;

    // Append the new container to the definition area
    document.getElementById('definition').appendChild(definitionContainer);
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
    let favorites = JSON.parse(localStorage.getItem('gameFavorites')) || [];
    const index = favorites.findIndex(fav => fav.word === currentWord);

    if (index === -1) {
        favorites.push({ word: currentWord, definition: currentDefinition });
    } else {
        favorites.splice(index, 1);
    }

    localStorage.setItem('gameFavorites', JSON.stringify(favorites));
    updateFavoriteIcon();
}

function updateFavoriteIcon(shouldDisplay = false) {
    let favorites = JSON.parse(localStorage.getItem('gameFavorites')) || [];
    const isFavorite = favorites.some(favorite => favorite.word === currentWord);
    
    const favoriteButton = document.getElementById('favoriteButton');
    favoriteButton.className = isFavorite ? 'fas fa-star' : 'far fa-star';
    document.getElementById('favoriteLabel').textContent = isFavorite ? 'Remove from Collection' : 'Add Word to Collection';

    // Conditionally make the button visible based on the argument
    if (shouldDisplay) {
        favoriteButton.style.display = 'inline-block'; // Make the button itself visible
        document.getElementById('favoriteContainer').style.display = 'inline-block'; // Also ensure the container is visible
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

