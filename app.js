const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const longNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
let selected = new Date();
selected.setHours(12, 0, 0, 0);
const today = new Date();
today.setHours(12, 0, 0, 0);

const $ = selector => document.querySelector(selector);
const dateKey = date => date.toISOString().slice(0, 10);
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function weekStart(date) { const output = new Date(date); const day = output.getDay() || 7; output.setDate(output.getDate() - day + 1); return output; }

function getLog(date = selected) {
  const logs = load('adntraining-v2-logs', {});
  return logs[dateKey(date)] || { status: 'pending', note: '', mealChecks: {}, homeMeal: null, extras: [] };
}
function setLog(log, date = selected) {
  const logs = load('adntraining-v2-logs', {});
  logs[dateKey(date)] = log;
  save('adntraining-v2-logs', logs);
}

function renderWeek() {
  const root = $('#week'); root.innerHTML = '';
  const start = weekStart(selected);
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(start); date.setDate(start.getDate() + i);
    const status = getLog(date).status;
    const button = document.createElement('button');
    button.className = `day-pill ${sameDay(date, selected) ? 'active' : ''} ${sameDay(date, today) ? 'today' : ''} ${status}`;
    button.innerHTML = `<span class="name">${names[date.getDay()]}</span><span class="num">${date.getDate()}</span><i></i>`;
    button.addEventListener('click', () => { selected = date; render(); });
    root.appendChild(button);
  }
}

function renderSessions(items) {
  return items.map(item => `<article class="session-card"><span class="session-icon">${item.icon}</span><div><span class="session-kind">${esc(item.kind)}</span><h4>${esc(item.title)}</h4><p>${esc(item.notes)}</p></div><b>${esc(item.target)}</b></article>`).join('');
}

function renderExercise(item) {
  return `<details class="workout"><summary><span class="icon">${item.icon}</span><div class="exercise-meta"><strong>${esc(item.title)}</strong><small>${esc(item.group)}</small></div><span class="sets">${esc(item.sets)}<br><small>${esc(item.rest)}</small></span><span class="chevron">⌄</span></summary><div class="exercise-detail"><div class="detail-grid"><div class="stat"><span>Series · repes</span><b>${esc(item.sets)}</b></div><div class="stat"><span>Descanso</span><b>${esc(item.rest)}</b></div></div><p class="notes"><b>Por qué y cómo:</b> ${esc(item.notes)}</p><div class="alt"><b>Si está ocupada:</b> ${esc(item.alt)}</div>${item.video ? `<a class="video" target="_blank" rel="noopener" href="${item.video}">▶ Ver técnica en vídeo</a>` : ''}${item.image ? `<div class="media"><img src="${item.image}" loading="lazy" alt="Referencia visual: ${esc(item.title)}"></div>` : ''}</div></details>`;
}

function getMeals(profileKey) { return mealTemplates[profileKey] || mealTemplates.training; }
function getNutritionTotal(profile, log) {
  const meals = getMeals(profile);
  const checks = Object.values(log.mealChecks).filter(Boolean).length;
  const total = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  const fraction = meals.length ? checks / meals.length : 0;
  total.kcal = profile.kcal * fraction;
  total.protein = profile.protein * fraction;
  total.carbs = profile.carbs * fraction;
  total.fat = profile.fat * fraction;
  if (log.homeMeal && log.mealChecks.Comida) {
    const home = homeMeals[log.homeMeal];
    total.kcal += home.kcal - profile.kcal / meals.length;
    total.protein += home.protein - profile.protein / meals.length;
    total.carbs += home.carbs - profile.carbs / meals.length;
    total.fat += home.fat - profile.fat / meals.length;
  }
  (log.extras || []).forEach(extra => { total.kcal += Number(extra.kcal) || 0; total.protein += Number(extra.protein) || 0; total.carbs += Number(extra.carbs) || 0; total.fat += Number(extra.fat) || 0; });
  return total;
}
function macro(label, current, target, unit = 'g') { const value = Math.round(current); const width = Math.min(100, Math.round((current / target) * 100)); return `<div class="macro"><div><span>${label}</span><b>${value} / ${target}${unit}</b></div><i><em style="width:${width}%"></em></i></div>`; }

