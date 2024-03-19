    let currentCard = 0;
    let flashcards = [];
    let isShuffled = false;

    // Fetch your flashcards data
    fetch('https://raw.githubusercontent.com/Strategy4Schools/Strategy4Schools/main/5_Letter_Words_CSW21_With_Definitions.json')
    .then(response => response.json())
    .then(data => {
        flashcards = data;
        updateCard(); // Initialize the first card
    });

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
