import { randomScrambleForEvent } from "cubing/scramble";
import { TwistyPlayer } from "cubing/twisty";
import { getItem, setItem } from '../utils/localStorage';
import { format } from 'date-fns';
import JSConfetti from 'js-confetti'
import { Session, Solve, formatTime, plusTwo, DNF, deleteTime, showTimeInfo, showSolveTypeName, getSolveTypeName, getSolveTypeId, hideOverride, updateStats, findMin } from './all'

const jsConfetti = new JSConfetti()
const timerEl = document.getElementById('timerEl');
let user = {}, loggedIn = false;
let timerOn = false, inspectionOn = false,  timeAdded = false;
let keyPressed = false;
let timerAnimation, spacePressedTimestamp, startTimerTimestamp, startInspectionTimestamp;
let inspectionPlusTwo = false, inspectionDNF = false;
let sessions = [];
let settings = getItem('settings');
let newSettings = {
  confirmDelete: false,
  decimalPoints: 2,
  freezeTime: 0.5,
  hideWhileSolving: false,
  inspectionToggle: false,
  personalBestConfetti: true,
  scramblePlayerType: '2D',
  inspectionTime: 15,
  inspectionAutoStartTimer: false,
  currentCubeTypeId: 1,
  currentSessionId: null
};

setItem('settings', {...newSettings, ...settings});
settings = getItem('settings');
let cubeTypeId = settings.currentCubeTypeId, cubeType = getSolveTypeName(cubeTypeId);
let solves;
let currentTime, currentScramble = ``;

document.getElementById('statsScramblePlayerTypeBtn').innerText = settings.scramblePlayerType;


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
  sessions.push(new Session(1, 1, 'New Session', new Date()));
  settings = {...settings, currentSessionId: 1};
  setItem('settings', settings);
  selectSession(sessions[0]);
  const solveTypeId = getSolveTypeId(settings.currentCubeTypeId);
  const showSolveType = showSolveTypeName(solveTypeId);
  solves = sessions.find(session => session.id == settings.currentSessionId).allSolves[showSolveType];
  selectCubeType(cubeType);
}

