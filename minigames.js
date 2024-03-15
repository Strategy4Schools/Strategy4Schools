document.addEventListener('DOMContentLoaded', function() {
  const games = [
    { name: "Anagram Adventures", url: "anagram_game.html" },
    { name: "Word Quest", url: "WordQuest.html" },
    // Add more games here
  ];

  function setCurrentUserProfilePic() {
  // This is a mock function; replace with the actual code to get the user's profile picture URL.
  const getCurrentUserProfilePic = () => "path_to_current_user's_profile_pic.jpg";

  // Get the profile picture element by its class name.
  const profilePicElement = document.querySelector('.dropdown-avatar');
  
  // Set the 'src' attribute of the profile picture to the URL from the getCurrentUserProfilePic function.
  profilePicElement.src = getCurrentUserProfilePic();
}

// Call this function on page load or when the user's profile picture changes.
setCurrentUserProfilePic();


  function searchGames() {
    const searchInput = document.getElementById('gameSearch').value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'none';

    document.getElementById('searchButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission if wrapped in a form
    searchGames();
});


    if (searchInput.length > 0) {
        var filteredGames = games.filter(game => game.name.toLowerCase().includes(input));
        
        if (filteredGames.length > 0) {
            resultsContainer.style.display = 'block';
            filteredGames.forEach(game => {
                var resultItem = document.createElement('div');
                resultItem.textContent = game.name;
                resultItem.onclick = function() {
                    window.location.href = game.url; // Navigate to the game page on click
                };
                resultsContainer.appendChild(resultItem);
            });
        }
    }
}