import { getItem, setItem } from '../utils/localStorage';
import { TwistyPlayer } from "cubing/twisty";
import { format } from 'date-fns';

let user = {}, loggedIn = false;

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
};

setItem('settings', {...newSettings, ...settings});
settings = getItem('settings');

export class Session {
  constructor(id, userId, name, createdDatetime) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.createdDatetime = createdDatetime;
    this.allSolves = {
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
    }
  }
}

export class Solve {
  constructor(id, typeId, userId, sessionId, solveTime, plusTwo, DNF, scramble, endTimestamp) {
    this.id = id;
    this.typeId = typeId;
    this.userId = userId;
    this.sessionId = sessionId;
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

export function formatTime(ms, plusTwo, DNF) {
  if(DNF == 1)
    return 'DNF';
  if(ms == null)
    return '-';

  if(plusTwo == 1)
    ms += 2000;

  const days = Math.floor(ms / 86400000); // 1 day = 86400000 ms
  const hours = Math.floor((ms % 86400000) / 3600000); // 1 hour = 3600000 ms
  const minutes = Math.floor((ms % 3600000) / 60000); 
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / Math.pow(10, 3 - settings.decimalPoints));

  if (days > 0) 
    return `${days}d ${hours}:${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(settings.decimalPoints, '0')}`;
  if (hours > 0) 
    return `${hours}:${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(settings.decimalPoints, '0')}`;
  if (minutes > 0) 
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(settings.decimalPoints, '0')}`;
  
  return `${seconds}.${milliseconds.toString().padStart(settings.decimalPoints, '0')}`;
}

export function plusTwo(solve, array) {
  const solveIndex = array.indexOf(solve);
  solve.plusTwo = solve.plusTwo == 1 ? 0 : 1;
  if(document.getElementById(`${solveIndex}PlusTwo`))
    document.getElementById(`${solveIndex}PlusTwo`).classList.toggle('active');
  if(document.getElementById(`${solveIndex}AvgPlusTwo`))
    document.getElementById(`${solveIndex}AvgPlusTwo`).classList.toggle('active');
  if(document.getElementById(`${solveIndex}AvgSolve`))
    document.getElementById(`${solveIndex}AvgSolve`).classList.toggle('plusTwo');
  if(document.getElementById(`${solveIndex}SolveTime`))
    document.getElementById(`${solveIndex}SolveTime`).classList.toggle('plusTwo');
  if(document.getElementById(`${solveIndex}SolveTimeSpan`))
    document.getElementById(`${solveIndex}SolveTimeSpan`).innerText = formatTime(solve.solveTime, solve.plusTwo, solve.DNF)
  if(document.getElementById(`${solveIndex}AvgSolve`))
    document.getElementById(`${solveIndex}AvgSolve`).querySelector('span').innerText = formatTime(solve.solveTime, solve.plusTwo, solve.DNF)
  if(!loggedIn) {
    updateStats(array);
    return;
  }
  fetch("http://localhost:3001/plusTwo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(solve)
  })
    .then(data => updateStats(array))
    .catch(err => {console.error("Error:", err); return;});
}

export function DNF(solve, array) {
  const solveIndex = array.indexOf(solve);
  solve.DNF = solve.DNF == 1 ? 0 : 1;
  if(document.getElementById(`${solveIndex}DNF`))
    document.getElementById(`${solveIndex}DNF`).classList.toggle('active');
  if(document.getElementById(`${solveIndex}AvgDNF`))
    document.getElementById(`${solveIndex}AvgDNF`).classList.toggle('active');
  if(document.getElementById(`${solveIndex}AvgSolve`))
    document.getElementById(`${solveIndex}AvgSolve`).classList.toggle('DNF');
  if(document.getElementById(`${solveIndex}SolveTime`))
    document.getElementById(`${solveIndex}SolveTime`).classList.toggle('DNF');
  if(document.getElementById(`${solveIndex}SolveTimeSpan`))
    document.getElementById(`${solveIndex}SolveTimeSpan`).innerText = formatTime(solve.solveTime, solve.plusTwo, solve.DNF)
  if(!loggedIn) {
    updateStats(array)
    return;
  }
  fetch("http://localhost:3001/DNF", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(solve)
  })
    .then( data => {
      updateStats(array)
    })
    .catch(err => {console.error("Error:", err); return;});
}

export function deleteTime(solve, array) {
  const solveIndex = array.indexOf(solve);

  if(settings.confirmDelete && !confirm("Do you want to delete this solve?"))
    return;

  if(solveIndex == array.length-1 && window.location.path == '/index')
    timerEl.innerText = formatTime(0, 0, 0);
    
  if(document.querySelector('.solves'))
    document.querySelector('.solves').innerHTML = '';
  if(document.querySelector('.stats') && window.location.path == '/stats')
    document.querySelector('.stats').innerHTML = '';
  array.splice(solveIndex, 1);
  array.forEach(solve => addSolveToList(solve, array))
  updateStats(array);
  if(!loggedIn)
    return;
  fetch(`http://localhost:3001/deleteSolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(solve)
  })
  .catch(error => console.error('Error:', error));
}

