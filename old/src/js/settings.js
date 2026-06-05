import { getItem, setItem } from '../utils/localStorage.js';

let settings = getItem('settings')
let newSettings = {};

function loadSettings() {
  settings = getItem('settings');
  if(!settings) {
    updateSettings();
    return;
  }
  document.querySelectorAll('.setting input[type="checkbox"]').forEach(el => el.checked = settings[el.id])
  document.querySelectorAll('.setting input[type="number"]').forEach(el => el.value = settings[el.id])
  document.querySelectorAll('.setting select').forEach(el => el.value = getItem('settings').decimalPoints)
}

function updateSettings() {
  newSettings = {};
  document.querySelectorAll('.setting input[type="checkbox"]').forEach(el => {
    newSettings = {
      ...newSettings,
      [el.id]: el.checked,
    }
  })
  document.querySelectorAll('.setting input[type="number"]').forEach(el => {
    newSettings = {
      ...newSettings,
      [el.id]: +el.value,
    }
  })
  document.querySelectorAll('.setting select').forEach(el => {
    newSettings = {
      ...newSettings,
      [el.id]: +el.options[el.selectedIndex].value,
    }
  })
  setItem('settings', {...settings, ...newSettings})
}

function check(id) {
  document.getElementById(id).checked = !document.getElementById(id).checked;
  updateSettings();
}

document.querySelectorAll('.setting select, .setting input').forEach(el => {
  el.addEventListener('change', updateSettings)
  if(el.min || el.max) {
    el.addEventListener('input', () => {
      if(el.min && el.value < el.min)
        el.value = el.min
      else if(el.max && el.value > el.max)
        el.value = el.max
    })
  }
})

window.addEventListener('load', loadSettings)
document.querySelectorAll('.setting span').forEach(el => {
  el.addEventListener('click', () => {
    check(el.attributes.value.value)
  })
})

console.log(getItem('settings'));