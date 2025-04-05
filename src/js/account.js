import { sha256 } from 'js-sha256';
import { getItem, setItem, removeItem } from '../utils/localStorage';

let user;
if(getItem('user'))
  user = JSON.parse(getItem('user'));
else
  window.location.href = '/index.html'
  

function changeTab() {
  const currTab = document.querySelector('.buttons .active').innerText;
  document.querySelectorAll('.main-content > div').forEach(el => el.classList.add('hidden'))

  if(currTab == 'Personal info') {
    document.querySelector('.personal-info').classList.remove('hidden')
    document.getElementById('username').value = user.username
    document.getElementById('email').value = user.email
  }
  else if(currTab == 'Password') {
    document.querySelector('.password').classList.remove('hidden')
  }
  else if(currTab == 'Delete Account') {
    document.querySelector('.delete-account').classList.remove('hidden')
  }
}

changeTab();

function showMessage(message, color) {
  if(message == '') {
    document.getElementById('message').innerText = '';
    document.getElementById('message').classList.add('hidden');
  }
  if(color)
    document.getElementById('message').style.color = color;
  else
    document.getElementById('message').style.color = 'red';
  document.getElementById('message').innerText = message;
  document.getElementById('message').classList.remove('hidden');
}

/* 

  EVENT LISTENERS

*/

document.getElementById('update-info').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!username) {
    showMessage("Fill in username!");
    return;
  }
  if (email && !emailRegex.test(email)) {
    showMessage("Incorrect email!");
    return;
  }

  if(username == user.username && email == user.email) {
    showMessage("Username and email arent changed!");
    return;
  }

  user = {
    ...user,
    username: username,
    email: email,
  }
  setItem('user', JSON.stringify(user))

  fetch("http://localhost:3001/updateUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  })
    .catch(err => {console.error("Błąd:", err); return;});
  showMessage("Action success!", "green");
})

document.getElementById('update-password').addEventListener('click', () => {
  const currPassword = document.getElementById('curr-password').value
  const newPassword = document.getElementById('new-password').value

  if(!currPassword || !newPassword) {
    showMessage('Fill both passwords');
    return;
  }

  if(sha256(currPassword) != user.password) {
    showMessage('Bad old password')
    return;
  }

  // Sprawdzanie czy haslo jest wedlug zasad
  if(newPassword.length < 8) {
    showMessage('New password needs at least 8 characters');
    return;
  }
  if(!/[A-Z]/.test(newPassword)) {
    showMessage('New password needs at least one uppercase character');
    return;
  }
  if(!/\d/.test(newPassword)) {
    showMessage('New password needs at least one number');
    return;
  }

  user = {...user, password: sha256(newPassword)}
  showMessage('Action success', 'green')
  setItem('user', JSON.stringify(user))
  fetch("http://localhost:3001/updateUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  })
    .catch(err => {console.error("Błąd:", err); return;});
})

document.getElementById('delete-account').addEventListener('click', () => {
  if(!confirm("Are you sure you want to delete your account?"))
    return;
  fetch("http://localhost:3001/deleteUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({userId: user.id})
  })
    .catch(err => {console.error("Błąd:", err); return;});
  removeItem('user');
})

document.querySelectorAll('.buttons button').forEach(el => {
  el.addEventListener('click', () => {
    el.classList.add('active');
    document.querySelectorAll('.buttons button').forEach(btn => {if(btn != el) {btn.classList.remove('active')}});
    changeTab()
  })
})