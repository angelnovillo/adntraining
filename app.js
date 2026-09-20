const STORE = 'adntraining-redesign-v1';
const selected = new Date();
selected.setHours(12, 0, 0, 0);
let activeView = 'today';
let dietTab = 'today';
let activeExercise = 0;
let restSeconds = 0;
let timerId = null;

// Theme management
let currentTheme = localStorage.getItem('adn-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.getElementById('metaThemeColor');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#090d16' : '#f8fafc');
  localStorage.setItem('adn-theme', theme);
}
applyTheme(currentTheme);

const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const keyOf = date => date.toISOString().slice(0, 10);
const cloneDate = date => new Date(date.getTime());

// High quality SVG icons
const ICONS = {
  today: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`,
  week: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/></svg>`,
  diet: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" x2="6" y1="1" y2="4"/><line x1="10" x2="10" y1="1" y2="4"/><line x1="14" x2="14" y1="1" y2="4"/></svg>`,
  progress: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  chevronLeft: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  chevronRight: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  calendarDot: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg>`,
  info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  dumbbell: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1a2.83 2.83 0 0 1 0-4l1-1a1 1 0 0 0 0-1.41l-2.83-2.83a1 1 0 0 0-1.41 0l-1 1a2.83 2.83 0 0 1-4 0l-1-1"/><path d="m3 3 1 1a2.83 2.83 0 0 1 0 4l-1 1a1 1 0 0 0 0 1.41l2.83 2.83a1 1 0 0 0 1.41 0l1-1a2.83 2.83 0 0 1 4 0l1 1"/></svg>`,
  bike: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`,
  run: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l6-6-2-2-4 4"/><path d="M14 6l-4 4 2 2 4-4"/><circle cx="17" cy="4" r="2"/><path d="M15 13l2 4 4 1"/></svg>`,
  recovery: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  timer: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="8"/><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="15" y1="14" y2="11"/></svg>`,
  whatsapp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  download: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="15" y1="12" y2="3"/></svg>`,
  flame: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`
};

function kindIcon(kind) {
  const k = (kind || '').toLowerCase();
  if (k.includes('gym')) return ICONS.dumbbell;
  if (k.includes('bike') || k.includes('bici')) return ICONS.bike;
  if (k.includes('run') || k.includes('carrera')) return ICONS.run;
  return ICONS.recovery;
}

function kindClass(kind) {
  const k = (kind || '').toLowerCase();
  if (k.includes('gym')) return 'pill-gym';
  if (k.includes('bike') || k.includes('bici')) return 'pill-bike';
  if (k.includes('run') || k.includes('carrera')) return 'pill-run';
  return 'pill-recovery';
}

function loadAll() {
  try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; }
}

function saveAll(data) {
  localStorage.setItem(STORE, JSON.stringify(data));
}

function getLog(date = selected) {
  const data = loadAll();
  return data[keyOf(date)] || { status: 'pending', meals: {}, homeMeal: null, extras: [], note: '', exercisesDone: [] };
}

function setLog(log, date = selected) {
  const data = loadAll();
  data[keyOf(date)] = log;
  saveAll(data);
}

function getWeights() {
  try { return JSON.parse(localStorage.getItem(`${STORE}-weights`)) || {}; } catch { return {}; }
}

function setWeights(weights) {
  localStorage.setItem(`${STORE}-weights`, JSON.stringify(weights));
}

function weekStart(date) {
  const output = cloneDate(date);
  const day = output.getDay() || 7;
  output.setDate(output.getDate() - day + 1);
  return output;
}

function addDays(date, days) {
  const output = cloneDate(date);
  output.setDate(output.getDate() + days);
  return output;
}

function formatDate(date) {
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

function shortDate(date) {
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function mealsFor(date = selected) {
  return mealTemplates[workoutFor(date).nutrition] || mealTemplates.training;
}

function nextMeal(date = selected) {
  const now = new Date();
  const meals = mealsFor(date);
  if (keyOf(now) !== keyOf(date)) return meals[0];
  const minutes = now.getHours() * 60 + now.getMinutes();
  return meals.find(meal => {
    const [h, m] = meal.time.split(':').map(Number);
    return h * 60 + m >= minutes - 45;
  }) || meals[meals.length - 1];
}

function completionLabel(status) {
  return { pending: 'Pendiente', complete: 'Completo', partial: 'Parcial', missed: 'No realizado' }[status] || 'Pendiente';
}

function renderTopbar(title, subtitle) {
  return `<header class="topbar">
    <div>
      <p class="eyebrow">${APP_CONFIG.athleteName} · ADN Training</p>
      <h1>${esc(title)}</h1>
      <p class="exercise-sub">${esc(subtitle)}</p>
    </div>
    <div class="date-controls">
      <button class="icon-button" data-shift="-1" type="button" aria-label="Día anterior" title="Día anterior">${ICONS.chevronLeft}</button>
      <button class="icon-button today-btn" data-today type="button" aria-label="Ir a hoy" title="Ir a hoy">${ICONS.calendarDot} <span>Hoy</span></button>
      <button class="icon-button" data-shift="1" type="button" aria-label="Día siguiente" title="Día siguiente">${ICONS.chevronRight}</button>
      <button class="icon-button theme-toggle" id="themeToggle" type="button" aria-label="Cambiar tema" title="Cambiar tema">${currentTheme === 'dark' ? ICONS.sun : ICONS.moon}</button>
    </div>
  </header>`;
}

function renderToday() {
  const phase = phaseFor(selected);
  const plan = workoutFor(selected);
  const log = getLog();
  const main = plan.sessions[0];
  const meal = nextMeal();
  const mealDone = Boolean(log.meals[meal.id]);
  const exercise = plan.gymExercises[activeExercise] || null;
  const doneCount = Object.values(log.meals || {}).filter(Boolean).length;
  const extras = log.extras || [];

  $('#view-today').innerHTML = `${renderTopbar(`${capitalize(DAY_NAMES[selected.getDay()])}: ${main.title}`, `${formatDate(selected)} · ${phase.label}: ${phase.headline}`)}
    <section class="hero-action">
      <div class="action-title">
        <span class="pill ${kindClass(main.kind)}">${kindIcon(main.kind)} ${esc(main.kind)} · ${esc(phase.effort)}</span>
        <h2>${esc(main.title)}</h2>
        <p class="exercise-sub">${plan.gymExercises.length ? `${plan.gymExercises.length} ejercicios de hipertrofia planificados` : main.notes}</p>
      </div>
      <div>
        <div class="meta-row">
          <article><span>Duración</span><b>${esc(main.duration)}</b></article>
          <article><span>Hora</span><b>${APP_CONFIG.trainingHour}</b></article>
          <article><span>Estado</span><b>${completionLabel(log.status)}</b></article>
        </div>
        <button class="primary-button full" data-start-session type="button">${plan.gymExercises.length ? 'Empezar sesión' : 'Marcar actividad'}</button>
      </div>
    </section>

    <details class="phase-fold">
      <summary>Contexto de fase, RIR y progresión</summary>
      <p>${esc(phase.description)}</p>
    </details>

    ${exercise ? renderActiveSession(plan, log, exercise) : ''}

    <section class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">${ICONS.diet}</span>
        <h2>Siguiente comida</h2>
      </div>
      <small class="counter-badge">${esc(meal.time)}</small>
    </section>
    ${renderMealCard(meal, mealDone, true)}

    <section class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">${ICONS.progress}</span>
        <h2>Estado del día</h2>
      </div>
      <small class="counter-badge">Guardado local</small>
    </section>
    <div class="status-grid">
      <article class="status-card ${log.status}"><span>Entreno</span><b>${completionLabel(log.status)}</b></article>
      <article class="status-card"><span>Dieta</span><b>${doneCount}/${mealsFor().length} comidas</b></article>
      <article class="status-card"><span>Extra</span><b>${extras.length ? `${extras.length} registrado(s)` : 'Sin extras'}</b></article>
    </div>

    <section class="section-head">
      <h2>Acciones rápidas</h2>
    </section>
    <div class="quick-actions">
      <button class="secondary-button" data-open-weight type="button">Registrar peso</button>
      <button class="secondary-button" data-open-extra type="button">Añadir comida extra</button>
    </div>

    <details class="recovery-panel">
      <summary>Recuperación y notas del día</summary>
      <p>Sueño, digestión y articulaciones mandan sobre el orgullo. Si notas molestias agudas, reduce la carga o sustituye la máquina.</p>
      <textarea data-note placeholder="Escribe aquí notas sobre sensaciones, fatiga o dolores...">${esc(log.note)}</textarea>
    </details>`;
}

function renderActiveSession(plan, log, exercise) {
  const done = log.exercisesDone || [];
  return `<section class="section-head">
    <div class="section-title-wrap">
      <span class="section-icon">${ICONS.dumbbell}</span>
      <h2>Sesión activa</h2>
    </div>
    <small class="counter-badge">${activeExercise + 1} de ${plan.gymExercises.length}</small>
  </section>
  <section class="session-panel">
    <div class="exercise-progress-dots">
      ${plan.gymExercises.map((_, i) => `<span class="step-dot ${i === activeExercise ? 'is-current' : (done[i] ? 'is-done' : '')}"></span>`).join('')}
    </div>
    <div class="exercise-current">
      <div class="exercise-header">
        <span class="pill pill-gym">${esc(exercise.group)}</span>
        <span class="rest-badge">${ICONS.timer} ${esc(exercise.rest)}</span>
      </div>
      <h3>${esc(exercise.title)}</h3>
      <p class="exercise-sub"><b>Series y reps:</b> ${esc(exercise.sets)}</p>
    </div>
    <div class="timer">
      <div class="timer-inner">
        <span class="timer-label">TEMPORIZADOR DESCANSO</span>
        <b>${formatTimer(restSeconds)}</b>
        <div class="timer-quick-actions">
          <button class="timer-chip" data-timer-adjust="-15" type="button">-15s</button>
          <button class="timer-chip" data-timer-adjust="30" type="button">+30s</button>
          <button class="timer-chip" data-timer-reset type="button">90s</button>
          <button class="timer-chip" data-timer-toggle type="button">${timerId ? 'Pausar' : (restSeconds > 0 ? 'Reanudar' : 'Descanso')}</button>
        </div>
      </div>
    </div>
    <div class="button-row">
      <button class="primary-button done-button" data-done-exercise type="button">${done[activeExercise] ? `${ICONS.check} Hecha` : `${ICONS.check} Hecha`}</button>
      <button class="secondary-button" data-skip-exercise type="button">Saltar</button>
      <button class="secondary-button" data-technique="${activeExercise}" type="button">${ICONS.info} Técnica</button>
    </div>
    <button class="ghost-button full" data-occupied="${activeExercise}" type="button">¿Máquina ocupada? Ver alternativas</button>
  </section>`;
}

function renderMealCard(meal, done, compact = false) {
  return `<article class="${compact ? 'next-meal' : 'meal-open'} meal-card ${done ? 'is-done' : ''}">
    <div class="meal-title">
      <div>
        <div class="meal-meta">
          <span class="meal-slot-badge">${esc(meal.slot)}</span>
          <span class="meal-time">${esc(meal.time)}</span>
        </div>
        <h3>${esc(meal.title)}</h3>
      </div>
      <button class="icon-button sm" data-meal-info="${esc(meal.id)}" type="button" aria-label="Información">${ICONS.info}</button>
    </div>
    <p class="qty">${esc(meal.qty)}</p>
    <ul class="alt-list">${meal.alt.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
    <button class="${done ? 'secondary-button is-completed' : 'primary-button'} full meal-toggle-btn" data-toggle-meal="${esc(meal.id)}" type="button">
      ${done ? `${ICONS.check} Comida hecha` : 'Marcar como hecha'}
    </button>
    ${meal.id === 'comida' ? '<button class="ghost-button full" data-home-toggle type="button">🍲 Hoy hay comida de casa (elegir plato)</button>' : ''}
  </article>`;
}

function renderWeek() {
  const start = weekStart(selected);
  const rows = [];
  let workoutScore = 0;
  let mealsDone = 0;
  let mealsTotal = 0;

  for (let i = 0; i < 7; i += 1) {
    const date = addDays(start, i);
    const plan = workoutFor(date);
    const log = getLog(date);
    const score = { complete: 1, partial: .5, missed: 0, pending: 0 }[log.status] || 0;
    workoutScore += score;
    mealsDone += Object.values(log.meals || {}).filter(Boolean).length;
    mealsTotal += mealsFor(date).length;
    rows.push({ date, plan, log });
  }

  const adherence = Math.round(((workoutScore / 7) * .7 + (mealsDone / Math.max(1, mealsTotal)) * .3) * 100);

  $('#view-week').innerHTML = `${renderTopbar('Semana', `${shortDate(start)} - ${shortDate(rows[6].date)} · adherencia ${adherence}%`)}
    <div class="week-strip">
      ${rows.map(row => `<button class="day-button ${keyOf(row.date) === keyOf(selected) ? 'is-selected' : ''}" data-pick-date="${keyOf(row.date)}" type="button">
        <b class="day-name">${DAY_SHORT[row.date.getDay()]}</b>
        <span class="day-num">${row.date.getDate()}</span>
        <span class="dot-wrap"><i class="dot ${row.log.status}"></i></span>
      </button>`).join('')}
    </div>
    <section class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">${ICONS.week}</span>
        <h2>Plan semanal</h2>
      </div>
      <small class="counter-badge">${adherence}% de consistencia</small>
    </section>
    <div class="calendar-list">
      ${rows.map(row => `<article class="day-row">
        <div class="day-row-date">
          <strong>${DAY_SHORT[row.date.getDay()]}</strong>
          <span>${row.date.getDate()}</span>
        </div>
        <div class="day-row-info">
          <b>${esc(row.plan.sessions[0].title)}</b>
          <p>${kindIcon(row.plan.sessions[0].kind)} ${esc(phaseFor(row.date).label)} · ${esc(nutritionProfiles[row.plan.nutrition].label)}</p>
        </div>
        <span class="status-pill status-${row.log.status}">${completionLabel(row.log.status)}</span>
      </article>`).join('')}
    </div>`;
}

function renderDiet() {
  const plan = workoutFor(selected);
  const profile = nutritionProfiles[plan.nutrition];
  const log = getLog();
  const meals = mealsFor();
  const totals = estimateTotals(profile, log, meals);
  const open = nextMeal();

  $('#view-diet').innerHTML = `${renderTopbar('Nutrición', `${formatDate(selected)} · ${profile.label}`)}
    <div class="tabs">
      <button class="${dietTab === 'today' ? 'is-active' : ''}" data-diet-tab="today" type="button">Día a día</button>
      <button class="${dietTab === 'week' ? 'is-active' : ''}" data-diet-tab="week" type="button">Menú semanal</button>
    </div>
    <section class="diet-panel ${dietTab === 'today' ? 'is-active' : ''}">
      <section class="section-head">
        <div class="section-title-wrap">
          <span class="section-icon">${ICONS.flame}</span>
          <h2>Objetivo del día</h2>
        </div>
        <small class="counter-badge">${profile.kcal} kcal objetivo</small>
      </section>
      <div class="metric-grid four">
        ${macroCard('Kcal', totals.kcal, profile.kcal, 'kcal', 'emerald')}
        ${macroCard('Proteína', totals.protein, profile.protein, 'g', 'blue')}
        ${macroCard('Hidratos', totals.carbs, profile.carbs, 'g', 'amber')}
        ${macroCard('Grasas', totals.fat, profile.fat, 'g', 'purple')}
      </div>
      <section class="section-head">
        <div class="section-title-wrap">
          <span class="section-icon">${ICONS.diet}</span>
          <h2>Distribución de comidas</h2>
        </div>
        <small class="counter-badge">Siguiente abierta</small>
      </section>
      <div class="timeline">
        ${meals.map(meal => renderMealCard(meal, Boolean(log.meals[meal.id]), meal.id !== open.id)).join('')}
      </div>
      ${renderHomeSelector(log)}
      <section class="section-head">
        <h2>Comida extra o social</h2>
      </section>
      ${renderExtraBox(log)}
    </section>
    <section class="diet-panel ${dietTab === 'week' ? 'is-active' : ''}">
      ${renderWeeklyDiet()}
    </section>`;
}

function renderWeeklyDiet() {
  const start = weekStart(selected);
  const rows = [];
  for (let i = 0; i < 7; i += 1) {
    const date = addDays(start, i);
    const plan = workoutFor(date);
    const meals = mealsFor(date);
    const profile = nutritionProfiles[plan.nutrition];
    rows.push({ date, plan, meals, profile });
  }

  return `<section class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">${ICONS.diet}</span>
        <h2>Menú semanal detallado</h2>
      </div>
      <small class="counter-badge">Gramos en seco</small>
    </section>
    <div class="weekly-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Día</th>
            <th>Tipo</th>
            <th>Comida</th>
            <th>Merienda / Pre</th>
            <th>Cena</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => {
            const comida = row.meals.find(meal => meal.id === 'comida') || row.meals[2];
            const pre = row.meals.find(meal => meal.id === 'pre') || row.meals.find(meal => meal.id === 'merienda') || row.meals[1];
            const cena = row.meals.find(meal => meal.id === 'cena') || row.meals[row.meals.length - 1];
            return `<tr>
              <td><b>${DAY_SHORT[row.date.getDay()]} ${row.date.getDate()}</b></td>
              <td><span class="pill ${kindClass(row.plan.sessions[0].kind)}">${esc(row.profile.label)}</span><br><small style="color:var(--muted)">${row.profile.kcal} kcal</small></td>
              <td><b>${esc(comida.title)}</b><br><small style="color:var(--muted)">${esc(comida.qty)}</small></td>
              <td><b>${esc(pre.title)}</b><br><small style="color:var(--muted)">${esc(pre.qty)}</small></td>
              <td><b>${esc(cena.title)}</b><br><small style="color:var(--muted)">${esc(cena.qty)}</small></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div class="share-actions">
      <button class="primary-button" data-share-week type="button">${ICONS.whatsapp} Compartir por WhatsApp</button>
      <button class="secondary-button" data-download-week type="button">${ICONS.download} Descargar imagen</button>
    </div>`;
}

function renderProgress() {
  const start = weekStart(selected);
  const weights = getWeights();
  const rows = [];
  let workoutScore = 0;
  let mealsDone = 0;
  let mealsTotal = 0;

  for (let i = 0; i < 7; i += 1) {
    const date = addDays(start, i);
    const log = getLog(date);
    workoutScore += ({ complete: 1, partial: .5, missed: 0, pending: 0 }[log.status] || 0);
    mealsDone += Object.values(log.meals || {}).filter(Boolean).length;
    mealsTotal += mealsFor(date).length;
    rows.push({ date, log, weight: weights[keyOf(date)] });
  }

  const weekWeights = rows.map(row => Number(row.weight)).filter(Boolean);
  const avg = weekWeights.length ? (weekWeights.reduce((a, b) => a + b, 0) / weekWeights.length).toFixed(1) : '—';
  const trainingPercent = Math.round((workoutScore / 7) * 100);
  const dietPercent = Math.round((mealsDone / Math.max(1, mealsTotal)) * 100);

  $('#view-progress').innerHTML = `${renderTopbar('Progreso', `${phaseFor(selected).label} · ${phaseFor(selected).range}`)}
    <div class="metric-grid four">
      <article class="metric-card"><span>Peso medio</span><b>${avg} kg</b></article>
      <article class="metric-card"><span>Entreno</span><b>${trainingPercent}%</b></article>
      <article class="metric-card"><span>Dieta</span><b>${dietPercent}%</b></article>
      <article class="metric-card"><span>Fase</span><b>${esc(phaseFor(selected).effort)}</b></article>
    </div>
    <section class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">${ICONS.progress}</span>
        <h2>Registrar peso matinal</h2>
      </div>
      <small class="counter-badge">En ayunas</small>
    </section>
    <form class="form-grid" id="weightForm">
      <input type="date" name="date" value="${keyOf(selected)}" aria-label="Fecha de registro">
      <input type="number" name="weight" min="35" max="150" step="0.1" placeholder="Ej: 54.5 kg" aria-label="Peso en kg">
      <button class="primary-button" type="submit">Guardar</button>
    </form>
    <section class="section-head">
      <h2>Evolución semanal</h2>
      <small class="counter-badge">${weekWeights.length} registros</small>
    </section>
    <div class="history-list">
      ${rows.map(row => `<article class="history-row">
        <div class="day-row-date">
          <strong>${DAY_SHORT[row.date.getDay()]}</strong>
          <span>${row.date.getDate()}</span>
        </div>
        <div>
          <b>${row.weight ? `${row.weight} kg` : 'Sin registrar'}</b>
          <p>${completionLabel(row.log.status)} · ${Object.values(row.log.meals || {}).filter(Boolean).length}/${mealsFor(row.date).length} comidas</p>
        </div>
        <span class="status-pill status-${row.log.status}">${phaseFor(row.date).label}</span>
      </article>`).join('')}
    </div>
    <section class="section-head">
      <h2>Ajuste inteligente de kcal</h2>
    </section>
    <article class="compact-card">
      <p>💡 <b>Regla de oro:</b> Busca ganar entre <b>0,14 y 0,28 kg por semana</b> de media sostenida durante 2 semanas. Si la báscula se estanca, suma 100-150 kcal/día. Si subes más rápido, recorta 100-150 kcal. Si estás en rango, ¡no toques nada y mantén el plan!</p>
    </article>`;
}

function renderHomeSelector(log) {
  return `<section class="home-selector">
    <h3>Comida de casa (sustituciones)</h3>
    <p class="exercise-sub">Sustituye la comida principal manteniendo las proporciones exactas de hidratos y proteína.</p>
    <div class="home-options">
      ${Object.entries(homeMeals).map(([key, meal]) => `<button class="${log.homeMeal === key ? 'is-selected' : ''}" data-home-meal="${key}" type="button">
        <b>🍲 ${esc(meal.name)}</b>
        <span><b>Cantidades:</b> ${esc(meal.grams)}</span>
        <span><b>Alternativas:</b> ${esc(meal.alt)}</span>
      </button>`).join('')}
    </div>
  </section>`;
}

function renderExtraBox(log) {
  return `<article class="compact-card">
    <form class="form-grid" id="extraForm">
      <input name="name" required placeholder="Ej: Pizza, merienda extra, restaurante..." aria-label="Nombre del extra">
      <input name="kcal" required min="0" type="number" placeholder="kcal aprox." aria-label="Calorías">
      <button class="primary-button" type="submit">Añadir</button>
    </form>
    <div class="history-list" style="margin-top:12px">
      ${(log.extras || []).map((extra, i) => `<article class="history-row">
        <strong>${esc(extra.kcal)} kcal</strong>
        <div><b>${esc(extra.name)}</b></div>
        <button class="ghost-button" data-remove-extra="${i}" type="button">Eliminar</button>
      </article>`).join('') || '<p class="exercise-sub">Sin extras registrados hoy.</p>'}
    </div>
  </article>`;
}

function macroCard(label, current, target, unit, colorClass = 'emerald') {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return `<article class="metric-card">
    <span>${esc(label)}</span>
    <b>${Math.round(current)} / ${target} <small style="font-size:0.75rem;font-weight:600">${unit}</small></b>
    <div class="macro-bar ${colorClass}"><i style="width:${pct}%"></i></div>
  </article>`;
}

function estimateTotals(profile, log, meals) {
  const checked = Object.values(log.meals || {}).filter(Boolean).length;
  const fraction = checked / Math.max(1, meals.length);
  const total = {
    kcal: profile.kcal * fraction,
    protein: profile.protein * fraction,
    carbs: profile.carbs * fraction,
    fat: profile.fat * fraction
  };
  if (log.homeMeal && log.meals.comida && homeMeals[log.homeMeal]) {
    const home = homeMeals[log.homeMeal];
    total.kcal += home.kcal - profile.kcal / meals.length;
    total.protein += home.protein - profile.protein / meals.length;
    total.carbs += home.carbs - profile.carbs / meals.length;
    total.fat += home.fat - profile.fat / meals.length;
  }
  (log.extras || []).forEach(extra => { total.kcal += Number(extra.kcal) || 0; });
  return total;
}

function playTimerSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.14); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
    if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
  } catch {}
}

