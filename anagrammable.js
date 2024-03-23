
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
            // Added check to ensure data.anagrams exists
            if (data && data.anagrams) {
                words = data.anagrams.map(entry => entry.words).flat(); // Assuming each entry has a words array
                setNewWord();
                document.getElementById('difficultySelectionContainer').style.display = 'none';
                document.querySelector('.main-content').style.display = 'flex';
            } else {
                console.error('Unexpected data structure:', data);
            }
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

function setNewWord() {
    randomEntry = words[Math.floor(Math.random() * words.length)];
    currentAnagrams = randomEntry.words.map(w => w.toUpperCase());
    guessedAnagrams.clear();
    pickNewAnagram();
    updateAnagramCounter(); // Update counter here
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
        }
    });
}

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
