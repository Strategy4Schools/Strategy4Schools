let selectedWord = null;

document.getElementById('easy').addEventListener('click', () => startGameWithDifficulty('easy'));
document.getElementById('medium').addEventListener('click', () => startGameWithDifficulty('medium'));
document.getElementById('hard').addEventListener('click', () => startGameWithDifficulty('hard'));

function startGameWithDifficulty(difficulty) {
    let wordsListURL;
    switch (difficulty) {
        case 'easy':
            wordsListURL = 'WordMatch_Test_Word_List.json';
            break;
        case 'medium':
            wordsListURL = 'WordMatch_Test_Word_List.json';
            break;
        case 'hard':
            wordsListURL = 'WordMatch_Test_Word_List.json';
            break;
        default:
            console.error('Invalid difficulty level');
            return;
    }

    fetch(wordsListURL)
        .then(response => response.json())
        .then(data => {
            initializeGame(data);
            document.getElementById('difficultySelection').style.display = 'none'; // Hide difficulty buttons
        })
        .catch(error => console.error('Error fetching JSON data:', error));
}

function initializeGame(wordsList) {
    const selectedWords = selectRandomWords(wordsList, 5); // Adjust number of words based on difficulty if needed
    updateGameBoard(selectedWords);

    // Attach event listeners directly without calling a separate function
    document.querySelectorAll('#words p').forEach(word => {
        word.addEventListener('click', wordClickHandler);
    });

    document.querySelectorAll('#definitions div').forEach(definition => {
        definition.addEventListener('click', definitionClickHandler);
    });
}

function wordClickHandler(event) {
    // Ignore clicks if the word is already correctly matched
    if (this.classList.contains('correct')) return;

    resetSelection();
    selectedWord = this;
    this.classList.add('selected');
    drawTemporaryLine(this);
}

function definitionClickHandler(event) {
    if (!selectedWord) return; // Ignore clicks if no word is selected

    // Check if the clicked definition matches the selected word
    if (this.getAttribute('data-word') === selectedWord.id) {
        finalizeLine(selectedWord, this);
        selectedWord.classList.add('correct');
        this.classList.add('correct');
        document.onmousemove = null; // Stop the line from following the cursor
    } else {
        selectedWord.classList.add('incorrect');
        this.classList.add('incorrect', 'shake'); // Add 'shake' class for incorrect match

        // Remove 'shake' class after the animation duration (420 ms)
        setTimeout(() => {
            this.classList.remove('shake');
        }, 420);
    }

    resetSelection();
    selectedWord = null;
}


function selectRandomWords(wordsList, count) {
    let shuffled = wordsList.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function updateGameBoard(selectedWords) {
    let wordsHtml = '';
    let definitionsHtml = '';

    // Generating HTML for words in their original order
    selectedWords.forEach((wordObj, index) => {
        wordsHtml += `<p id="word${index + 1}">${wordObj.word}</p>`;
    });

    // Shuffle only the definitions
    let shuffledDefinitions = [...selectedWords].sort(() => 0.5 - Math.random());

    // Generating HTML for shuffled definitions
    shuffledDefinitions.forEach((wordObj, index) => {
        // Find the index of the wordObj in the original selectedWords array
        let originalIndex = selectedWords.findIndex(w => w.word === wordObj.word);
        definitionsHtml += `<div data-word="word${originalIndex + 1}">${wordObj.definition}</div>`;
    });

    document.getElementById('words').innerHTML = wordsHtml;
    document.getElementById('definitions').innerHTML = definitionsHtml;
}


document.querySelectorAll('#words p').forEach(word => {
    word.addEventListener('click', function(event) {
        // Ignore clicks if the word is already correctly matched
        if (this.classList.contains('correct')) return;

        resetSelection();
        selectedWord = this;
        this.classList.add('selected');
        drawTemporaryLine(this);
    });
});

document.querySelectorAll('#definitions div').forEach(definition => {
    definition.addEventListener('click', function() {
        if (!selectedWord) return; // Ignore clicks if no word is selected

        // Check if the clicked definition matches the selected word
        if (this.getAttribute('data-word') === selectedWord.id) {
            finalizeLine(selectedWord, this);
            selectedWord.classList.add('correct');
            this.classList.add('correct');
            document.onmousemove = null; // Stop the line from following the cursor
        } else {
            selectedWord.classList.add('incorrect');
            this.classList.add('incorrect');
        }

        resetSelection();
        selectedWord = null;
    });
});

function resetSelection() {
    if (selectedWord) {
        selectedWord.classList.remove('selected');
        // Check if line element exists before trying to modify its style
        let lineElem = document.getElementById("line");
        if (lineElem) {
            lineElem.style.display = 'none'; 
        }
    }
    document.onmousemove = null; // Stop updating any temporary line
}


function drawTemporaryLine(wordElement) {
    let line = document.getElementById("line");
    let rect = wordElement.getBoundingClientRect();
    let x1 = rect.left + rect.width / 2;
    let y1 = rect.top + rect.height / 2;

    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x1);
    line.setAttribute('y2', y1);
    line.style.display = 'block';

    document.onmousemove = function(e) {
        line.setAttribute('x2', e.clientX);
        line.setAttribute('y2', e.clientY);
    };
}

