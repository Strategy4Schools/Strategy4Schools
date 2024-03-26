document.addEventListener('DOMContentLoaded', function() {
    const favoritesTableBody = document.querySelector('#favoritesTable tbody');
    const favorites = JSON.parse(localStorage.getItem('gameFavorites')) || [];

    function deleteWord(index) {
        if (confirm('Are you sure you want to delete this word?')) {
            favorites.splice(index, 1);
            localStorage.setItem('gameFavorites', JSON.stringify(favorites));
            populateTable(); // Re-populate the table
        }
    }

    function populateTable() {
        favoritesTableBody.innerHTML = ''; // Clear the table first

        if (favorites.length === 0) {
            let row = document.createElement('tr');
            row.innerHTML = '<td colspan="2">No favorite words added yet.</td>';
            favoritesTableBody.appendChild(row);
        } else {
            favorites.forEach((item, index) => {
                let row = document.createElement('tr');
                row.innerHTML = `<td>${item.word}</td><td>${item.definition}</td>`;
                let deleteCell = document.createElement('td');
                let deleteButton = document.createElement('button');
                deleteButton.className = 'deleteBtn';
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.onclick = () => deleteWord(index);
                deleteCell.appendChild(deleteButton);
                row.appendChild(deleteCell); // Append the delete cell to the row
                favoritesTableBody.appendChild(row);
            });
        }
    }

    populateTable();
});

function addToFlashcard() {
    // Placeholder for adding the word to flashcard
    console.log(`Add ${currentWord} to Flashcard clicked`);
    document.getElementById('customContextMenu').style.display = 'none';
}
// The addToFlashcard function needs to be updated to handle the action based on `currentWord`.
// Remember to define any additional logic or variables needed to make use of `currentWord` in your addToFlashcard implementation.