function attachEvents() {
  $$('[data-view]').forEach(button => { button.onclick = () => { activeView = button.dataset.view; render(); }; });
  $$('[data-shift]').forEach(button => button.addEventListener('click', () => { selected.setDate(selected.getDate() + Number(button.dataset.shift)); activeExercise = 0; render(); }));
  $$('[data-today]').forEach(button => button.addEventListener('click', () => { const now = new Date(); selected.setFullYear(now.getFullYear(), now.getMonth(), now.getDate()); activeExercise = 0; render(); }));
  $$('[data-pick-date]').forEach(button => button.addEventListener('click', () => { const [y, m, d] = button.dataset.pickDate.split('-').map(Number); selected.setFullYear(y, m - 1, d); render(); }));
  $$('[data-start-session]').forEach(button => button.addEventListener('click', () => { const log = getLog(); log.status = 'partial'; setLog(log); render(); }));
  $$('[data-done-exercise]').forEach(button => button.addEventListener('click', () => {
    const log = getLog();
    log.exercisesDone = log.exercisesDone || [];
    log.exercisesDone[activeExercise] = true;
    const plan = workoutFor(selected);
    if (activeExercise < plan.gymExercises.length - 1) activeExercise += 1;
    if (log.exercisesDone.filter(Boolean).length === plan.gymExercises.length) log.status = 'complete';
    restSeconds = 90;
    startTimer();
    setLog(log);
    render();
  }));
  $$('[data-skip-exercise]').forEach(button => button.addEventListener('click', () => { const plan = workoutFor(selected); activeExercise = Math.min(activeExercise + 1, Math.max(0, plan.gymExercises.length - 1)); render(); }));
  $$('[data-technique]').forEach(button => button.addEventListener('click', () => openTechnique(Number(button.dataset.technique))));
  $$('[data-occupied]').forEach(button => button.addEventListener('click', () => openSubstitutions(Number(button.dataset.occupied))));
  $$('[data-toggle-meal]').forEach(button => button.addEventListener('click', () => { const log = getLog(); log.meals[button.dataset.toggleMeal] = !log.meals[button.dataset.toggleMeal]; setLog(log); render(); }));
  $$('[data-meal-info]').forEach(button => button.addEventListener('click', () => openMealInfo(button.dataset.mealInfo)));
  $$('[data-home-meal]').forEach(button => button.addEventListener('click', () => { const log = getLog(); log.homeMeal = log.homeMeal === button.dataset.homeMeal ? null : button.dataset.homeMeal; setLog(log); render(); }));
  $$('[data-diet-tab]').forEach(button => button.addEventListener('click', () => { dietTab = button.dataset.dietTab; render(); }));
  $$('[data-open-weight]').forEach(button => button.addEventListener('click', () => { activeView = 'progress'; render(); }));
  $$('[data-open-extra]').forEach(button => button.addEventListener('click', () => { activeView = 'diet'; dietTab = 'today'; render(); }));
  $$('[data-home-toggle]').forEach(button => button.addEventListener('click', () => { activeView = 'diet'; dietTab = 'today'; render(); }));
  $$('[data-note]').forEach(area => area.addEventListener('change', () => { const log = getLog(); log.note = area.value; setLog(log); }));
  
  // Timer quick controls
  $$('[data-timer-adjust]').forEach(button => {
    button.onclick = () => {
      restSeconds = Math.max(0, restSeconds + Number(button.dataset.timerAdjust));
      const timer = $('.timer b');
      if (timer) timer.textContent = formatTimer(restSeconds);
      if (!timerId && restSeconds > 0) startTimer();
    };
  });

  $$('[data-timer-reset]').forEach(button => {
    button.onclick = () => {
      restSeconds = 90;
      const timer = $('.timer b');
      if (timer) timer.textContent = formatTimer(restSeconds);
      startTimer();
    };
  });

  $$('[data-timer-toggle]').forEach(button => {
    button.onclick = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
        button.textContent = 'Reanudar';
      } else if (restSeconds > 0) {
        startTimer();
        button.textContent = 'Pausar';
      }
    };
  });

  // Theme toggle on all topbars
  $$('.theme-toggle').forEach(btn => {
    btn.onclick = () => {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
      render();
    };
  });

  const weightForm = $('#weightForm');
  if (weightForm) weightForm.addEventListener('submit', event => { event.preventDefault(); const form = new FormData(weightForm); const weights = getWeights(); weights[form.get('date')] = Number(form.get('weight')); setWeights(weights); render(); });
  const extraForm = $('#extraForm');
  if (extraForm) extraForm.addEventListener('submit', event => { event.preventDefault(); const form = new FormData(extraForm); const log = getLog(); log.extras = log.extras || []; log.extras.push({ name: form.get('name'), kcal: Number(form.get('kcal')) }); setLog(log); render(); });
  $$('[data-remove-extra]').forEach(button => button.addEventListener('click', () => { const log = getLog(); log.extras.splice(Number(button.dataset.removeExtra), 1); setLog(log); render(); }));
  $$('[data-share-week]').forEach(button => button.addEventListener('click', shareWeek));
  $$('[data-download-week]').forEach(button => button.addEventListener('click', downloadWeek));
}

