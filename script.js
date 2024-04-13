import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail // Added to the list of imports from firebase-auth
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
    let email, password, redirectUrl;
    if (userType === 'student') {
        email = document.getElementById('student-login-email').value;
        password = document.getElementById('student-login-password').value;
        redirectUrl = 'user_landing_page.html'; // URL for student dashboard
    } else if (userType === 'teacher') {
        email = document.getElementById('teacher-login-email').value;
        password = document.getElementById('teacher-login-password').value;
        redirectUrl = 'teacher-dashboard.html'; // URL for teacher dashboard
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Login successful:', userCredential.user);
            window.location.href = redirectUrl; // Redirect based on user type
        })
        .catch((error) => {
            console.error('Error logging in:', error.message);
        });
}

document.getElementById('reset-password-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('reset-password-email').value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log('Reset link sent to your email address');
            alert('Reset link sent to your email address');
            // Close the modal and clear the form
            document.getElementById('reset-password-modal').style.display = 'none';
            document.getElementById('reset-password-email').value = '';
        })
        .catch((error) => {
            console.error('Error sending reset email:', error);
            alert('Error sending reset email, please check the email address and try again');
        });
});


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

// Login button event listener
document.getElementById('login-btn').addEventListener('click', function() {
    document.getElementById('login-choice-modal').style.display = 'block';
});


document.addEventListener('DOMContentLoaded', function() {
    // Get the modal elements
    var studentLoginModal = document.getElementById('student-login-modal');
    var teacherLoginModal = document.getElementById('teacher-login-modal');
    var loginChoiceModal = document.getElementById('login-choice-modal');

    // Function to show student login modal
    function showStudentLoginModal() {
        studentLoginModal.style.display = 'block';
        loginChoiceModal.style.display = 'none'; // Hide the choice modal
    }

    // Function to show teacher login modal
    function showTeacherLoginModal() {
        teacherLoginModal.style.display = 'block';
        loginChoiceModal.style.display = 'none'; // Hide the choice modal
    }

    // Get the buttons within the login choice modal
    var teacherLoginBtnChoice = document.querySelector('#login-choice-modal button[onclick="showTeacherLoginModal()"]');
    var studentLoginBtnChoice = document.querySelector('#login-choice-modal button[onclick="showStudentLoginModal()"]');

    // Remove inline onclick attributes and add event listeners
    if (teacherLoginBtnChoice && studentLoginBtnChoice) {
        teacherLoginBtnChoice.removeAttribute('onclick');
        studentLoginBtnChoice.removeAttribute('onclick');

        teacherLoginBtnChoice.addEventListener('click', showTeacherLoginModal);
        studentLoginBtnChoice.addEventListener('click', showStudentLoginModal);
    }

    // Optional: Hide modals when clicking outside of them
    window.onclick = function(event) {
        if (event.target == studentLoginModal) {
            studentLoginModal.style.display = 'none';
        }
        if (event.target == teacherLoginModal) {
            teacherLoginModal.style.display = 'none';
        }
        if (event.target == loginChoiceModal) {
            loginChoiceModal.style.display = 'none';
        }
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
        // Clear student login inputs
        document.getElementById('student-login-email').value = '';
        document.getElementById('student-login-password').value = '';
    }
    if (event.target == teacherLoginModal) {
        teacherLoginModal.style.display = 'none';
        // Clear teacher login inputs
        document.getElementById('teacher-login-email').value = '';
        document.getElementById('teacher-login-password').value = '';
    }
    if (event.target == resetPasswordModal) {
        resetPasswordModal.style.display = 'none';
        // Clear reset password input
        document.getElementById('reset-password-email').value = '';
    }
}

// Event listener for "Forgot your password?" links
document.querySelectorAll('.forgot-password-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        resetPasswordModal.style.display = 'block';
        studentLoginModal.style.display = 'none';
        teacherLoginModal.style.display = 'none';
        // Clear login form inputs
        document.getElementById('student-login-email').value = '';
        document.getElementById('student-login-password').value = '';
        document.getElementById('teacher-login-email').value = '';
        document.getElementById('teacher-login-password').value = '';
    });
});

    // Track which login modal was last opened
let lastLoginModal = null;

// Adjust the existing button onclick handlers to set the last opened modal
studentLoginBtn.onclick = function() {
    lastLoginModal = studentLoginModal;
    studentLoginModal.style.display = 'block';
}

teacherLoginBtn.onclick = function() {
    lastLoginModal = teacherLoginModal;
    teacherLoginModal.style.display = 'block';
}
// Event listener for the login link in the reset password modal
document.getElementById('login-link').addEventListener('click', function(e) {
    e.preventDefault();
    resetPasswordModal.style.display = 'none';
    if (lastLoginModal) {
        lastLoginModal.style.display = 'block';
    } else {
        studentLoginModal.style.display = 'block'; // default to student modal
    }
    // Clear reset password input
    document.getElementById('reset-password-email').value = '';
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