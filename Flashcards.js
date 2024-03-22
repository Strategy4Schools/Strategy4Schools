let currentCard = 0;
let flashcards = [];
let isShuffled = false;

document.addEventListener('DOMContentLoaded', function() {
    // Parse the URL parameter to get the flashcard set
    const urlParams = new URLSearchParams(window.location.search);
    const flashcardSet = urlParams.get('set'); // This corresponds to the 'set' parameter in the URL

    // Determine which word list to fetch based on the 'set' parameter
    let wordListURL;
    switch (flashcardSet) {
        case 'tricky-spellers':
            wordListURL = 'http://localhost:8000/tricky_spellers.json';
            break;
        case 'useful-verbs':
            wordListURL = 'http://localhost:8000/useful_verbs.json';
            break;
        case 'impressive-adjectives':
            wordListURL = 'http://localhost:8000/impressive_adjectives.json';
            break;
        default:
            console.error('Flashcard set not found. Loading default set.');
            wordListURL = 'http://localhost:8000/default_set.json'; // Fallback word list
    }

    // Fetch the selected word list
    fetchWordList(wordListURL);
});

function fetchWordList(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        flashcards = data;
        currentCard = 0; // Reset to the first card
        updateCard(); // Initialize the first card with new data
    })
    .catch(error => console.error('Error fetching word list:', error));
}

    function flipCard() {
        let card = document.getElementById("flashcard");
        if (!card.classList.contains('slide-left') && !card.classList.contains('slide-right')) {
            // Only toggle flip if not currently sliding
            card.classList.toggle('flipped');
        }
    }

    function nextCard() {
        if (currentCard < flashcards.length - 1) {
            currentCard++;
        } else {
            currentCard = 0; // Loop back to the first card
        }
        changeCard('slide-left');
    }

    function previousCard() {
        if (currentCard > 0) {
            currentCard--;
        } else {
            currentCard = flashcards.length - 1; // Loop to the last card
        }
        changeCard('slide-right');
    }

    function toggleShuffle() {
        isShuffled = !isShuffled;
        let shuffleButton = document.querySelector('button[onclick="toggleShuffle()"]');
        if (isShuffled) {
            flashcards.sort(() => Math.random() - 0.5);
            shuffleButton.innerText = 'Unshuffle';
        } else {
            flashcards.sort((a, b) => a.word.localeCompare(b.word));
            shuffleButton.innerText = 'Shuffle';
        }
        currentCard = 0;
        updateCard();
    }

    function updateCard() {
        let card = document.getElementById("flashcard");
        let wordDiv = document.getElementById("word");
        let defDiv = document.getElementById("definition");
        let progressCounter = document.getElementById("progress-counter");

        // Reset styles and classes for a fresh update
        card.className = ''; // Reset all classes
        wordDiv.innerText = flashcards[currentCard].word;
        defDiv.innerText = flashcards[currentCard].definition; // Update content
        
        // Immediately show the front side of the card
        card.style.opacity = '1';
        progressCounter.innerText = (currentCard + 1) + '/' + flashcards.length;
    }

    function changeCard(direction) {
        let card = document.getElementById("flashcard");
        card.style.opacity = '0'; // Temporarily hide the card for the transition
        setTimeout(() => {
            updateCard();
            card.classList.add(direction); // Apply sliding effect
            setTimeout(() => {
                card.classList.remove(direction); // Clean up transition class for next interaction
                card.style.opacity = '1'; // Reveal the updated card
            }, 500); // Match this delay with your slide animation duration
        }, 100); // Short delay to ensure opacity transition is applied
    }

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 37) { // Left arrow key
            previousCard();
        } else if (event.keyCode === 39) { // Right arrow key
            nextCard();
        } else if (event.keyCode === 32) { // Space bar
            flipCard();
            event.preventDefault(); // Prevent default action (scrolling)
        }
    });