function openTechnique(index) {
  const exercise = workoutFor(selected).gymExercises[index];
  if (!exercise) return;
  openModal(`<h2>${esc(exercise.title)}</h2>
    <p><b>Series y reps:</b> ${esc(exercise.sets)} · <b>Descanso:</b> ${esc(exercise.rest)}</p>
    <p style="margin-top:8px">${esc(exercise.notes)}</p>
    <div style="margin-top:14px;padding:12px;border-radius:10px;background:var(--surface-2)">
      <p style="color:var(--accent-amber);font-weight:700">⚠️ Errores habituales a evitar:</p>
      <p style="margin-top:4px;font-size:0.88rem">Perder el apoyo lumbar o dorsal, usar inercia en vez de controlar la fase excéntrica, o bloquear las articulaciones bruscamente.</p>
    </div>
    ${exercise.video ? `<p style="margin-top:14px"><a href="${exercise.video}" target="_blank" rel="noopener">▶ Ver vídeo explicativo de técnica</a></p>` : ''}`);
}

function openSubstitutions(index) {
  const exercise = workoutFor(selected).gymExercises[index];
  if (!exercise) return;
  openModal(`<h2>Alternativas si la máquina está ocupada</h2>
    <p>Para sustituir: <b>${esc(exercise.title)}</b></p>
    <ul>${exercise.substitutions.map(item => `<li><b>${esc(item)}</b></li>`).join('')}</ul>
    <p style="font-size:0.86rem;color:var(--muted)">Mismo patrón de movimiento y estímulo muscular sin esperar turno.</p>`);
}

