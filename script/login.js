const form = document.getElementById("authForm");
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  
if (!isValidUsername(username)) {
  alert('username must be at least 3 characters')
  return
}

if (!isValidPassword(password)) {
  alert('password does not meet the required rules')
  return
}


  const storedUsername = getCookie("username");
  const storedPassword = getCookie("password");

  console.log("entered:", username, password);
  console.log("stored:", storedUsername, storedPassword);

  if (!storedUsername || !storedPassword) {
    window.location.href = "signup.html";
    return;
  }

  if (username !== storedUsername || password !== storedPassword) {
    window.location.href = "signup.html";
  } else {
    window.location.href = "home.html";
  }
});
function getCookie(name) {
  const cookies = document.cookie.split("; ");

  for (let c of cookies) {
    const [key, value] = c.split("=");
    if (key === name) return value;
  }

  return null;
}

function isValidUsername(username) {
  return username.length > 3;
}

function isValidPassword(password) {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  return hasUpper && hasLower && hasNumber && hasSymbol;
}
