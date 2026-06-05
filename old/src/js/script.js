import { getItem, removeItem } from '../utils/localStorage.js';

if(getItem('user'))
    document.getElementById('user').style.display = 'block';
else
    document.getElementById('log-in-btns').style.display = 'flex';

/* 
EVENT LISTENERS
*/

document.getElementById('userIcon').addEventListener('click', () => {
    const userOnClickEl = document.getElementById('userOnClick');
    userOnClickEl.style.display = userOnClickEl.style.display == 'block' ? 'none' : 'block';
})

document.getElementById('userAccountBtn').addEventListener('click', () => {
    if(window.location.pathname != '/account.html')
        window.location.href = 'account.html'
})

document.getElementById('userSettingsBtn').addEventListener('click', () => {
    if(window.location.pathname != '/settings.html')
        window.location.href = 'settings.html'
})

document.getElementById('logoutBtn').addEventListener('click', () => {
    removeItem('user');
    window.location.reload();
})