document.getElementById('loginBtn').addEventListener('click', function() {
  document.getElementById('loginModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
  document.getElementById('loginModal').style.display = 'none';
});

window.onclick = function(event) {
  if (event.target == document.getElementById('loginModal')) {
    document.getElementById('loginModal').style.display = 'none';
  }
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  if(username === 'dariusjeong' && password === 'dariusjeong') {
    // Redirect to minigames_home.html if login is successful
    window.location.href = 'minigames_home.html';
  } else {
    // Optional: Display an error message or handle incorrect login
    console.log('Incorrect username or password');
  }
});