function finalizeLine(wordElement, definitionElement) {
    let lineSvg = document.getElementById("lineSvg");
    let wordRect = wordElement.getBoundingClientRect();
    let definitionRect = definitionElement.getBoundingClientRect();

    // Coordinates for the start and end points of the line
    let startX = wordRect.right;
    let startY = wordRect.top + wordRect.height / 2;
    let endX = definitionRect.left;
    let endY = definitionRect.top + definitionRect.height / 2;

    // Create an SVG path for a more flexible line
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${startX} ${startY} L ${endX} ${endY}`);
    path.setAttribute('stroke', '#fff'); // Set the line color to green
    path.setAttribute('stroke-width', '3');
    path.setAttribute('fill', 'none');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    path.setAttribute('class', 'permanent-line');

    lineSvg.appendChild(path);

    wordElement.classList.add('correct');
    definitionElement.classList.add('correct');

    checkCompletion(); // Ensuring this is called after the classes are added
}


function checkCompletion() {
    const totalWords = document.querySelectorAll('#words p').length;
    const totalCorrectMatches = document.querySelectorAll('#words p.correct').length;

    if (totalCorrectMatches === totalWords) {
        showModal();
        // Show the additional Play Again button
        document.getElementById("play-again-bottom").style.display = "block";
    }
}



document.querySelector('.close').addEventListener('click', function() {
    hideModal();
});


function showModal() {
    let modal = document.getElementById("completion-modal");
    modal.style.display = "block";
}

function hideModal() {
    let modal = document.getElementById("completion-modal");
    modal.style.display = "none";
}

// Add event listener to the "Play Again" button
document.getElementById("play-again").addEventListener("click", function() {
    hideModal();
    resetGame();
});

// Function to reset the game
function resetGame() {
    // Clear previous game state
    clearGameState();

    // Fetch new words and reinitialize the game
    fetchNewWords();
}

    function clearGameState() {
    // Remove all existing correct, incorrect, and selected classes
    document.querySelectorAll('#words p, #definitions div').forEach(el => {
        el.classList.remove('correct', 'incorrect', 'selected');
    });

    // Remove all child elements (lines) from the SVG
    let lineSvg = document.getElementById("lineSvg");
    while (lineSvg.firstChild) {
        lineSvg.removeChild(lineSvg.firstChild);
    }

    // Recreate the temporary line and arrowhead elements in the SVG
    createSvgElements();

    // Hide the additional Play Again button
    document.getElementById("play-again-bottom").style.display = "none";

    // Reinitialize the game with a new set of words
    fetch(`http://localhost:8000/Year_7_Word_List_Without_Tags.json`)
        .then(response => response.json())
        .then(data => {
            initializeGame(data);
        })
        .catch(error => console.error('Error fetching JSON data:', error));
}


// Ensure 'Play Again' button calls resetGame
document.getElementById("play-again").addEventListener("click", resetGame);
document.getElementById("play-again-bottom").addEventListener("click", resetGame);

// Function to recreate SVG elements
function createSvgElements() {
    let lineSvg = document.getElementById("lineSvg");

    // Recreate the line element
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('id', 'line');
    line.setAttribute('x1', '0');
    line.setAttribute('y1', '0');
    line.setAttribute('x2', '0');
    line.setAttribute('y2', '0');
    line.style.stroke = 'rgb(255,0,0)';
    line.style.strokeWidth = '2';
    line.style.display = 'none';
    lineSvg.appendChild(line);

    // Recreate the arrowhead marker
    let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    let marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '0');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');

    let polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.style.fill = '#fff';

    marker.appendChild(polygon);
    defs.appendChild(marker);
    lineSvg.appendChild(defs);
}

// Call createSvgElements when the page loads to initialize the SVG elements
createSvgElements();

// Add event listener to the new Play Again button
document.getElementById("play-again-bottom").addEventListener("click", function() {
    resetGame();
});

document.querySelectorAll('#definitions div').forEach(definition => {
    definition.addEventListener('click', function() {
        if (!selectedWord) return; // Ignore clicks if no word is selected

        // If it's a wrong match
        if (this.getAttribute('data-word') !== selectedWord.id) {
            selectedWord.classList.add('incorrect', 'shake');
            this.classList.add('incorrect', 'shake');

            // Remove 'shake' class after the animation duration (820 ms)
            setTimeout(() => {
                selectedWord.classList.remove('shake');
                this.classList.remove('shake');
            }, 820);
        } else {
            // If it's a correct match
            finalizeLine(selectedWord, this);
            selectedWord.classList.add('correct');
            this.classList.add('correct');
            document.onmousemove = null;
        }

        resetSelection();
        selectedWord = null;
    });
});