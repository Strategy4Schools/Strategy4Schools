window.onscroll = function() {
  scrollFunction();
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollFunction() {
  var backToTopBtn = document.getElementById("back-to-top-btn");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
}


var mainModal = document.getElementById("loginModal");
var teacherModal = document.getElementById("teacherLoginForm");
var studentModal = document.getElementById("studentLoginForm");

var btn = document.getElementById("login-btn");
var teacherBtn = document.getElementById("teacher-login");
var studentBtn = document.getElementById("student-login");

var spans = document.getElementsByClassName("close");

// Main login button opens the first modal
btn.onclick = function() {
    mainModal.style.display = "block";
}

// Each button in the main modal opens the corresponding login modal
teacherBtn.onclick = function() {
    mainModal.style.display = "none";
    teacherModal.style.display = "block";
}
studentBtn.onclick = function() {
    mainModal.style.display = "none";
    studentModal.style.display = "block";
}


document.getElementById('hero-student-login').addEventListener('click', function() {
    mainModal.style.display = "none";
    studentModal.style.display = "block";
});

document.getElementById('hero-teacher-login').addEventListener('click', function() {
    mainModal.style.display = "none";
    teacherModal.style.display = "block";
});



// Close modals
for (var i = 0; i < spans.length; i++) {
    spans[i].onclick = function() {
        this.parentElement.parentElement.style.display = "none";
    }
}

// Close modals when clicking outside of them
window.onclick = function(event) {
    if (event.target == mainModal) {
        mainModal.style.display = "none";
    } else if (event.target == teacherModal) {
        teacherModal.style.display = "none";
    } else if (event.target == studentModal) {
        studentModal.style.display = "none";
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



document.addEventListener('DOMContentLoaded', function() {
  AOS.init();
});


function toggleFaq(id) {
    var answer = document.getElementById(id);
    var question = answer.previousElementSibling;

    // Toggle answer display
    answer.style.display = (answer.style.display === "block" ? "none" : "block");

    // Toggle question styles
    if (answer.style.display === "block") {
        question.classList.add("active");
    } else {
        question.classList.remove("active");
    }
}


document.addEventListener('DOMContentLoaded', function() {
  // Hide all FAQ answers on page load
  var faqAnswers = document.querySelectorAll('.faq-answer');
  faqAnswers.forEach(function(answer) {
    answer.style.display = 'none';
  });
  // ... other initialization code
});
