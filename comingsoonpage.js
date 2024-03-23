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
  console.log('Login attempted by: ' + username); // Replace with actual login logic
  document.getElementById('loginModal').style.display = 'none';
});
