document.addEventListener("DOMContentLoaded", function() {
    let hasIncorrectAttempt = false; // Track if an incorrect attempt has been made
    let currentWord = ''; // To store the correct word for validation in the popup
    showIntroScreen(); // Show the intro screen first

    async function fetchWords() {
        try {
            const response = await fetch('http://localhost:8000/MisspellManiaWordList.json');
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

    function showIntroScreen() {
    const introScreen = document.createElement('div');
    introScreen.id = 'introScreen';
    introScreen.style.position = 'fixed';
    introScreen.style.top = '0';
    introScreen.style.left = '0';
    introScreen.style.width = '100%';
    introScreen.style.height = '100%';
    introScreen.style.display = 'flex';
    introScreen.style.flexDirection = 'column';
    introScreen.style.justifyContent = 'center';
    introScreen.style.alignItems = 'center';
    introScreen.style.background = 'linear-gradient(to bottom, #243A4E 0%, #2D4A61 50%, #364E70 100%)';
    introScreen.innerHTML = `
        <h2>Welcome to Misspell Mania!</h2>
        <p>Test your spelling skills by choosing the correctly spelled word based on its definition.</p>
        <button id="playNowButton">Play Now</button>
    `;
    
    document.body.appendChild(introScreen);
    
    document.getElementById('playNowButton').addEventListener('click', function() {
        introScreen.style.display = 'none';
        fetchWords(); // Start the game after hiding the intro screen
    });
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
        <input type="text" id="userInput" placeholder="Type here" />
        <button id="submitWord">Submit</button>
        <div id="clickReveal" style="margin-top: 10px; cursor: pointer;">
            <p>Click here to reveal the correct answer</p>
            <div id="revealAnswer" style="display:none;">${correctWord}</div>
        </div>
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
            alert('Incorrect. Please try again or click to reveal the answer.');
            document.getElementById('clickReveal').style.display = 'block'; // Show the click to reveal section
        }
    });

    // Setup click to reveal
    document.getElementById('clickReveal').addEventListener('click', function() {
        document.getElementById('revealAnswer').style.display = 'block';
        // Optional: disable further clicks to prevent hiding the answer
        this.style.pointerEvents = 'none'; 
    });
}
    
    fetchWords(); // Start the game by fetching the words
});