function openMealInfo(id) {
  const meal = mealsFor().find(item => item.id === id);
  if (!meal) return;
  openModal(`<h2>${esc(meal.slot)} · ${esc(meal.time)}</h2>
    <p style="font-size:1.05rem;font-weight:700">${esc(meal.title)}</p>
    <p style="margin-top:8px;color:var(--primary);font-weight:600">🎯 ${esc(meal.why)}</p>
    <p style="margin-top:10px"><b>Ración recomendada:</b><br>${esc(meal.qty)}</p>
    <p style="margin-top:10px"><b>Alternativas válidas:</b></p>
    <ul>${meal.alt.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`);
}

function openModal(html) {
  $('#modalContent').innerHTML = html;
  $('#infoModal').showModal();
}

function startTimer() {
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    restSeconds = Math.max(0, restSeconds - 1);
    const timer = $('.timer b');
    if (timer) timer.textContent = formatTimer(restSeconds);
    if (restSeconds <= 0) {
      clearInterval(timerId);
      timerId = null;
      playTimerSound();
    }
  }, 1000);
}

function formatTimer(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function drawWeeklyCanvas() {
  const canvas = $('#shareCanvas');
  const ctx = canvas.getContext('2d');
  const start = weekStart(selected);

  // Modern athletic dark poster design
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative ambient glow
  const gradient = ctx.createLinearGradient(0, 0, 1080, 200);
  gradient.addColorStop(0, '#10b981');
  gradient.addColorStop(1, '#3b82f6');
  ctx.fillStyle = gradient;
  ctx.fillRect(60, 50, 960, 6);

  // Header
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 48px Plus Jakarta Sans, Inter, Arial';
  ctx.fillText('ADN TRAINING', 60, 120);

  ctx.fillStyle = '#10b981';
  ctx.font = '700 24px Plus Jakarta Sans, Inter, Arial';
  ctx.fillText('PLAN SEMANAL DE ENTRENAMIENTO Y NUTRICIÓN', 60, 160);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 24px Plus Jakarta Sans, Inter, Arial';
  ctx.fillText(`Semana del ${shortDate(start)} al ${shortDate(addDays(start, 6))} · Atleta: ${APP_CONFIG.athleteName}`, 60, 200);

  let y = 260;
  for (let i = 0; i < 7; i += 1) {
    const date = addDays(start, i);
    const plan = workoutFor(date);
    const meals = mealsFor(date);
    const comida = meals.find(meal => meal.id === 'comida') || meals[2];
    const pre = meals.find(meal => meal.id === 'pre') || meals.find(meal => meal.id === 'merienda') || meals[1];
    const cena = meals.find(meal => meal.id === 'cena') || meals[meals.length - 1];

    // Card background
    ctx.fillStyle = i % 2 === 0 ? '#111827' : '#151e30';
    roundRect(ctx, 50, y - 32, 980, 185, 16);
    ctx.fill();

    // Card border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Day & Session tag
    ctx.fillStyle = '#10b981';
    ctx.font = '800 26px Plus Jakarta Sans, Inter, Arial';
    ctx.fillText(`${DAY_SHORT[date.getDay()].toUpperCase()} ${date.getDate()} · ${plan.sessions[0].title}`, 75, y + 2);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 20px Plus Jakarta Sans, Inter, Arial';
    ctx.fillText(`${nutritionProfiles[plan.nutrition].label} (${nutritionProfiles[plan.nutrition].kcal} kcal)`, 750, y + 2);

    // Meals lines
    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 21px Inter, Arial';
    wrap(ctx, `Comida: ${comida.title} — ${comida.qty}`, 75, y + 42, 920, 26);
    wrap(ctx, `Pre / Merienda: ${pre.title} — ${pre.qty}`, 75, y + 86, 920, 26);
    wrap(ctx, `Cena: ${cena.title} — ${cena.qty}`, 75, y + 130, 920, 26);

    y += 205;
  }

  // Footer notes card
  ctx.fillStyle = '#111827';
  roundRect(ctx, 50, y - 20, 980, 160, 16);
  ctx.fill();

  ctx.fillStyle = '#10b981';
  ctx.font = '800 24px Plus Jakarta Sans, Inter, Arial';
  ctx.fillText('INSTRUCCIONES CLAVE PARA CASA', 75, y + 20);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 20px Inter, Arial';
  wrap(ctx, '• Pasta y arroz: pesos indicados siempre en seco.  • Entrenamientos: planificados a las 19:00 h.', 75, y + 60, 920, 28);
  wrap(ctx, '• Si falta algún ingrediente, utiliza las alternativas exactas indicadas en la app ADN Training.', 75, y + 96, 920, 28);

  return canvas;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrap(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y);
}

async function canvasBlob() {
  const canvas = drawWeeklyCanvas();
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1));
}

async function shareWeek() {
  const blob = await canvasBlob();
  const file = new File([blob], 'menu-semanal-adn-training.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], title: 'Menú semanal ADN Training', text: 'Menú semanal con cantidades y alternativas exactas.' });
  } else {
    downloadBlob(blob);
  }
}

async function downloadWeek() {
  const blob = await canvasBlob();
  downloadBlob(blob);
}

function downloadBlob(blob) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'menu-semanal-adn-training.png';
  link.click();
  URL.revokeObjectURL(link.href);
}

function render() {
  renderToday();
  renderWeek();
  renderDiet();
  renderProgress();
  $$('.view').forEach(view => view.classList.toggle('is-active', view.id === `view-${activeView}`));
  $$('.nav-item').forEach(button => button.classList.toggle('is-active', button.dataset.view === activeView));
  attachEvents();
}

$('#closeModal').addEventListener('click', () => $('#infoModal').close());
render();