async function loadSolves() {
  try {
    const res = await fetch(`http://localhost:3001/getUserSessions?userId=${encodeURIComponent(user.id)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json();

    if(data.length > 0) {
      data.forEach(session => sessions.push(new Session(session.id, session.userId, session.name, session.createdDatetime)))
      if(!sessions.find(session => session.id == settings.currentSessionId)) {
        settings = {...settings, currentSessionId: sessions[0].id}
        setItem('settings', settings)
      }
      selectSession(sessions.find(session => session.id == settings.currentSessionId));
    }
    else if(!data.exists && loggedIn) {
      fetch(`http://localhost:3001/addSession`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userId: user.id, name: 'new Session'})
      })
      .catch(err => console.error(err))
    }
    const solveTypeId = getSolveTypeId(settings.currentCubeTypeId);
    const showSolveType = showSolveTypeName(solveTypeId)
    solves = sessions.find(session => session.id == settings.currentSessionId).allSolves[showSolveType];

    fetch(`http://localhost:3001/getUserSolves?username=${encodeURIComponent(user.username)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
      if(data.constructor == Array && data.length > 0) {
        data.forEach(solve => {
          let currSession = sessions.find(session => session.id == solve.sessionId);
          if(currSession)
            currSession.allSolves[showSolveTypeName(solve.typeId)].push(new Solve(solve.id, solve.typeId, solve.userId, solve.sessionId, solve.solveTime, solve.plusTwo, solve.DNF, solve.scramble, solve.endTimestamp))
        })
        selectCubeType(cubeType)
        updateStats(solves);
      }
    })
    .catch(error => {console.error('Error:', error);});
  }
  catch(err) {
    console.error(err)
  }
}

timerEl.innerText = formatTime(0, 0, 0)

// Asynchroniczna funkcja generateScramble
async function generateScramble() {
    // Bierze typ z select
    // Uzywa funkcje z biblioteki by dostac promise z wylosowanym scramble
    let type = cubeType;
    if(cubeType == '333bld' || cubeType == '333oh')
      type = '333';
    const scramble = await randomScrambleForEvent(type);
    currentScramble = scramble.toString();
    showHowToScramble(type, currentScramble);
    return scramble.toString();
}

// Wyswietla scramble
function displayScramble() {
    generateScramble()
    .then(result => {document.getElementById('scrambleEl').innerHTML = result; currentScramble = result;})
}
displayScramble();

function disableButtons() {
  const disableBtn = document.getElementById('disableBtn');
  const disableSvg = document.getElementById('disableSvg');
  disableBtn.classList.toggle('active');
  disableSvg.style.fill = disableSvg.style.fill == 'black' ? 'white' : 'black';
  disableSvg.querySelectorAll("circle, rect, path").forEach(el => {
      el.style.stroke = el.style.stroke == "black" ? 'white' : 'black';
  })

  const newScrambleBtn = document.getElementById('newScrambleBtn');
  newScrambleBtn.disabled = !newScrambleBtn.disabled;
}

function updateTimer() {
  if(timerOn && !timeAdded) {
    currentTime = Date.now() - startTimerTimestamp;
    requestAnimationFrame(updateTimer)
  }
  timerEl.innerText = formatTime(currentTime);
}

function updateInspection() {
  if(inspectionOn && !timeAdded) {
    currentTime = startInspectionTimestamp + (settings.inspectionTime*1000) - Date.now();
  }
  let timeLeft = Math.round(currentTime/1000);
  if(inspectionPlusTwo) {
    timerEl.innerText = '+2'
    if(!keyPressed && !timerOn)
      timerEl.style.color = '#EE6A26';
  }
  else if(inspectionDNF) {
    timerEl.innerText = 'DNF'
    if(!keyPressed && !timerOn)
      timerEl.style.color = 'red';
  }
  else
    timerEl.innerText = timeLeft;
  if(timeLeft < 0) {
    if(settings.inspectionAutoStartTimer) {
      inspectionOn = false;
      timerOn = true;
      timerAnimation = requestAnimationFrame(updateTimer)
      startTimerTimestamp = Date.now();
      opacityElements.forEach(el => {
        document.querySelector(el).style.opacity = 0.1;
      })
      document.querySelector('.hiddenOverride').classList.remove('hidden')
    }
    else {
      if(timeLeft < 0 && timeLeft > -2)
        inspectionPlusTwo = true;
      if(timeLeft < -2) {
        inspectionPlusTwo = false;
        inspectionDNF = true;
      }
    }
  }
  if(inspectionOn)
    requestAnimationFrame(updateInspection)
}

function addSolve(id, typeId, userId, sessionId, solveTime, plusTwo, DNF, scramble, endTimestamp) {
  let newSolve = new Solve(id, typeId, userId, sessionId, solveTime, plusTwo, DNF, scramble, endTimestamp);
  let bestSolve = findMin(solves)
  if(settings.personalBestConfetti && bestSolve && newSolve.solveTime + newSolve.plusTwo*2000 < bestSolve.solveTime + bestSolve.plusTwo*2000)
    jsConfetti.addConfetti();
  solves.push(newSolve);
  updateStats(solves);
  timeAdded = true;
  addSolveToList(solves[solves.length - 1]);
  displayScramble();
  if (settings.hideWhileSolving) hideAll();
  if (loggedIn) {
    fetch("http://localhost:3001/addSolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(solves[solves.length - 1]),
    })
    .catch(err => console.error("Error:", err));
  }
}

function addSolveToList(solve) {
  const solveIndex = solves.indexOf(solve);
  document.querySelector('.solves').insertAdjacentHTML('afterbegin', `
    <div class="history-solve-row" id="${solveIndex}Solve">
      <div class="solve-index">${solveIndex+1}.</div>
      <div id="${solveIndex}SolveTime" class="
        solve-time
        ${solve.plusTwo ? 'plusTwo' : ''} 
        ${solve.DNF ? ' DNF' : ''}
        "><span class="solveTimeSpan" id="${solveIndex}SolveTimeSpan">${formatTime(solve.solveTime, solve.plusTwo, solve.DNF)}</span></div>
      <div class="solve-actions">
        <button id="${solveIndex}PlusTwo" class="${solve.plusTwo == 1 ? 'active' : ''}">+2</button>
        <button id="${solveIndex}DNF" class="${solve.DNF == 1 ? 'active' : ''}">DNF</button>
        <button id="${solveIndex}DeleteTime"><img src="close-x-white.svg" width="20px"></img></button>
      </div>
    </div>
  `);
  document.getElementById(`${solveIndex}PlusTwo`).addEventListener('click', () => plusTwo(solve, solves));
  document.getElementById(`${solveIndex}DNF`).addEventListener('click', () => DNF(solve, solves));
  document.getElementById(`${solveIndex}DeleteTime`).addEventListener('click', () => deleteTime(solve, solves));
  document.getElementById(`${solveIndex}SolveTimeSpan`).addEventListener('click', () => showTimeInfo(solve, solves));
}

function hideAll() {
  const selectors = ['.left', '.selectDiv', '.timerLayout', '.scramble', '.buttons'];
  document.querySelector('.timer').classList.toggle('relative');
  selectors.forEach(el => {document.querySelector(el).style.display = document.querySelector(el).style.display == 'none' ? '' : 'none'})
}

function showHowToScramble(type, scramble) {
  let newType;
  switch(type) {
    case '333':
      newType = '3x3x3';
      break;
    case '222':
      newType = '2x2x2';
      break;
    case '444':
      newType =  '4x4x4';
      break;
    case '555':
      newType =  '5x5x5';
      break;
    case '666':
      newType =  '6x6x6';
      break;
    case '777':
      newType =  '7x7x7';
      break;
    case 'minx':
      newType =  'megaminx';
      break;
    case 'sq1':
      newType =  'square1';
      break;
    case 'clock':
      newType =  'clock';
      break;
    case 'pyram':
      newType =  'pyraminx';
      break;
    default:
      newType = type;
      break;
  }

  const player = new TwistyPlayer({
    puzzle: newType,
    alg: scramble,
    hintFacelets: "none",
    backView: "none",
    background: "none",
    viewerLink: "none",
  });
  if(settings.scramblePlayerType == '2D') {
    player.visualization = '2D';
    player.controlPanel = "none";
  }
  document.querySelector('.twistyPlayerDiv').innerHTML = '';
  document.querySelector('.twistyPlayerDiv').appendChild(player);
}

function selectCubeType(newType) {
  let solveTypeId = getSolveTypeId(newType);
  let showSolveType = showSolveTypeName(solveTypeId)
  solves = sessions.find(session => session.id == settings.currentSessionId).allSolves[showSolveType];
  document.querySelector('.solves').innerHTML = '';
  solves.forEach(solve => addSolveToList(solve));
  updateStats(solves);
  cubeType = newType;
  let type = cubeType;
  if(cubeType == '333bld' || cubeType == '333oh')
    type = '333';
  displayScramble();
  document.getElementById('cubeType').innerText = showSolveType;
  const typeSelectEl = document.getElementById('cubeTypeSelect');
  typeSelectEl.style.display = 'none';
  document.querySelectorAll('#cubeTypeSelect button').forEach(el => el.classList.remove('disabled'));
  const el = document.querySelector(`button[value="${newType}"]`)
  el.classList.add('disabled');
  setItem('settings', {...settings, currentCubeType: cubeType})
  if(!loggedIn)
    return;
  fetch(`http://localhost:3001/getCubeTypeId?cubeType=${encodeURIComponent(type)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => response.json())
    .then(data => cubeTypeId = data.id)
    .catch(error => console.error('Error:', error));
}

