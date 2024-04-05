document.addEventListener('DOMContentLoaded', function() {
    const allFeaturedGames = [
        [
            { name: "Anagrammable", url: "anagrammable.html", img: "anagrammable_thumbnail_url" },
            { name: "WordGuess", url: "WordGuess.html", img: "wordguess_thumbnail_url" },
            { name: "Flashcards", url: "flashcardscategories.html", img: "flashcards_thumbnail_url" }
        ],
        [
            { name: "Game 4", url: "game4.html", img: "game4_thumbnail_url" },
            { name: "Game 5", url: "game5.html", img: "game5_thumbnail_url" },
            { name: "Game 6", url: "game6.html", img: "game6_thumbnail_url" }
        ]
        // ... Add more sets as needed
    ];

    let currentSetIndex = 0;
    const featuredGamesContainer = document.querySelector('.featuredgames-container');
    const maskWidth = document.querySelector('.featured-games-mask').offsetWidth;

    function updateInfoIcons() {
    // Remove existing event listeners for all info icons
    const allInfoIcons = document.querySelectorAll('.info-icon');
    allInfoIcons.forEach(icon => {
        icon.removeEventListener('mouseover', infoIconMouseover);
        icon.removeEventListener('mouseout', infoIconMouseout);
    });

    // Attach event listeners only to info icons in the current set of featured games
    const currentSetInfoIcons = document.querySelectorAll('.featuredgames-container .info-icon');
    currentSetInfoIcons.forEach(icon => {
        icon.addEventListener('mouseover', infoIconMouseover);
        icon.addEventListener('mouseout', infoIconMouseout);
    });

}
    // Mouseover event handler for info icon
    function infoIconMouseover(event) {
        const infoText = event.target.nextElementSibling;
        if (infoText && infoText.classList.contains('info-text')) {
            infoText.style.display = 'block';
        }
    }

    // Mouseout event handler for info icon
    function infoIconMouseout(event) {
        const infoText = event.target.nextElementSibling;
        if (infoText && infoText.classList.contains('info-text')) {
            infoText.style.display = 'none';
        }
    }

    // Function to slide featured games to the left or right
    function slideFeaturedGames(direction) {
    const maskWidth = document.querySelector('.featured-games-mask').offsetWidth;

    if (direction === 'left' && currentSetIndex > 0) {
        currentSetIndex--;
    } else if (direction === 'right' && currentSetIndex < allFeaturedGames.length - 1) {
        currentSetIndex++;
    }

    const newTransformValue = -(currentSetIndex * maskWidth);
    featuredGamesContainer.style.transform = `translateX(${newTransformValue}px)`;

    featuredGamesContainer.addEventListener('transitionend', updateInfoIcons, { once: true });
}


    // Attach event listeners to arrow buttons
    document.getElementById('left-arrow').addEventListener('click', function() {
        slideFeaturedGames('left');
    });

    document.getElementById('right-arrow').addEventListener('click', function() {
        slideFeaturedGames('right');
    });

    // Initial setup for info icons
    updateInfoIcons();
});




document.addEventListener('scroll', function() {
  var featuredGamesTitle = document.querySelector('#featured-games h2');
  var featuredGamesContainer = document.querySelector('.featured-games-mask');

  var titlePosition = featuredGamesTitle.getBoundingClientRect().top;
  var containerPosition = featuredGamesContainer.getBoundingClientRect().top;
  var screenPosition = window.innerHeight / 1.3;

  if (titlePosition < screenPosition && containerPosition < screenPosition) {
    featuredGamesTitle.style.opacity = '1'; // Trigger the animation
    featuredGamesContainer.style.opacity = '1'; // Trigger the animation
  }
});