export function bulkDeleteTime(array) {
  const arrayBefore = array;

  if(!confirm("Do you want to delete all solves in this category?"))
    return;

  array = [];
  updateStats(array);
  if(!loggedIn)
    return;
  fetch(`http://localhost:3001/bulkDeleteSolves`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arrayBefore)
  })
  .catch(error => console.error('Error:', error));
}

export function bulkPlusTwo(array) {
  const arrayBefore = array;

  if(!confirm("Do you want to mark +2 all solves in this category?"))
    return;

  array.forEach(solve => solve.plusTwo = 1)
  updateStats(array);
  if(!loggedIn)
    return;
  fetch(`http://localhost:3001/bulkPlusTwoSolves`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arrayBefore)
  })
  .catch(error => console.error('Error:', error));
}

export function bulkDNF(array) {
  const arrayBefore = array;

  if(!confirm("Do you want to mark DNF all solves in this category?"))
    return;

  array.forEach(solve => solve.DNF = 1)
  updateStats(array);
  if(!loggedIn)
    return;
  fetch(`http://localhost:3001/bulkDNFSolves`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arrayBefore)
  })
  .catch(error => console.error('Error:', error));
}

export function bulkOK(array) {
  const arrayBefore = array;

  if(!confirm("Do you want to mark ok all solves in this category?"))
    return;

  array.forEach(solve => {solve.plusTwo = 0; solve.DNF = 0})
  updateStats(array);
  if(!loggedIn)
    return;
  fetch(`http://localhost:3001/bulkOKSolves`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arrayBefore)
  })
  .catch(error => console.error('Error:', error));
}

export function findMin(array) {
  let min;
  array.forEach(solve => {
    if(!min && solve.DNF == 0)
      min = solve;
    if(solve.DNF == 0 && solve.solveTime + solve.plusTwo*2000 < min.solveTime + min.plusTwo*2000)
      min = solve;
  })
  // for(let i = 0; i < array.length; i++) {
  //   if(array[i].DNF == 0 && array[i].solveTime + (array[i].plusTwo == 1 ? 2000 : 0) < min.solveTime + (min.plusTwo == 1 ? 2000 : 0)) {
  //     min = array[i]
  //   }
  // }
  return min;
}

export function findMax(array) {
  let max;
  array.forEach(solve => {
    if(!max && solve.DNF == 0)
      max = solve;
    if(solve.DNF == 0 && solve.solveTime + solve.plusTwo*2000 > max.solveTime + max.plusTwo*2000)
      max = solve;
  })
  // for(let i = 0; i < array.length; i++) {
  //   if(array[i].DNF == 0 && array[i].solveTime + (array[i].plusTwo == 1 ? 2000 : 0) > max.solveTime + (max.plusTwo == 1 ? 2000 : 0)) {
  //     max = array[i]
  //   }
  // }
  return max;
}

