import { sha256 } from 'js-sha256';
import { getItem, setItem } from '../utils/localStorage';

if(getItem('user')) {
  showMessage('You are already logged in. You will be redirected to main site.', 'lightgreen')
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 2000);
}

function showMessage(msg, color) {
  document.getElementById('message').innerText = msg;
  if(!color)
    color = 'red';
  document.getElementById('message').style.color = color;
}

function signup() {
  document.getElementById('message').innerText = '';
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let email = document.getElementById('email').value;

  if(!username) {
    showMessage('Wypełnij pole username');
    return;
  }

  // Sprawdzanie czy uzytkownik o tej nazwie juz istnieje
  fetch(`http://localhost:3001/doesUserExist?username=${username}`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Connection error!");
    }
    return response.json();
  })
  .then(data => {
    if (data.exists) {
      showMessage('User with this username already exists. Try another username');
      return;
    }
  })
  .catch(error => {
    console.error("Error:", error);
  });

  if(!password) {
    showMessage('Fill password');
    return;
  }

  // Sprawdzanie czy haslo jest wedlug zasad
  if(password.length < 8) {
    showMessage('Password needs at least 8 characters');
    return;
  }
  if(!/[A-Z]/.test(password)) {
    showMessage('Password needs at least one uppercase character');
    return;
  }
  if(!/\d/.test(password)) {
    showMessage('Password needs at least one number');
    return;
  }

  // Jesli email jest wpisany sprawdza czy jest poprawny
  if (email && !emailRegex.test(email)) {
    showMessage("Niepoprawny adres e-mail!");
    return;
  }

  // Jesli mozna utworzyc uzytkownika szyfrujemy haslo
  let hashed = sha256(password);
  console.log(email)
  if(email == '')
    email = null;
  console.log(email)
  
  // Dodanie uzytkownika
  fetch("http://localhost:3001/addUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      email: email,
      password: hashed
    })
  })
    .catch(err => {console.error("Błąd:", err); return;});

  fetch(`http://localhost:3001/getUser?username=${encodeURIComponent(username)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(res => res.json())
    .then(data => {
      setItem('user', JSON.stringify(data));
      showMessage('Account has been created', 'green');
      const settings = getItem('settings');
      setItem('settings', {...settings, currentSessionId: null})
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    })
    .catch(err => console.log(err))
}

function togglePasswordVisibility() {
  const passwordEl = document.getElementById('password');
  passwordEl.type = passwordEl.type == 'password' ? 'text' : 'password';
  const eyeEl = document.getElementById('togglePassword');
  eyeEl.src = passwordEl.type == 'password' ? 'eye-hide.svg' : 'eye-show.svg';
}

document.getElementById("signUpBtn").addEventListener("click", signup);
document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);