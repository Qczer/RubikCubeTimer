import { getItem } from '../utils/localStorage';
import {  showSolveTypeName, hideOverride, updateStats, select } from './all'

let user;

class Solve {
  constructor(id, typeId, userId, solveTime, plusTwo, DNF, scramble, endTimestamp) {
    this.id = id;
    this.typeId = typeId;
    this.userId = userId;
    this.solveTime = solveTime;
    this.scramble = scramble;   
    this.plusTwo = plusTwo;
    this.DNF = DNF;   
    this.endTimestamp = endTimestamp;   
  }

  setId(id) {
    this.id = id;
  }
};

let loggedIn = false;

let allSolves = {
  '2x2': [],
  '3x3': [],
  '4x4': [],
  '5x5': [],
  '6x6': [],
  '7x7': [],
  'Square-1': [],
  'Clock': [],
  'Skewb': [],
  'Megaminx': [],
  'Pyraminx': [],
  '3x3 Blind': [],
  '3x3 One-Handed': [],
};
let currType = '3x3';

if(getItem('user')) {
  let username = JSON.parse(getItem('user')).username, password = JSON.parse(getItem('user')).password;
  fetch(`http://localhost:3001/login?usernameOrEmail=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
  .then(response => response.json())
  .then(data => {
    if(data.success) {
      user = JSON.parse(getItem('user'));
      loggedIn = true;
      loadSolves();
    }
    else {
      console.error('Zapisana zła nazwa użytkownika albo hasło');
    }
  })
  .catch(error => {
    console.error('Error during login:', error);
  });
}
else {
  user = { username: 'Guest', id: 0 };
}

function loadSolves() {
  fetch(`http://localhost:3001/getUserSolves?username=${encodeURIComponent(user.username)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => response.json())
  .then(data => {
    if(data.constructor == Array && data.length > 0) {
      data.forEach(solve => allSolves[showSolveTypeName(solve.typeId)].push(new Solve(solve.id, solve.typeId, solve.userId, solve.solveTime, solve.plusTwo, solve.DNF, solve.scramble, solve.endTimestamp)))
      updateStats(allSolves);
      Object.entries(allSolves).forEach(solves => {
        if(solves[1].length == 0) {return};
        document.querySelector('.filter').innerHTML += (`<button id="${solves[0]}">${solves[0]}</button>`);

      })
      document.querySelectorAll('.filter button').forEach(el => {
        el.onclick = () => select(el.innerText, allSolves[el.innerText]);
      })
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

/* 

  EVENT LISTENERS

*/

document.querySelector('.override').addEventListener('click', (e) => {
  const innerDiv = document.querySelector(".override .overrideActive");

  if (innerDiv && !innerDiv.contains(e.target)) {
    hideOverride();
  }
});
document.querySelectorAll('.closeButton').forEach(el => {
  el.addEventListener('click', hideOverride);
});