export function ao(array, index, count) {
  if (index < 0 || index >= array.length)
    return { avg: undefined, DNF: false, index: index, count: count, ids: [] };

  const subsetSolves = array.slice(index, index + count);

  if (subsetSolves.length < count)
    return { avg: undefined, DNF: false, index: index, count: count };

  const sortedSolves = subsetSolves.toSorted((a, b) => {
    if (a.DNF && b.DNF) return 0; // Jeśli oba mają DNF, nie zmienia kolejności
    if (a.DNF) return 1; // Jeśli a ma DNF, jest gorszy
    if (b.DNF) return -1;

    return (a.solveTime + a.plusTwo*2000) - (b.solveTime + b.plusTwo*2000)
  });

  const relevantSolves = sortedSolves.slice(1, count - 1);

  let ids = [];
  relevantSolves.forEach(solve => ids.push(solve.id));

  const dnfCount = subsetSolves.filter(solve => solve.DNF).length;
  if (dnfCount > 1) {
    return { avg: undefined, DNF: true, index: index, count: count, typeId: sortedSolves[0].typeId, ids: ids };
  }

  // Solves without best and worst

  const totalSolveTime = relevantSolves.reduce((acc, solve) => acc + solve.solveTime + solve.plusTwo * 2000, 0);
  const averageSolveTime = totalSolveTime / relevantSolves.length;

  return { avg: averageSolveTime, DNF: false, index: index, count: count, typeId: relevantSolves[0].typeId, ids: ids, avgType: 'ao' };
}

export function mo(array, index, count) {
  if (index < 0 || index >= array.length)
    return { avg: undefined, DNF: false, index: index, count: count, ids: [] };

  const subsetSolves = array.slice(index, index + count);

  let ids = [], returnDnf = false;
  subsetSolves.forEach(solve => {ids.push(solve.id); if(solve.DNF) returnDnf = true});

  if(returnDnf)
    return { avg: undefined, DNF: true, index: index, count: count, typeId: subsetSolves[0].typeId, ids: ids };

  if (subsetSolves.length < count)
    return { avg: undefined, DNF: false, index: index, count: count, typeId: subsetSolves[0].typeId, ids: ids };

  const totalSolveTime = subsetSolves.reduce((acc, solve) => acc + solve.solveTime + solve.plusTwo*2000, 0);
  const averageSolveTime = totalSolveTime / subsetSolves.length;

  return { avg: averageSolveTime, DNF: false, index: index, count: count, typeId: subsetSolves[0].typeId, ids: ids, avgType: 'mo' };
}

export function getAvg(array) {
  if(array.length < 1)
    return { avg: undefined, DNF: false, index: 0, count: 0 };

  const validSolves = array.filter(solve => !solve.DNF);
  const dnfCount = array.length - validSolves.length;

  let ids = [];
  array.forEach(solve => ids.push(solve.id));

  if (dnfCount > 1) {
    return { avg: undefined , DNF: true, typeId: array[0].typeId, ids: ids };
  }

  const totalTime = validSolves.reduce((sum, solve) => sum + solve.solveTime + solve.plusTwo * 2000, 0);
  const averageTime = totalTime / (array.length - dnfCount); // Liczymy średnią z całkowitej liczby ułożeń

  return { avg: averageTime, DNF: false, typeId: array[0].typeId, ids: ids, avgType: 'ao' };
}

export function showTimeInfo(solve, array) {
  document.querySelector('#showSolve').classList.add('overrideActive');
  document.querySelector('#showSolve').style.display = 'block';
  document.querySelector('#showSolve .solveInfoBody h1').innerText = formatTime(solve.solveTime, solve.plusTwo, solve.DNF);
  document.querySelector('#showSolve .solveInfoBody .solveInfoButtons #solveInfoCubeTypeBtn').innerText = solve.typeId;
  document.querySelector('#showSolve .solveInfoBody .userInfo .username').innerText = user.username;
  document.querySelector('#showSolve .solveInfoBody #solveInfoEndTimestamp').innerText = format(solve.endTimestamp, 'yyyy-MM-dd HH:mm:ss');
  document.querySelector('#showSolve .solveInfoBody #solveInfoScramble').innerText = solve.scramble;
  document.getElementById('solveInfoPlusTwoBtn').style.background = solve.plusTwo == 1 ? 'var(--orange)' : '';
  document.getElementById('solveInfoDNFBtn').style.background = solve.DNF == 1 ? 'var(--red)' : '';
  document.getElementById('solveInfoCubeTypeBtn').innerText = showSolveTypeName(solve.typeId)
  const player = new TwistyPlayer({
    puzzle: getVisualizationTypeName(solve.typeId),
    alg: solve.scramble,
    hintFacelets: "none",
    backView: "none",
    background: "none",
    visualization: '2D',
    viewerLink: "none",
    controlPanel: "none",
  });
  document.getElementById('solveScrambleVisualization').innerHTML = '';
  document.getElementById('solveScrambleVisualization').appendChild(player);
  document.querySelector('.override').style.display = 'flex';
  document.getElementById('solveInfoPlusTwoBtn').onclick = () => {
    plusTwo(solve, array);
    document.getElementById('solveInfoPlusTwoBtn').style.background = solve.plusTwo == 1 ? 'var(--orange)' : '';
    document.querySelector('#showSolve .solveInfoBody h1').innerText = formatTime(solve.solveTime, solve.plusTwo, solve.DNF);
  }
  document.getElementById('solveInfoDNFBtn').onclick = () => {
    DNF(solve, array);
    document.getElementById('solveInfoDNFBtn').style.background = solve.DNF == 1 ? 'var(--red)' : '';
    document.querySelector('#showSolve .solveInfoBody h1').innerText = formatTime(solve.solveTime, solve.plusTwo, solve.DNF);
  }
  document.getElementById('solveInfoDeleteBtn').onclick = () => {
    deleteTime(solve, array);
    hideOverride();
  }
}

