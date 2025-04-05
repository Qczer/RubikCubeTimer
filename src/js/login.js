import { sha256 } from 'js-sha256';
import { setItem, getItem } from '../utils/localStorage';

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

function login() {
  document.getElementById('message').innerText = '';
  const usernameOrEmail = document.getElementById('usernameOrEmail').value;
  const password = document.getElementById('password').value;

  if(!usernameOrEmail) {
    showMessage('Wypełnij pole username/email');
    return;
  }
  if(!password) {
    showMessage('Wypełnij pole password');
    return;
  }

  const hashed = sha256(password);

  fetch(`http://localhost:3001/login?usernameOrEmail=${encodeURIComponent(usernameOrEmail)}&password=${encodeURIComponent(hashed)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => response.json())
    .then(data => {
      if(data.success) {
        setItem('user', JSON.stringify(data.user));
        const user = JSON.parse(getItem('user'))
        let firstSessionId;
        fetch(`http://localhost:3001/getUserSessions?userId=${encodeURIComponent(user.id)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(data => {
          if(data.length > 0)
            firstSessionId = data[0].id
          else if(!data.exists) {
            fetch(`http://localhost:3001/addSession`, {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({userId: user.id, name: 'new Session'})
            })
            .catch(err => console.error(err))
            console.log(sessions)
          }
          const settings = getItem('settings')
          setItem('settings', {...settings, currentSessionId: firstSessionId})
        })
        .catch(err => {console.error(err);})

        showMessage('Poprawnie zalogowano', 'lightgreen');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      }
      else {
        showMessage('Zła nazwa użytkownika albo hasło');
      }
    })
    .catch(error => {
      console.error('Error during login:', error);
      showMessage('Wystąpił błąd spróbuj ponownie później');
    });
}

function togglePasswordVisibility() {
  const passwordEl = document.getElementById('password');
  passwordEl.type = passwordEl.type == 'password' ? 'text' : 'password';
  const eyeEl = document.getElementById('togglePassword');
  eyeEl.src = passwordEl.type == 'password' ? 'eye-hide.svg' : 'eye-show.svg';
}

document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);