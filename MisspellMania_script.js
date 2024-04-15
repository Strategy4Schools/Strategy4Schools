document.addEventListener("DOMContentLoaded", function() {
    let hasIncorrectAttempt = false; // Track if an incorrect attempt has been made
    let currentWord = ''; // To store the correct word for validation in the popup

    async function fetchWords() {
        try {
            const response = await fetch('MisspellManiaWordList.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const definitions = await response.json();
            setupGame(definitions);
        } catch (error) {
            console.error("Failed to fetch words:", error);
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

function setupGame(definitions) {
    hasIncorrectAttempt = false; // Reset for new question
    const currentQuestion = definitions[Math.floor(Math.random() * definitions.length)];
    currentWord = currentQuestion.word; // Store the correct word
    document.getElementById('definition').textContent = currentQuestion.definition;

    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = ''; // Clear feedback text

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = ''; // Clear previous options
    // Style the container to center buttons
    optionsContainer.style.display = 'flex';
    optionsContainer.style.flexDirection = 'column';
    optionsContainer.style.alignItems = 'center';
    optionsContainer.style.justifyContent = 'center';

    shuffleArray(currentQuestion.options);

    currentQuestion.options.forEach(function(option) {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.style.backgroundColor = ''; // Reset button color
        // Set max width and height
        button.style.maxWidth = '150px'; // Adjust as necessary
        button.style.maxHeight = '50px'; // Adjust as necessary
        button.style.padding = '10px 20px'; // Provide some padding for text
        button.style.margin = '5px'; // Add some space between buttons
        button.style.fontSize = '1rem'; // Adjust font size as necessary
        button.addEventListener('click', function() {
        if(option === currentQuestion.word) {
            button.style.backgroundColor = 'green';
            feedbackElement.textContent = "Correct!";
            feedbackElement.style.color = "green";

                const allOptionButtons = document.querySelectorAll('.option-button');
            allOptionButtons.forEach(function(button) {
                button.disabled = true;
            });
                if (hasIncorrectAttempt) {
                    showDefinitionPopup(currentQuestion.definition, currentQuestion.word, definitions);
                } else {
                    showNextButton(definitions); // Show next button if no incorrect attempts
                }
            } else {
                if (!hasIncorrectAttempt) { // Mark incorrect attempt if not already marked
                    hasIncorrectAttempt = true;
                    button.style.backgroundColor = 'red';
                    feedbackElement.textContent = "Incorrect, try again!";
                    feedbackElement.style.color = "red";
                }
            }
        });

        optionsContainer.appendChild(button);
    });
}

    function showNextButton(definitions) {
        let nextButton = document.getElementById('nextButton');
        if (!nextButton) {
            nextButton = document.createElement('button');
            nextButton.id = 'nextButton';
            nextButton.textContent = 'Next Question';
            document.body.appendChild(nextButton);
        }

        nextButton.style.display = 'block';

        nextButton.onclick = function() {
            setupGame(definitions);
            this.style.display = 'none';
        };
    }

function showDefinitionPopup(definition, correctWord, definitions) {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.style.display = 'none'; // Hide game elements

    const popupContainer = document.createElement('div');
    popupContainer.id = 'wordPopup';
    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '50%';
    popupContainer.style.left = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.backgroundColor = '#243A4E';
    popupContainer.style.padding = '20px';
    popupContainer.style.borderRadius = '10px';
    popupContainer.style.zIndex = '1000';
    popupContainer.style.color = 'white';
    popupContainer.innerHTML = `
        <h3>Please type the previous word</h3>
        <p><strong>Definition:</strong> ${definition}</p>
        <input type="text" id="userInput" placeholder="Type here" autocomplete="off" spellcheck="false" />
        <div><button id="submitWord">Submit</button></div>
        <div id="revealButtonContainer" style="margin-top: 10px;">
            <button id="revealButton">Hold to reveal answer</button>
        </div>
        <div id="revealAnswer" style="display:none; margin-top: 10px;">${correctWord}</div>
    `;

    document.body.appendChild(popupContainer);

    // Hide the popup and show the game elements again when the correct word is submitted
    document.getElementById('submitWord').addEventListener('click', function() {
        const userInput = document.getElementById('userInput').value;
        if (userInput.trim().toLowerCase() === correctWord.toLowerCase()) {
            document.body.removeChild(popupContainer); // Remove popup
            gameContainer.style.display = 'block'; // Show game elements again
            showNextButton(definitions); // Move to next question
        } else {
            alert('Incorrect. Please try again or hold the button to reveal the answer.');
        }
    });

    // Setup hold to reveal
    const revealButton = document.getElementById('revealButton');
    const revealAnswer = document.getElementById('revealAnswer');
    const revealButtonContainer = document.getElementById('revealButtonContainer');

    revealButton.addEventListener('mousedown', function() {
        revealButtonContainer.style.display = 'none';
        revealAnswer.style.display = 'block';
    });
    revealButton.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevents mobile browsers from triggering click after touchend
        revealButtonContainer.style.display = 'none';
        revealAnswer.style.display = 'block';
    });
    document.addEventListener('mouseup', function() {
        revealButtonContainer.style.display = 'block';
        revealAnswer.style.display = 'none';
    });
    document.addEventListener('touchend', function() {
        revealButtonContainer.style.display = 'block';
        revealAnswer.style.display = 'none';
    });
}
    
    fetchWords(); // Start the game by fetching the words
});