export function showAvgInfo(avg, array) {
  if(!avg?.ids)
    return;
  let avgSolves = array.filter(solve => avg.ids.includes(solve.id));
  document.querySelector('#showAvg').classList.add('overrideActive');
  document.querySelector('#showAvg').style.display = 'block';
  document.querySelector('#currAvg').innerHTML = `Current ${showSolveTypeName(avg.typeId)} ${avg.avgType == 'ao' ? 'Average' : 'Mean'}${avg?.count ? ' Of ' + avg.count : ''}: ${formatTime(avg.avg, 0, avg.DNF)}`;
  document.querySelector('#avgDate').innerText = format(avgSolves[avgSolves.length-1].endTimestamp, 'yyyy-MM-dd HH:mm:ss');
  let order = document.getElementById('reverseAvgOrder').checked ? 'beforeend' : 'afterbegin';
  showAvgInfoList(avg, order, array);
  document.querySelector('.override').style.display = 'flex';
  document.getElementById('reverseAvgOrder').onclick = () => showAvgInfo(avg, array);
}

export function showAvgInfoList(avg, order, array) {
  let avgSolves = array.filter(solve => avg.ids.includes(solve.id));
  document.querySelector('#avgSolves').innerHTML = '';
  avgSolves.forEach((solve, i) => {
    const solveIndex = array.indexOf(solve);
    document.querySelector('#avgSolves').insertAdjacentHTML(order, `
      <div class="history-solve-row">
        <div class="solve-index">${i+1}.</div>
        <div id="${solveIndex}AvgSolve" class="solve-time ${solve.plusTwo ? 'plusTwo' : ''} ${solve.DNF ? ' DNF' : ''}
          "><span class="solveTimeSpan">${formatTime(solve.solveTime, solve.plusTwo, solve.DNF)}</span></div>
        <div class="solve-actions">
          <button id="${solveIndex}AvgPlusTwo" class="${solve.plusTwo == 1 ? 'active' : ''}">+2</button>
          <button id="${solveIndex}AvgDNF" class="${solve.DNF == 1 ? 'active' : ''}">DNF</button>
          <button id="${solveIndex}Delete"><img src="close-x-white.svg" width="20px"></img></button>
        </div>
      </div>`);
      document.getElementById(`${solveIndex}AvgPlusTwo`).addEventListener('click', () => {plusTwo(solve, array); updateStats(array); showAvgInfoList(avg, order, array)});
      document.getElementById(`${solveIndex}AvgDNF`).addEventListener('click', () => {DNF(solve, array); updateStats(array); showAvgInfoList(avg, order, array)});
      document.getElementById(`${solveIndex}Delete`).addEventListener('click', () => {deleteTime(solve, array); updateStats(array); showAvgInfoList(avg, order, array)});
  });
} 

