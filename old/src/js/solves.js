import { getItem } from '../utils/localStorage';
import {  showSolveTypeName, updateStats, bulkDeleteTime, bulkPlusTwo, bulkDNF, bulkOK, hideOverride } from './all'

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
      updateStats(allSolves[currType]);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}



/* 

  EVENT LISTENERS

*/

document.querySelectorAll('#cubetype-menu div').forEach(el => {
  el.onclick = () => {
    if(el?.classList.contains('disabled'))
      return;
    currType = el.innerText;
    el.classList.add('disabled');
    document.querySelectorAll('#cubetype-menu div').forEach(div => {
      if(div != el)
        div.classList.remove('disabled');
    })
    document.getElementById('open-cubetype-menu').innerText = currType;
    updateStats(allSolves[currType]);
  }
})

document.querySelectorAll('#filter-menu div').forEach(el => {
  el.onclick = () => {
    if(el?.classList.contains('disabled'))
      return;
    el.classList.add('disabled');
    document.querySelectorAll('#filter-menu div').forEach(div => {
      if(div != el)
        div.classList.remove('disabled');
    })
    updateStats(allSolves[currType]);
  }
})

document.querySelectorAll('#sort-menu div').forEach(el => {
  el.addEventListener('click', () => {
    const elCheckbox = el.querySelector('input[type="checkbox"]')
    if(el.querySelector('#reverse-order')) {
      elCheckbox.checked = !elCheckbox.checked;
      updateStats(allSolves[currType]);
      return;
    }
    elCheckbox.checked = true;
    document.querySelectorAll('#sort-menu div').forEach(div => {
      if(div.querySelector('#reverse-order'))
        return;
      const checkbox = div.querySelector('input[type="checkbox"]');
      if(checkbox && div != el)
        checkbox.checked = false;
    })
    updateStats(allSolves[currType]);
  })
})

document.getElementById('open-cubetype-menu').addEventListener('click', () => {
  document.querySelectorAll('.menu:not(#cubetype-menu)').forEach(el => el.classList.add('hidden'))
  document.getElementById('cubetype-menu').classList.toggle('hidden');
  if((document.getElementById('cubetype-menu').classList.contains('hidden') && !document.querySelector('.hiddenOverride').classList.contains('hidden')) || 
  (!document.getElementById('cubetype-menu').classList.contains('hidden') && document.querySelector('.hiddenOverride').classList.contains('hidden')))
    document.querySelector('.hiddenOverride').classList.toggle('hidden')
})

document.getElementById('open-filter-menu').addEventListener('click', () => {
  document.querySelectorAll('.menu:not(#filter-menu)').forEach(el => el.classList.add('hidden'))
  document.getElementById('filter-menu').classList.toggle('hidden');
  if((document.getElementById('filter-menu').classList.contains('hidden') && !document.querySelector('.hiddenOverride').classList.contains('hidden')) || 
  (!document.getElementById('filter-menu').classList.contains('hidden') && document.querySelector('.hiddenOverride').classList.contains('hidden')))
    document.querySelector('.hiddenOverride').classList.toggle('hidden')
})

document.getElementById('open-sort-menu').addEventListener('click', () => {
  document.querySelectorAll('.menu:not(#sort-menu)').forEach(el => el.classList.add('hidden'))
  document.getElementById('sort-menu').classList.toggle('hidden');
  if((document.getElementById('sort-menu').classList.contains('hidden') && !document.querySelector('.hiddenOverride').classList.contains('hidden')) || 
  (!document.getElementById('sort-menu').classList.contains('hidden') && document.querySelector('.hiddenOverride').classList.contains('hidden')))
    document.querySelector('.hiddenOverride').classList.toggle('hidden')
})

document.getElementById('bulkDelete').addEventListener('click', () => {
  bulkDeleteTime(allSolves[currType])
})

document.getElementById('bulkPlusTwo').addEventListener('click', () => {
  bulkPlusTwo(allSolves[currType])
})

document.getElementById('bulkDNF').addEventListener('click', () => {
  bulkDNF(allSolves[currType])
})

document.getElementById('bulkOK').addEventListener('click', () => {
  bulkOK(allSolves[currType])
})

document.querySelectorAll('.paggination button').forEach(btn => {
  btn.onclick = () => {
    let currPage = document.querySelector('.paggination #page-info span:first-child').innerText;
    if(btn.innerText == 'Prev' && +currPage > 1)
      document.querySelector('.paggination #page-info span:first-child').innerText = +currPage-1;
    else if(+currPage < +document.querySelector('.paggination #page-info span:nth-child(2)').innerText)
      document.querySelector('.paggination #page-info span:first-child').innerText = +currPage+1;
    updateStats(allSolves[currType])
  }
})

document.querySelector('.hiddenOverride').addEventListener('click', (e) => {
  document.querySelectorAll('.menu').forEach(el => el.classList.add('hidden'))
  document.querySelector('.hiddenOverride').classList.add('hidden')
})
document.querySelector('.override').addEventListener('click', (e) => {
  const innerDiv = document.querySelector(".override .overrideActive");
  if (innerDiv && !innerDiv.contains(e.target))
    hideOverride();
});
document.querySelectorAll('.closeButton').forEach(el => {
  el.addEventListener('click', hideOverride);
});