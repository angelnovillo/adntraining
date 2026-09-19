const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const longNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

let selected = new Date();
selected.setHours(12, 0, 0, 0);

const today = new Date();
today.setHours(12, 0, 0, 0);

const $ = selector => document.querySelector(selector);

const esc = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

function sameDay(first, second) {
  return first.toDateString() === second.toDateString();
}

function weekStart(date) {
  const result = new Date(date);
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  return result;
}

function renderWeek() {
  const root = $('#week');
  root.innerHTML = '';
  const start = weekStart(selected);

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    const button = document.createElement('button');
    button.className = 'day-pill'
      + (sameDay(date, selected) ? ' active' : '')
      + (sameDay(date, today) ? ' today' : '');
    button.innerHTML = `<span class="name">${names[date.getDay()]}</span><span class="num">${date.getDate()}</span>`;
    button.addEventListener('click', () => {
      selected = date;
      render();
    });
    root.appendChild(button);
  }
}

function renderExercise(exercise) {
  return `
    <details class="workout">
      <summary>
        <span class="icon">${exercise.icon}</span>
        <div class="exercise-meta">
          <strong>${esc(exercise.title)}</strong>
          <small>${esc(exercise.group)}</small>
        </div>
        <span class="sets">${esc(exercise.sets)}<br><small>${esc(exercise.rest)}</small></span>
        <span class="chevron">⌄</span>
      </summary>
      <div class="exercise-detail">
        <div class="detail-grid">
          <div class="stat"><span>Series · repes</span><b>${esc(exercise.sets)}</b></div>
          <div class="stat"><span>Descanso</span><b>${esc(exercise.rest)}</b></div>
        </div>
        <p class="notes">${esc(exercise.notes)}</p>
        <div class="alt"><b>Alternativa:</b> ${esc(exercise.alt)}</div>
        ${exercise.video ? `<a class="video" target="_blank" rel="noopener" href="${exercise.video}">▶ Ver técnica en vídeo</a>` : ''}
        ${exercise.image ? `<div class="media"><img src="${exercise.image}" alt="Referencia visual: ${esc(exercise.title)}" loading="lazy"></div>` : ''}
      </div>
    </details>`;
}

function render() {
  const dayPlan = plan[selected.getDay()];
  const dayName = longNames[selected.getDay()];
  const month = selected.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  $('#dateTitle').textContent = `${dayName[0].toUpperCase()}${dayName.slice(1)} ${selected.getDate()}`;
  $('#dateSub').textContent = month;

  const hero = $('#hero');
  hero.style.setProperty('--hero1', dayPlan.color);
  hero.style.setProperty('--hero2', dayPlan.color2);
  hero.innerHTML = `
    <span class="tag">${dayPlan.type}</span>
    <h2>${dayPlan.title}</h2>
    <p>${dayPlan.intro}</p>
    <div class="chips">${dayPlan.chips.map(chip => `<span class="chip">${chip}</span>`).join('')}</div>`;

  $('#workoutTitle').textContent = dayPlan.type.includes('GYM') ? 'Rutina de hoy' : 'Sesión de hoy';
  $('#workouts').innerHTML = dayPlan.sessions.map(renderExercise).join('');
  $('#effort').textContent = dayPlan.effort;
  $('#recovery').innerHTML = `
    <p>Para que esta sesión sume y no reste:</p>
    <ul>${dayPlan.recovery.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;

  renderWeek();
}

$('#prevBtn').addEventListener('click', () => {
  selected.setDate(selected.getDate() - 1);
  render();
});

$('#nextBtn').addEventListener('click', () => {
  selected.setDate(selected.getDate() + 1);
  render();
});

$('#todayBtn').addEventListener('click', () => {
  selected = new Date(today);
  render();
});

render();