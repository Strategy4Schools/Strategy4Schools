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
});