export function hideOverride() {
  const overrideDiv = document.querySelector(".override");
  const innerDiv = overrideDiv.querySelector(".overrideActive");
  document.querySelectorAll('.override .overrideActive').forEach(el => {
    el.classList.remove('overrideActive');
  })
  overrideDiv.style.display = "none";
  if(innerDiv)
    innerDiv.style.display = "none";
}

export function getSolveTypeId(typeName) {
  switch(typeName) {
    case '333':
      return 1;
    case '222':
      return 3;
    case '444':
      return 4;
    case '555':
      return 5;
    case '666':
      return 6;
    case '777':
      return 7;
    case 'minx':
      return 8;
    case 'sq1':
      return 9;
    case 'clock':
      return 10;
    case 'skewb':
      return 11;
    case 'pyram':
      return 12;
    case '333bld':
      return 1;
    case '333oh':
      return 1;
    default:
      return typeName;
  }
}

export function getSolveTypeName(typeId) {
  switch(typeId) {
    case 1:
      return '333';
    case 3:
      return '222';
    case 4:
      return '444';
    case 5:
      return '555';
    case 6:
      return '666';
    case 7:
      return '777';
    case 8:
      return 'minx';
    case 9:
      return 'sq1';
    case 10:
      return 'clock';
    case 11:
      return 'skewb';
    case 12:
      return 'pyraminx';
    default:
      return typeId;
  }
}

export function showSolveTypeName(typeId) {
  switch(typeId) {
    case 1:
      return '3x3';
    case 3:
      return '2x2';
    case 4:
      return '4x4';
    case 5:
      return '5x5';
    case 6:
      return '6x6';
    case 7:
      return '7x7';
    case 8:
      return 'Megaminx';
    case 9:
      return 'Square-1';
    case 10:
      return 'Clock';
    case 11:
      return 'Skewb';
    case 12:
      return 'Pyraminx';
    default:
      return typeId;
  }
}

export function getVisualizationTypeName(typeId) {
  switch(typeId) {
    case 1:
      return '3x3x3';
    case 3:
      return '2x2x2';
    case 4:
      return '4x4x4';
    case 5:
      return '5x5x5';
    case 6:
      return '6x6x6';
    case 7:
      return '7x7x7';
    case 8:
      return 'megaminx';
    case 9:
      return 'square1';
    case 10:
      return 'clock';
    case 12:
      return 'pyraminx';
    default:
      return typeId;
  }
}

export function select(type, array) {
  document.querySelectorAll('.filter button').forEach(el => {
    el.classList.remove('active')
  })
  document.getElementById(type).classList.add('active')
  document.querySelector('.stats-layout').style.display = type == 'All' ? '' : 'none';
  document.querySelector('.event-layout').style.display = type == 'All' ? 'none' : 'flex';
  if(type == 'All') return;

  let currTypeSolves = array;
  let pb = findMin(currTypeSolves)
  let totalTime = 0;
  currTypeSolves.forEach(solve => totalTime += (solve.solveTime + solve.plusTwo*2000))
  if(pb) {
    document.getElementById('singlePB').innerText = formatTime(pb.solveTime, pb.plusTwo, 0);
    document.getElementById('singlePB').onclick = () => showTimeInfo(pb, currTypeSolves);
    document.getElementById('singlePBDate').innerText = format(pb.endTimestamp, 'dd/MM/yyyy');
  }
  document.getElementById('typeTotalSolves').innerText = currTypeSolves.length;
  document.getElementById('typeTimeSpentCubing').innerText = formatTime(totalTime, 0, 0);

  document.querySelectorAll('.averages button').forEach(el => {
    let avg = ao(currTypeSolves, 0, el.value);
    el.innerText = formatTime(avg.avg, 0, 0)
    el.onclick = () => showAvgInfo(avg, currTypeSolves);
    if(el.innerText != '-')
      el.classList.add('hoverUnderline')
    else
      el.classList.remove('hoverUnderline')
  })
}

export function updateStats(array) {
  let path = window.location.pathname;
  path = path.slice(0, -5)
  if(path == '/index' || path == "")
    updateStatsOnTimer(array);
  else if(path == '/stats')
    updateStatsOnStats(array);
  else if(path == '/solves')
    updateStatsOnSolves(array);
}