function selectSession(currSession) {
  const solveTypeId = getSolveTypeId(settings.currentCubeTypeId);
  const showSolveType = showSolveTypeName(solveTypeId)
  settings.currentSessionId = currSession.id;
  solves = sessions.find(session => session.id == settings.currentSessionId).allSolves[showSolveType];
  document.querySelector('.solves').innerHTML = '';
  solves.forEach(solve => addSolveToList(solve));
  document.getElementById('sessionSelect').innerHTML = '';
  updateStats(solves);
  setItem('settings', settings)
  sessions.forEach(session => document.getElementById('sessionSelect').innerHTML += `<div><button class="${session == currSession ? 'disabled' : ''}">${session.name}</button></div>`)
  document.getElementById('session').innerText = currSession.name;
  document.querySelectorAll('#sessionSelect button:not(.disabled)').forEach(el => {
    el.onclick = () => {
      selectSession(sessions.find(session => session.name == el.innerText))
      const solveTypeId = getSolveTypeId(settings.currentCubeTypeId);
      const showSolveType = showSolveTypeName(solveTypeId)
      solves = sessions.find(session => session.id == settings.currentSessionId).allSolves[showSolveType];
      document.querySelector('.solves').innerHTML = '';
      solves.forEach(solve => addSolveToList(solve));
      updateStats(solves);
      document.getElementById('sessionSelect').style.display = 'none';
    }
  })
}

