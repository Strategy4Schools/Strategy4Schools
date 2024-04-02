document.addEventListener('DOMContentLoaded', function() {
    const categories = ['Year 7-8', 'Year 9-10', 'Year 11'];
    const categoriesList = document.getElementById('categories-list');

    categories.forEach(category => {
        let listItem = document.createElement('li');
        listItem.textContent = category;
        listItem.addEventListener('click', function() {
            // Adjusted URL path to match the actual location of your files
            window.location.href = `/${category.toLowerCase().replace(/\s+/g, '-')}.html`;
        });
        categoriesList.appendChild(listItem);
    });

        // Find the buttons by their IDs
    const viewFlashcardsBtn = document.getElementById('view-flashcards');
    const makeNewFlashcardBtn = document.getElementById('make-new-flashcard');

    // Event listener for 'View Flashcards' button
    viewFlashcardsBtn.addEventListener('click', function() {
        window.location.href = '/view-flashcards.html'; // Adjust URL as necessary
    });

    // Event listener for 'Make New Flashcard' button
    makeNewFlashcardBtn.addEventListener('click', function() {
        window.location.href = '/make-new-flashcard.html'; // Adjust URL as necessary
    });
});