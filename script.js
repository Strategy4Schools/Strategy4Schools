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