function renderNutrition(profileKey) {
  const profile = nutritionProfiles[profileKey];
  const log = getLog();
  const meals = getMeals(profileKey);
  const total = getNutritionTotal(profile, log);
  const chosenHome = log.homeMeal ? homeMeals[log.homeMeal] : null;

  const mealHtml = meals.map(([slot, title, qty, why]) => {
    const shortSlot = slot.startsWith('Comida') ? 'Comida' : slot;
    const checked = Boolean(log.mealChecks[shortSlot]);
    return `<article class="meal-card ${checked ? 'done' : ''}"><div class="meal-head"><div><span>${esc(slot)}</span><h4>${esc(title)}</h4></div><label><input type="checkbox" data-meal="${esc(shortSlot)}" ${checked ? 'checked' : ''}> Hecho</label></div><p class="quantity">${esc(qty)}</p><p><b>Por qué:</b> ${esc(why)}</p></article>`;
  }).join('');

  const homeHtml = Object.entries(homeMeals).map(([key, meal]) => `<button class="home-option ${log.homeMeal === key ? 'selected' : ''}" data-home="${key}"><b>${esc(meal.name)}</b><span>≈ ${meal.kcal} kcal · P ${meal.protein} g</span></button>`).join('');

  $('#nutrition').innerHTML = `<div class="section-title"><h3>Nutrición de hoy</h3><span>${profile.kcal} kcal objetivo</span></div><section class="nutrition-hero"><div><p class="eyebrow">Volumen limpio</p><h3>${esc(profile.note)}</h3><p>Base sencilla con pan blanco tostado, fruta, arroz, pasta, patata, ñoquis, pollo, magro, queso de Burgos y comida de casa. Marca el menú que sigas; registra únicamente extras o cambios.</p></div></section><div class="macro-grid">${macro('Kcal', total.kcal, profile.kcal, ' kcal')}${macro('Proteína', total.protein, profile.protein)}${macro('Hidratos', total.carbs, profile.carbs)}${macro('Grasas', total.fat, profile.fat)}</div><div class="section-title"><h3>Menú base</h3><span>La comida de casa cuenta</span></div><div class="meals">${mealHtml}</div><section class="home-box"><h3>¿Qué hay en casa hoy?</h3><p>Selecciona el plato si sustituye la comida del menú. No necesitas decir que no al potaje, a las lentejas o al pisto: el plan adapta lo demás alrededor.</p><div class="home-options">${homeHtml}</div>${chosenHome ? `<div class="home-advice"><h4>${esc(chosenHome.name)}</h4><p><b>Qué aporta:</b> ${esc(chosenHome.why)}</p><p><b>Cómo encajarlo:</b> ${esc(chosenHome.advice)}</p></div>` : ''}</section><section class="extra-box"><h3>Extra o fuera de plan</h3><p>Úsalo para comida social, restaurante o capricho. Se registra sin compensar con ayuno o cardio: importa la tendencia semanal.</p><form id="extraForm"><input name="name" required placeholder="Ej.: 2 porciones de pizza"><input name="kcal" required min="0" type="number" placeholder="kcal aprox."><button>Añadir</button></form><div class="extra-list">${(log.extras || []).map((extra, i) => `<div><span>${esc(extra.name)} · ${extra.kcal} kcal</span><button data-extra-remove="${i}">Eliminar</button></div>`).join('')}</div></section>`;

  document.querySelectorAll('[data-meal]').forEach(input => input.addEventListener('change', event => { const next = getLog(); next.mealChecks[event.target.dataset.meal] = event.target.checked; setLog(next); renderNutrition(profileKey); renderSummary(); }));
  document.querySelectorAll('[data-home]').forEach(button => button.addEventListener('click', () => { const next = getLog(); next.homeMeal = next.homeMeal === button.dataset.home ? null : button.dataset.home; setLog(next); renderNutrition(profileKey); renderSummary(); }));
  $('#extraForm').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.currentTarget); const next = getLog(); next.extras.push({ name: form.get('name'), kcal: form.get('kcal') }); setLog(next); renderNutrition(profileKey); renderSummary(); });
  document.querySelectorAll('[data-extra-remove]').forEach(button => button.addEventListener('click', () => { const next = getLog(); next.extras.splice(Number(button.dataset.extraRemove), 1); setLog(next); renderNutrition(profileKey); renderSummary(); }));
}

