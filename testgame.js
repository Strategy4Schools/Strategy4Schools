document.addEventListener('DOMContentLoaded', function() {
    const difficultyButtons = {
        easy: document.getElementById('easy'),
        medium: document.getElementById('medium'),
        hard: document.getElementById('hard')
    };

    const gameBoard = document.getElementById('game-board');
    const difficultySelection = document.getElementById('difficultySelectionContainer');

    // Bind event listeners to difficulty buttons
    Object.keys(difficultyButtons).forEach(difficulty => {
        difficultyButtons[difficulty].addEventListener('click', function() {
            startGameWithDifficulty(difficulty);
        });
    });

    function startGameWithDifficulty(difficulty) {
        // Assuming all cards are in one JSON, separated by difficulty
        const path = `test_game_word_list_easy.json`; // JSON file path based on difficulty
        fetch(path)
            .then(response => response.json())
            .then(data => {
                setupBoard(data.cards);
                gameBoard.style.display = 'block'; // Show the game board
                difficultySelection.style.display = 'none'; // Hide the difficulty selection
            })
            .catch(error => console.error('Failed to fetch cards:', error));
    }

    function setupBoard(cardsArray) {
        shuffleArray(cardsArray); // Shuffle cards
        gameBoard.innerHTML = '';
        cardsArray.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.id = card.id;
            cardElement.dataset.type = card.type;
            cardElement.innerText = card.content;
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
        } else {
            hasFlippedCard = false;
            secondCard = this;
            checkForMatch();
        }
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.id === secondCard.dataset.id;

        if (isMatch) {
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            resetBoard();
        } else {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove('flip');
                secondCard.classList.remove('flip');
                resetBoard();
            }, 1500);
        }
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard, firstCard, secondCard] = [false, false, null, null];
    }
});
