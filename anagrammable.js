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

document.addEventListener('DOMContentLoaded', function() {
    fetch(`https://raw.githubusercontent.com/Strategy4Schools/Strategy4Schools/main/5_Letter_Words_CSW21_With_Definitions_Anagrammable.json`)
    .then(response => response.json())
    .then(data => {
        words = data.anagrams;
        setNewWord();
    });

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