function updateStatsOnTimer(array) {
  let stats = [
    ao(array, array.length-5, 5),
    ao(array, array.length-12, 12),
    mo(array, array.length-5, 5),
    mo(array, array.length-12, 12),
  ];
  let pb = findMin(array)
  let worst = findMax(array);
  let avg = getAvg(array);
  document.getElementById('statsPb').innerText = pb ? formatTime(pb.solveTime, pb.plusTwo, pb.DNF) : '-';
  document.getElementById('statsWorst').innerText = worst ? formatTime(worst.solveTime, worst.plusTwo, worst.DNF) : '-';
  document.getElementById('statsAvg').innerText = formatTime(avg.avg, 0, avg.DNF);
  document.getElementById('statsOption1').innerText = formatTime(stats[0].avg, 0, stats[0].DNF);
  document.getElementById('statsOption2').innerText = formatTime(stats[1].avg, 0, stats[1].DNF);
  document.getElementById('statsOption3').innerText = formatTime(stats[2].avg, 0, stats[2].DNF);
  document.getElementById('statsOption4').innerText = formatTime(stats[3].avg, 0, stats[3].DNF);

  document.querySelectorAll('.stats span').forEach(el => {
    if(el.innerText == '-') {
      el.classList.remove('hoverUnderline');
      el.onclick = null;
    }
    else
      el.classList.add('hoverUnderline');
  })

  if(pb)
    document.getElementById('statsPb').onclick = () => showTimeInfo(pb, array)
  if(worst)
    document.getElementById('statsWorst').onclick = () => showTimeInfo(worst, array);
  if(avg?.avg)
    document.getElementById('statsAvg').onclick = () => showAvgInfo(avg, array);
  if(stats[0]?.avg || stats[0]?.DNF)
    document.getElementById('statsOption1').onclick = () => showAvgInfo(stats[0], array);
  if(stats[1]?.avg || stats[1]?.DNF)
    document.getElementById('statsOption2').onclick = () => showAvgInfo(stats[1], array);
  if(stats[2]?.avg || stats[2]?.DNF)
    document.getElementById('statsOption3').onclick = () => showAvgInfo(stats[2], array);
  if(stats[3]?.avg || stats[3]?.DNF)
    document.getElementById('statsOption4').onclick = () => showAvgInfo(stats[3], array);
}

function updateStatsOnStats(array) {
  let timeSpentCubing = 0, totalSolves = 0, numberOfEvents = 0, topEvent, totalDNFs = 0, totalPlusTwos = 0;
  if(array.constructor == Array) {
    select(showSolveTypeName(array[0].typeId), array);
    return;
  }

  Object.entries(array).forEach(arr => {
    if(!topEvent || arr[1].length > topEvent[1].length)
      topEvent = arr;
    if(arr[1].length > 0)
      numberOfEvents += 1;
    arr[1].forEach(solve => {
      timeSpentCubing += (solve.solveTime + solve.plusTwo * 2000);
      totalSolves += 1;
      if(solve.DNF)
        totalDNFs++;
      if(solve.plusTwo)
        totalPlusTwos++;
    });
  });
  document.getElementById('timeSpentCubing').innerText = formatTime(timeSpentCubing, 0, 0);
  document.getElementById('totalSolves').innerText = totalSolves;
  document.getElementById('numberOfEvents').innerText = numberOfEvents;
  document.getElementById('topEvent').innerText = topEvent[0];
  document.getElementById('DNFs').innerText = totalDNFs;
  document.getElementById('totalPlusTwos').innerText = totalPlusTwos;

  const colors = ["#f9bc60", "#a8d0c6", "#ff7675", "#6c5ce7"];
  let currColor = 0;

  const svg = document.getElementById("donutChart");
  const radius = 100;
  const centerX = 150, centerY = 150;
  const innerRadius = 70;

  let startAngle = 0;

  if(totalSolves == 0) {
    document.getElementById('donutChartNoData').style.display = 'block'; 
    return;
  }

  Object.entries(array).forEach((item, i) => {
    if(item[1].length == 0)
      return;
    const sliceAngle = (item[1].length / totalSolves) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    // Create the donut segment (path element)
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = `
        M ${x1} ${y1} 
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} 
        L ${centerX + innerRadius * Math.cos(endAngle)} ${centerY + innerRadius * Math.sin(endAngle)}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${centerX + innerRadius * Math.cos(startAngle)} ${centerY + innerRadius * Math.sin(startAngle)}
        Z
    `;

    path.setAttribute("d", d);
    path.setAttribute("fill", colors[currColor]);
    document.getElementById('chart-legend').innerHTML += `<div class="color" style="background: ${colors[currColor]}; width: fit-content; height: 20px; margin-bottom: 5px;"><span>${item[0]}</span></div>`
    currColor++;
    svg.appendChild(path);

    startAngle = endAngle;
  });

  const centerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  centerCircle.setAttribute("cx", centerX);
  centerCircle.setAttribute("cy", centerY);
  centerCircle.setAttribute("r", innerRadius);
  centerCircle.setAttribute("fill", "transparent");
  svg.appendChild(centerCircle);
}

