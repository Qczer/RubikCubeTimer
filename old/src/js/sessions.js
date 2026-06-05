import { getItem } from '../utils/localStorage';
import { Session, Solve, showSolveTypeName, hideOverride, addSolveToList } from './all';
import { format } from 'date-fns';

const user = JSON.parse(getItem('user'));
const settings = getItem('settings');
let sessions = [];
let loggedIn = false;
let currSession, activeSession;
let cubeType = document.getElementById('cubetype').innerText;
if(user) {
  loggedIn = true;
  await loadSolves();
  currSession = sessions.find(session => session.id == settings.currentSessionId);
  activeSession = currSession;
  sessions.forEach(session => {
    document.querySelector('.sessions').innerHTML += `<div class="${session == activeSession ? 'activeSession' : ''}">
      <img src="/three-dots.svg" width="20px" class="move"><h4>${session.name}</h4> <span>Created ${format(session.createdDatetime, 'yyyy-MM-dd')}</span>
      ${session.id == settings.currentSessionId ? '<span class="current">Current</span>' : ''}
    </div>`
  });
  activeSession = sessions.find(session => session.name == document.querySelector('.activeSession h4').innerHTML);
  selectSession(activeSession);
  document.querySelectorAll('.sessions > div').forEach(el => el.onclick = () => {
    activeSession = sessions.find(session => session.name == el.querySelector('h4').innerText);
    document.querySelectorAll('.sessions > div').forEach(div => div.classList.remove('activeSession'));
    el.classList.add('activeSession');
    selectSession(activeSession);
  })
}
else 
  window.location.href = '/index.html';

function selectSession(session) {
  document.getElementById('session-name').value = session.name;
  updateStats(session);
}

function updateStats(session) {
  const cubeData = session.allSolves[cubeType];
  document.querySelector('.stats').innerHTML = '';
  cubeData.forEach(solve => addSolveToList(solve, activeSession.allSolves[cubeType]));
}

async function loadSolves() {
  try {
    const res = await fetch(`http://localhost:3001/getUserSessions?userId=${encodeURIComponent(user.id)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json();

    if(data.length > 0)
      data.forEach(session => sessions.push(new Session(session.id, session.userId, session.name, session.createdDatetime)));
    else if(!data.exists && loggedIn) {
      fetch(`http://localhost:3001/addSession`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userId: user.id, name: 'New Session'})
      })
      .catch(err => console.error(err));
    }

    const res2 = await fetch(`http://localhost:3001/getUserSolves?username=${encodeURIComponent(user.username)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const data2 = await res2.json();

    if(data2.constructor == Array && data2.length > 0)
      data2.forEach(solve => sessions.find(session => session.id == solve.sessionId).allSolves[showSolveTypeName(solve.typeId)].push(new Solve(solve.id, solve.typeId, solve.userId, solve.sessionId, solve.solveTime, solve.plusTwo, solve.DNF, solve.scramble, solve.endTimestamp)));
  }
  catch(err) {
    console.error(err);
  }
}

/* 

  EVENT LISTENERS

*/

document.getElementById('session-name').addEventListener('input', (e) => {
  const oldName = activeSession.name;
  activeSession.name = e.target.value;
  document.querySelectorAll('.sessions > div h4').forEach(h4 => {
    if(h4.innerHTML == oldName)
      h4.innerHTML = e.target.value;
  });
  fetch(`http://localhost:3001/updateSessionName`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({sessionName: activeSession.name, sessionId: activeSession.id})
  })
  .catch(err => console.error(err));
})

document.getElementById('cubetype').addEventListener('click', () => {
  // document.querySelectorAll('')
});

document.querySelectorAll('.closeButton').forEach(el => {
  el.addEventListener('click', hideOverride);
});