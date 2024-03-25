document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addFilter').addEventListener('click', addFilter);
    bindFilterTypeChange(document.querySelector('.filterType'));
    document.getElementById('searchButton').addEventListener('click', searchWords);
});

function bindFilterTypeChange(selector) {
    selector.addEventListener('change', function(event) {
        updateFilterOptions(event);
    });
}

const updateFilterOptions = (event) => {
    const filterType = event.target.value;
    const filterOptionsContainer = event.target.closest('.filter').querySelector('.filterOptions');
    filterOptionsContainer.innerHTML = ''; // Reset the filter options based on selection

    switch (filterType) {
        case 'wordType':
            // Create a new select element for word types
            const wordTypeSelect = document.createElement('select');
            wordTypeSelect.className = 'wordType';
            // Option values for different word types
            const wordTypes = ['Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun', 'Preposition', 'Conjunction', 'Interjection'];
            wordTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.toLowerCase();
                option.textContent = type;
                wordTypeSelect.appendChild(option);
            });
            filterOptionsContainer.appendChild(wordTypeSelect);
            break;
        case 'wordLength':
            const wrapper = document.createElement('div');
            wrapper.className = 'wordLengthWrapper';

            const inputMinLength = document.createElement('input');
            inputMinLength.type = 'number';
            inputMinLength.placeholder = 'Min Length';
            inputMinLength.className = 'wordLengthMin';
            inputMinLength.min = "0";

            const inputMaxLength = document.createElement('input');
            inputMaxLength.type = 'number';
            inputMaxLength.placeholder = 'Max Length';
            inputMaxLength.className = 'wordLengthMax';
            inputMaxLength.min = "0";

            wrapper.appendChild(inputMinLength);
            wrapper.appendChild(inputMaxLength);

            filterOptionsContainer.appendChild(wrapper);
            break;
        case 'anagramMatch':
            const inputAnagram = document.createElement('input');
            inputAnagram.type = 'text';
            inputAnagram.placeholder = 'Anagram Match';
            inputAnagram.className = 'anagramMatch';
            filterOptionsContainer.appendChild(inputAnagram);
            break;
    }
};

function addFilter(event) {
    event.preventDefault();
    const filtersContainer = document.getElementById('filters');
    const newFilter = document.createElement('div');
    newFilter.className = 'filter';
    newFilter.innerHTML = `
        <button class="removeThisFilter">-</button>
        <select class="filterType">
            <option value="anagramMatch">Anagram Match</option>
            <option value="wordType">Word Type</option>
            <option value="wordLength">Word Length</option>
        </select>
        <div class="filterOptions">
            <input type="text" class="anagramMatch" placeholder="Anagram Match#">
        </div>
    `;
    filtersContainer.appendChild(newFilter);
    bindFilterTypeChange(newFilter.querySelector('.filterType'));
    bindRemoveFilter(newFilter.querySelector('.removeThisFilter'));
}

function bindRemoveFilter(button) {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const filterToBeRemoved = event.target.closest('.filter');
        filterToBeRemoved.remove();
    });
}

const searchWords = async () => {
    console.log("Search initiated");
    const response = await fetch(`http://localhost:7800/CSW21%20Dictionary.json`);
    const data = await response.json();

    const filters = document.querySelectorAll('.filter');
    let filteredWords = data.filter(entry => applyFilters(entry, filters));

    // Prepare table structure if not already present
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `<table>
        <thead>
            <tr>
                <th>Word</th>
                <th>Definition</th>
                <th>Type</th>
            </tr>
        </thead>
        <tbody>
            ${filteredWords.map(word => `
                <tr>
                    <td>${word.word}</td>
                    <td>${word.definition}</td>
                    <td>${word.type}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
};

function applyFilters(entry, filters) {
    return Array.from(filters).every(filter => {
        const filterType = filter.querySelector('.filterType').value;
        const filterOptionsContainer = filter.querySelector('.filterOptions');

        if (filterType === 'wordType') {
            const selectedType = filterOptionsContainer.querySelector('.wordType').value;
            return selectedType === 'all' || entry.type === selectedType;
        } else if (filterType === 'wordLength') {
            const minLengthValue = parseInt(filterOptionsContainer.querySelector('.wordLengthMin').value, 10) || 0;
            const maxLengthValue = parseInt(filterOptionsContainer.querySelector('.wordLengthMax').value, 10) || Number.MAX_SAFE_INTEGER;
            return entry.word.length >= minLengthValue && entry.word.length <= maxLengthValue;
        } else if (filterType === 'anagramMatch') {
            const anagramInput = filterOptionsContainer.querySelector('.anagramMatch').value.toUpperCase();
            const anagramValue = anagramInput.split('').sort().join('');
            const entryWordSorted = entry.word.toUpperCase().split('').sort().join('');
            return anagramInput === '' || anagramValue === entryWordSorted;
        }
        return true;
    });
}

// Function to clear previous warnings
function clearWarnings() {
    const existingWarnings = document.querySelectorAll('.warning-icon');
    existingWarnings.forEach(icon => icon.remove());
}

// Function to validate filters and add warning icons as needed
function validateFilters() {
    clearWarnings(); // Clear existing warnings first

    document.querySelectorAll('.filter').forEach(filter => {
        const input = filter.querySelector('input');
        // Example validation: check if input is not empty
        if (input && input.value.trim() === '') {
            const warningIcon = document.createElement('span');
            warningIcon.className = 'warning-icon';
            warningIcon.textContent = '!';
            filter.appendChild(warningIcon);
        }
    });
}

// Modify your searchWords function or the event listener for the search button to include validation
document.getElementById('searchButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the form from submitting if using a form
    validateFilters();
    // Proceed with the search if validation passes
});