document.addEventListener('DOMContentLoaded', function() {
    const favoritesTableBody = document.querySelector('#favoritesTable tbody');
    const deleteSelectedButton = document.getElementById('deleteSelected');
    let favorites = JSON.parse(localStorage.getItem('gameFavorites')) || [];

    // Function to update the delete button text based on selection
    function updateDeleteButtonText() {
        const selectedCheckboxes = document.querySelectorAll('.selectBox:checked');
        const selectedCount = selectedCheckboxes.length;
        deleteSelectedButton.innerText = selectedCount > 0 ? `Delete ${selectedCount} Word${selectedCount > 1 ? 's' : ''}` : 'Delete Selected';
        deleteSelectedButton.style.display = selectedCount > 0 ? 'block' : 'none';
    }

    // Add event listener for checkbox changes to update the button text
    document.addEventListener('change', function(e) {
        if (e.target.matches('.selectBox')) {
            updateDeleteButtonText();
        }
    });

    function deleteWord(index) {
        if (confirm('Are you sure you want to delete this word?')) {
            favorites.splice(index, 1);
            localStorage.setItem('gameFavorites', JSON.stringify(favorites));
            populateTable(); // Re-populate the table
        }
    }

    function deleteSelectedWords() {
        const selectedCheckboxes = document.querySelectorAll('.selectBox:checked');
        const indexesToDelete = Array.from(selectedCheckboxes).map(checkbox => parseInt(checkbox.getAttribute('data-index')));

        if (indexesToDelete.length > 0 && confirm(`Are you sure you want to delete ${indexesToDelete.length} selected word(s)?`)) {
            // Sort indexes in descending order to avoid indexing issues while deleting
            indexesToDelete.sort((a, b) => b - a);
            indexesToDelete.forEach(index => {
                favorites.splice(index, 1);
            });
            localStorage.setItem('gameFavorites', JSON.stringify(favorites));
            populateTable();
        }
    }

    function populateTable() {
        favoritesTableBody.innerHTML = ''; // Clear the table first

        if (favorites.length === 0) {
            let row = document.createElement('tr');
            row.innerHTML = '<td colspan="4">No favorite words added yet.</td>';
            favoritesTableBody.appendChild(row);
        } else {
            favorites.forEach((item, index) => {
                let row = document.createElement('tr');
                row.innerHTML = `<td><input type="checkbox" class="selectBox" data-index="${index}"></td><td>${item.word}</td><td>${item.definition}</td>`;
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

    populateTable(); // Initial table population
    deleteSelectedButton.addEventListener('click', deleteSelectedWords);
    updateDeleteButtonText(); // Initial update in case of page reload with selected items
});

function addToFlashcard() {
    const selectedWords = document.querySelectorAll('.selectBox:checked');
    selectedWords.forEach(box => {
        const index = box.getAttribute('data-index');
        console.log(`Add word at index ${index} to Flashcard`);
        // Implement the logic to actually add the word to a flashcard here
    });
    // Hide context menu
    document.getElementById('customContextMenu').style.display = 'none';
}