function renderCompletion(workout) {
  const log = getLog();
  const options = [['complete', '✓ Completo', '100%'], ['partial', '◐ Parcial', '50%'], ['missed', '× No realizado', '0%']];
  $('#completion').innerHTML = `<p>Marca el resultado real. En gym, “completo” significa hacer la rutina prevista; en bici/run, cumplir el tipo y una duración razonable. No sirve para castigarte: sirve para ver patrones y ajustar.</p><div class="status-buttons">${options.map(([value, label, percent]) => `<button class="${log.status === value ? 'active ' + value : ''}" data-status="${value}"><b>${label}</b><span>${percent}</span></button>`).join('')}</div><textarea id="dayNote" placeholder="Nota opcional: sensaciones, dolor, motivo de ajuste...">${esc(log.note || '')}</textarea>`;
  document.querySelectorAll('[data-status]').forEach(button => button.addEventListener('click', () => { const next = getLog(); next.status = button.dataset.status; setLog(next); renderCompletion(workout); renderWeek(); renderSummary(); }));
  $('#dayNote').addEventListener('change', event => { const next = getLog(); next.note = event.target.value; setLog(next); });
}

function renderSummary() {
  const root = $('#weeklySummary'); const start = weekStart(selected); const logs = load('adntraining-v2-logs', {}); const weights = load('adntraining-v2-weights', {});
  let workoutScore = 0; let nutritionChecks = 0; let nutritionPossible = 0; let kcalSum = 0; let proteinSum = 0; const rows = []; const weekWeights = [];
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(start); date.setDate(start.getDate() + i);
    const plan = workoutFor(date); const profile = nutritionProfiles[plan.nutrition]; const log = logs[dateKey(date)] || { status: 'pending', mealChecks: {}, extras: [] }; const scoreMap = { complete: 1, partial: .5, missed: 0, pending: 0 }; const currentScore = scoreMap[log.status] ?? 0;
    const total = getNutritionTotal(profile, log); const meals = getMeals(plan.nutrition);
    workoutScore += currentScore; nutritionChecks += Object.values(log.mealChecks || {}).filter(Boolean).length; nutritionPossible += meals.length; kcalSum += total.kcal; proteinSum += total.protein;
    if (weights[dateKey(date)]) weekWeights.push(Number(weights[dateKey(date)]));
    rows.push(`<tr><td>${names[date.getDay()]} ${date.getDate()}</td><td>${log.status === 'complete' ? '✓' : log.status === 'partial' ? '◐' : log.status === 'missed' ? '×' : '—'}</td><td>${Math.round(total.kcal)} / ${profile.kcal}</td><td>${Math.round(total.protein)} / ${profile.protein} g</td></tr>`);
  }
  const trainingPercent = Math.round((workoutScore / 7) * 100);
  const nutritionPercent = nutritionPossible ? Math.round((nutritionChecks / nutritionPossible) * 100) : 0;
  const global = Math.round(trainingPercent * .7 + nutritionPercent * .3);
  const avgWeight = weekWeights.length ? (weekWeights.reduce((a,b) => a+b,0) / weekWeights.length).toFixed(1) : '—';
  root.innerHTML = `<section class="weekly-hero"><p class="eyebrow">Resumen semanal</p><h2>Consistencia antes que perfección</h2><p>Gym tiene el mayor peso porque tu prioridad es construir tren superior. Nutrición ayuda a que la carga se traduzca en recuperación y ganancia gradual.</p></section><div class="summary-grid"><article><span>Éxito global</span><b>${global}%</b><small>70% entreno · 30% nutrición</small></article><article><span>Entrenamiento</span><b>${trainingPercent}%</b><small>Completo 100 · parcial 50</small></article><article><span>Nutrición base</span><b>${nutritionPercent}%</b><small>Comidas marcadas</small></article><article><span>Peso medio</span><b>${avgWeight} kg</b><small>${weekWeights.length} registro(s)</small></article></div><section class="weight-box"><h3>Registrar peso matinal</h3><p>Al levantarte, tras ir al baño y antes de desayunar. La media semanal importa más que una subida o bajada puntual por líquidos o hidratos.</p><form id="weightForm"><input type="date" name="date" value="${dateKey(selected)}"><input type="number" name="weight" min="35" max="150" step="0.1" placeholder="kg"><button>Guardar</button></form></section><section class="adjustment"><h3>Ajuste de calorías</h3><p>Durante dos semanas, busca una ganancia aproximada de 0,14–0,28 kg/semana. Si no subes, añade 100–150 kcal/día; si subes claramente más durante dos semanas, resta 100–150 kcal. Si estás en rango, no cambies nada.</p></section><section class="weekly-table"><h3>Semana seleccionada</h3><table><thead><tr><th>Día</th><th>Estado</th><th>Kcal</th><th>Proteína</th></tr></thead><tbody>${rows.join('')}</tbody></table></section>`;
  $('#weightForm').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.currentTarget); const all = load('adntraining-v2-weights', {}); all[form.get('date')] = Number(form.get('weight')); save('adntraining-v2-weights', all); renderSummary(); });
}

