document.addEventListener('DOMContentLoaded', function() {
    // Query all navigation buttons
    const navigationButtons = document.querySelectorAll('.navigation-button');

    // Add click event listener to each button
    navigationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Redirect based on the button's data-target attribute
            const targetPage = this.getAttribute('data-target');
            if(targetPage) {
                window.location.href = targetPage;
            } else {
                console.error('No target defined for this button');
            }
        });
    });
});