function updateStatsOnSolves(array) {
  const filter = document.querySelector('#filter-menu div.disabled')?.innerText
  if(filter == '+2 Only')
    array = array.filter(solve => solve.plusTwo == 1)
  else if(filter == 'No +2s')
    array = array.filter(solve => solve.plusTwo == 0)
  else if(filter == 'DNF only')
    array = array.filter(solve => solve.DNF == 1)
  else if(filter == 'No DNFs')
    array = array.filter(solve => solve.DNF == 0)

  const reverseOrder = document.getElementById('reverse-order').checked
  if (document.getElementById('sort-date').checked) {
    array = array.sort((a, b) => {
      return reverseOrder 
        ? new Date(a.endTimestamp) - new Date(b.endTimestamp)
        : new Date(b.endTimestamp) - new Date(a.endTimestamp);
    });
  }
  else if (document.getElementById('sort-time').checked) {
    array = array.sort((a, b) => {
      return reverseOrder 
        ? (b.solveTime + b.plusTwo*2000) - (a.solveTime + a.plusTwo*2000)
        : (a.solveTime + a.plusTwo*2000) - (b.solveTime + b.plusTwo*2000);
    });
  }

  let currpage = document.querySelector('.paggination #page-info span:first-child').innerText;

  document.querySelectorAll('.solves-count').forEach(el => el.innerText = array.length)

  if(array.length == 0) {
    document.getElementById('solves-list').innerHTML = '<p>Could not find any solves</p>';
    return;
  }
  document.getElementById('solves-list').innerHTML = '';
  for(let i = (currpage-1)*25; i < currpage*25 && array.length > i; i++) {
    document.getElementById('solves-list').insertAdjacentHTML('beforeend', `<div class="bulkSolve">
      <div style="text-align: left">
        <div class="bulkSolveTime">
          ${formatTime(array[i].solveTime, array[i].plusTwo, array[i].DNF)}
        </div>
        <div>
          ${format(array[i].endTimestamp, 'dd/MM/yyyy HH:mm:ss')}
        </div>
      </div>
      <div id="${i}SolveInfoButton" style="background: #333; padding: 5px 11px; border-radius: 15px; cursor: pointer;">${showSolveTypeName(array[0].typeId)}</div>
    </div>`);
    document.getElementById(`${i}SolveInfoButton`).onclick = () => showTimeInfo(array[i], array);
  }
  document.querySelector('.paggination #page-info span:nth-child(2)').innerText = Math.ceil(array.length/25)
}

export function addSolveToList(solve, array) {
  const solveIndex = array.indexOf(solve);
  const solvesDiv = document.querySelector('.solves');
  const statsDiv = document.querySelector('.stats');
  let finalDiv = '';
  if(solvesDiv)
    finalDiv = solvesDiv;
  else if(statsDiv)
    finalDiv = statsDiv
  
  if(!finalDiv)
    return;
  finalDiv.insertAdjacentHTML('afterbegin', `
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
  document.getElementById(`${solveIndex}PlusTwo`).addEventListener('click', () => plusTwo(solve, array));
  document.getElementById(`${solveIndex}DNF`).addEventListener('click', () => DNF(solve, array));
  document.getElementById(`${solveIndex}DeleteTime`).addEventListener('click', () => deleteTime(solve, array));
  document.getElementById(`${solveIndex}SolveTimeSpan`).addEventListener('click', () => showTimeInfo(solve, array));
}