/* 
  Event Listeners
*/

document.getElementById('commonActions').addEventListener('click', () => {
  const selectEl = document.getElementById('commonActionsSelect');
  selectEl.style.display = selectEl.style.display == 'block' ? 'none' : 'block';
  const src = document.querySelector('#commonActions img').src + '';
  document.querySelector('#commonActions img').src = src.includes('arrow-up.svg') ? '/arrow-down.svg' : '/arrow-up.svg';
});
document.getElementById('addNewSession').addEventListener('click', () => {
  document.querySelector('.override').style.display = 'flex';
  document.querySelector('.addSession').style.display = 'block';
})
document.getElementById('createSessionBtn').addEventListener('click', () => {
  const sessionName = document.getElementById('sessionNameInput').value;
  if(!sessionName) {
    alert('Fill in new session name')
    return;
  }
  if(sessions.find(session => session.name == sessionName)) {
    alert('Session with this name already exists')
    return;
  }
  async function addNewSession() {
    try {
      await fetch(`http://localhost:3001/addSession`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userId: user.id, name: sessionName})
      })
      .catch(err => console.error(err))

      const res = await fetch(`http://localhost:3001/getUserSessions?userId=${encodeURIComponent(user.id)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
  
      const data = await res.json();
      const newSession = data.find(session => session.name == sessionName)
      sessions.push(new Session(newSession.id, newSession.userId, newSession.name, newSession.createdDatetime));
      settings.currentSessionId = newSession.id;
      setItem('settings', settings)
      hideOverride();
      document.getElementById('sessionSelect').innerHTML += `<div><button>${newSession.name}</button></div>`
      document.querySelector('.solves').innerHTML = ''
      selectSession(newSession);
    }
    catch(err) {
      console.error(err)
    }
  }
  addNewSession();
})

document.getElementById('session').addEventListener('click', () => {
  const select = document.getElementById('sessionSelect');
  if(select.innerText != '')
    select.style.display = select.style.display == 'block' ? 'none' : 'block';
});
document.getElementById('cubeType').addEventListener('click', () => {
  const typeSelectEl = document.getElementById('cubeTypeSelect');
  typeSelectEl.style.display = typeSelectEl.style.display == 'block' ? 'none' : 'block';
});
document.querySelectorAll('#cubeTypeSelect button').forEach(el => {
  el.addEventListener('click', (e) => {
    if(e.target.value == cubeType)
      return;
    selectCubeType(e.target.value)
  });
});
document.getElementById("disableBtn").addEventListener('click', disableButtons);
document.getElementById("newScrambleBtn").addEventListener('click', displayScramble);
document.getElementById('statsScramblePlayerTypeBtn').addEventListener('click', () => {
  const btn = document.getElementById('statsScramblePlayerTypeBtn');
  settings.scramblePlayerType = settings.scramblePlayerType == '3D' ? '2D': '3D';
  setItem('settings', settings);
  btn.innerText = settings.scramblePlayerType;
  let type = cubeType;
  if(cubeType == '333bld' || cubeType == '333oh')
    type = '333';
  showHowToScramble(type, currentScramble);
})

document.querySelector('.override').addEventListener('click', (e) => {
  const innerDiv = document.querySelector(".override .overrideActive");
  if (innerDiv && !innerDiv.contains(e.target))
    hideOverride();
});
document.querySelectorAll('.closeButton').forEach(el => {
  el.addEventListener('click', hideOverride);
});

const opacityElements = ['.left', '.selectDiv', '.scramble', '.buttons', '.timerLayout'];

function keyDown(e) {
  if(e.code == 'Space') {
    if(document.querySelector('.override').style.display == 'flex')
      return;
    if(!keyPressed) {
      spacePressedTimestamp = Date.now();
      if(!timerOn && settings.hideWhileSolving)
        hideAll();
    }
    if(!timerOn) {
      timerEl.innerText = formatTime(0, 0, 0);
    }
    if(timerOn && !inspectionOn) {
      opacityElements.forEach(el => {
        document.querySelector(el).style.opacity = 1;
      })
      document.querySelector('.hiddenOverride').classList.add('hidden')
      cancelAnimationFrame(timerAnimation);
      if(timeAdded)
        return;
      const date = new Date();
      let newSolveId = solves.length;
      inspectionPlusTwo = inspectionPlusTwo == false ? 0 : 1;
      inspectionDNF = inspectionDNF == false ? 0 : 1;
      if(loggedIn) {
        fetch("http://localhost:3001/getLastSolveId", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
          newSolveId = data+1;
          addSolve(newSolveId, cubeTypeId, user.id, settings.currentSessionId, currentTime, inspectionPlusTwo, inspectionDNF, currentScramble, format(date, 'yyyy-MM-dd HH:mm:ss'));
          inspectionPlusTwo = false;
          inspectionDNF = false;
        })
        .catch(err => {console.error("Error:", err); return;});
      }
      else {
        addSolve(newSolveId, cubeTypeId, user.id, settings.currentSessionId, currentTime, inspectionPlusTwo, inspectionDNF, currentScramble, format(date, 'yyyy-MM-dd HH:mm:ss'));
        inspectionPlusTwo = false;
        inspectionDNF = false;
      }
    }
    if(!timerOn && Date.now() - spacePressedTimestamp < settings.freezeTime*500)
      timerEl.style.color = 'red';
    else if(!timerOn && Date.now() - spacePressedTimestamp < settings.freezeTime*1000)
      timerEl.style.color = 'yellow';
    else if(!timerOn)
      timerEl.style.color = 'green';
  }
  keyPressed = true;
}

function keyUp(e) {
  if(e.code == 'Space') {
    if(timerOn)
      timerOn = false;
    if(!timerOn && timeAdded)
      timeAdded = false;
    if(timerEl.style.color == 'green') {
      if(inspectionOn) {
        inspectionOn = false;
        timerOn = true;
        cancelAnimationFrame(updateInspection);
      }
      if(settings.enableInspection && !inspectionOn && !timerOn) {
        opacityElements.forEach(el => {
          document.querySelector(el).style.opacity = 0.1;
        })
        document.querySelector('.hiddenOverride').classList.remove('hidden')
        inspectionOn = true;
        requestAnimationFrame(updateInspection);
        startInspectionTimestamp = Date.now();
      }
      if(!inspectionOn) {
        timerOn = true;
        timerAnimation = requestAnimationFrame(updateTimer);
        startTimerTimestamp = Date.now();
        opacityElements.forEach(el => {
          document.querySelector(el).style.opacity = 0.1;
        });
        document.querySelector('.hiddenOverride').classList.remove('hidden')
      }
    }
    keyPressed = false;
    timerEl.style.color = '#fff';
  }
}

document.body.addEventListener('keydown', keyDown);
document.body.addEventListener('keyup', keyUp);