function render() {
  const phase = phaseFor(selected); const workout = workoutFor(selected); const dayName = longNames[selected.getDay()];
  $('#dateTitle').textContent = `${dayName[0].toUpperCase()}${dayName.slice(1)} ${selected.getDate()}`;
  $('#dateSub').textContent = selected.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  $('#phaseCard').innerHTML = `<article class="phase-card" style="--phase:${phase.color}"><span>${phase.label}</span><b>${phase.range}</b><p>${phase.description}</p></article>`;
  $('#hero').style.setProperty('--hero1', phase.color); $('#hero').style.setProperty('--hero2', '#14243a');
  $('#hero').innerHTML = `<span class="tag">${phase.label}</span><h2>${workout.sessions[0].title}</h2><p>${workout.sessions.map(item => item.notes).join(' ')}</p>`;
  $('#effort').textContent = phase.effort;
  $('#sessions').innerHTML = renderSessions(workout.sessions);
  $('#gymSection').innerHTML = workout.gymExercises.length ? `<div class="section-title"><h3>Rutina de máquinas</h3><span>Descanso incluido</span></div><div class="workouts">${workout.gymExercises.map(renderExercise).join('')}</div>` : `<section class="no-gym"><h3>${phase.id === 'prep' ? 'Sin gym hasta el 1 de octubre' : 'Hoy no toca gimnasio'}</h3><p>${phase.id === 'prep' ? 'Esta fase protege tu recuperación y te permite llegar con ganas al inicio. Usa este tiempo para organizar horarios, registrar peso y mantener bici/carrera con cabeza.' : 'La prioridad del día es la sesión principal indicada arriba. El descanso también es parte de progresar.'}</p></section>`;
  renderCompletion(workout); renderNutrition(workout.nutrition); renderWeek(); renderSummary();
}

$('#prevBtn').addEventListener('click', () => { selected.setDate(selected.getDate() - 1); render(); });
$('#nextBtn').addEventListener('click', () => { selected.setDate(selected.getDate() + 1); render(); });
$('#todayBtn').addEventListener('click', () => { selected = new Date(today); render(); });
render();