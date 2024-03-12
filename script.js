// Get the modal
var modal = document.getElementById("loginModal");

// Get the button that opens the modal
var btn = document.getElementById("login-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Login validation and redirection
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission behavior

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if(username === 'dariusjeong' && password === 'dariusjeong') {
        // Redirect to mini-games homepage upon successful login
        window.location.href = 'minigames_home.html';
    } else {
        // Display error message if login fails
        document.getElementById('loginError').textContent = 'Invalid username or password';
    }
});

// Service worker registration (if applicable)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    var subscribeButton = document.getElementById('subscribe-btn');
    if (subscribeButton) {
        subscribeButton.addEventListener('click', function() {
            window.location.href = 'http://www.example.com/subscribe';
        });
    }
});
