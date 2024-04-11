import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyBIdvoYCGYNV1_rG9JdNtz_Q1iA66k9I6o",
  authDomain: "strategy4schoolsdb.firebaseapp.com",
  projectId: "strategy4schoolsdb",
  storageBucket: "strategy4schoolsdb.appspot.com",
  messagingSenderId: "125952142437",
  appId: "1:125952142437:web:11d221ac797be1c3e0ea8c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function login(userType) {
    let email, password;
    if (userType === 'student') {
        email = document.getElementById('student-login-email').value;
        password = document.getElementById('student-login-password').value;
    } else if (userType === 'teacher') {
        email = document.getElementById('teacher-login-email').value;
        password = document.getElementById('teacher-login-password').value;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Login successful:', userCredential.user);
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error('Error logging in:', error.message);
        });
}

document.getElementById('student-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    login('student');
});

document.getElementById('teacher-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    login('teacher');
});


document.addEventListener('DOMContentLoaded', function() {
    var subscribeButton = document.getElementById('subscribe-btn');
    if (subscribeButton) {
        subscribeButton.addEventListener('click', function() {
            window.location.href = 'http://www.example.com/subscribe';
        });
    }
});

// Modals
var studentLoginModal = document.getElementById('student-login-modal');
var teacherLoginModal = document.getElementById('teacher-login-modal');
var resetPasswordModal = document.getElementById('reset-password-modal'); // New reset password modal

var studentLoginBtn = document.getElementById('student-login-btn');
var teacherLoginBtn = document.getElementById('teacher-login-btn');

studentLoginBtn.onclick = function() {
    studentLoginModal.style.display = 'block';
}

teacherLoginBtn.onclick = function() {
    teacherLoginModal.style.display = 'block';
}

window.onclick = function(event) {
    if (event.target == studentLoginModal) {
        studentLoginModal.style.display = 'none';
    }
    if (event.target == teacherLoginModal) {
        teacherLoginModal.style.display = 'none';
    }
    if (event.target == resetPasswordModal) {
        resetPasswordModal.style.display = 'none'; // Close reset password modal when clicking outside
    }
}

// Add event listener to "Forgot your password?" links
document.querySelectorAll('.forgot-password-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        studentLoginModal.style.display = 'none';
        teacherLoginModal.style.display = 'none';
        resetPasswordModal.style.display = 'block'; // Display the reset password modal
    });
});

function toggleFaq(id) {
    var answer = document.getElementById(id);
    var question = answer.previousElementSibling;
    answer.style.display = (answer.style.display === "block" ? "none" : "block");
    if (answer.style.display === "block") {
        question.classList.add("active");
    } else {
        question.classList.remove("active");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var faqAnswers = document.querySelectorAll('.faq-answer');
    faqAnswers.forEach(function(answer) {
        answer.style.display = 'none';
    });
});
