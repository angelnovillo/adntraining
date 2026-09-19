/* Pega este archivo como app.js en la raíz del repositorio. */

const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const longNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
let selected = new Date();
selected.setHours(12, 0, 0, 0);
const today = new Date();
today.setHours(12, 0, 0, 0);

const $ = selector => document.querySelector(selector);
const esc = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const dateKey = date => date.toISOString().slice(0, 10);
const sameDay = (first, second) => first.toDateString() === second.toDateString();

function weekStart(date) {
  const result = new Date(date);
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  return result;
}

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getDayLog() {
  const all = load('adntraining-day-log', {});
  return all[dateKey(selected)] || { meals: {}, home: null, extras: [] };
}

function setDayLog(nextLog) {
  const all = load('adntraining-day-log', {});
  all[dateKey(selected)] = nextLog;
  save('adntraining-day-log', all);
}

function renderWeek() {
  const root = $('#week');
  root.innerHTML = '';
  const start = weekStart(selected);

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const button = document.createElement('button');
    button.className = 'day-pill' + (sameDay(date, selected) ? ' active' : '') + (sameDay(date, today) ? ' today' : '');
    button.innerHTML = `<span class="name">${names[date.getDay()]}</span><span class="num">${date.getDate()}</span>`;
    button.addEventListener('click', () => { selected = date; render(); });
    root.appendChild(button);
  }
}

function renderExercise(exercise) {
  return `<details class="workout"><summary><span class="icon">${exercise.icon}</span><div class="exercise-meta"><strong>${esc(exercise.title)}</strong><small>${esc(exercise.group)}</small></div><span class="sets">${esc(exercise.sets)}<br><small>${esc(exercise.rest)}</small></span><span class="chevron">⌄</span></summary><div class="exercise-detail"><div class="detail-grid"><div class="stat"><span>Series · repes</span><b>${esc(exercise.sets)}</b></div><div class="stat"><span>Descanso</span><b>${esc(exercise.rest)}</b></div></div><p class="notes">${esc(exercise.notes)}</p><div class="alt"><b>Alternativa:</b> ${esc(exercise.alt)}</div>${exercise.video ? `<a class="video" target="_blank" rel="noopener" href="${exercise.video}">▶ Ver técnica en vídeo</a>` : ''}${exercise.image ? `<div class="media"><img src="${exercise.image}" alt="Referencia visual: ${esc(exercise.title)}" loading="lazy"></div>` : ''}</div></details>`;
}

function mealTotals(profile, log) {
  const followed = profile.meals.filter(item => log.meals[item.slot]);
  const total = followed.reduce((acc, item) => ({ kcal: acc.kcal + item.kcal, protein: acc.protein + item.protein, carbs: acc.carbs + item.carbs, fat: acc.fat + item.fat }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });
  const home = log.home ? homeMeals[log.home] : null;
  if (home) {
    const main = profile.meals.find(item => item.slot === 'Comida') || profile.meals.find(item => item.slot.includes('comida'));
    if (main && log.meals[main.slot]) {
      total.kcal += home.estimate.kcal - main.kcal;
      total.protein += home.estimate.protein - main.protein;
      total.carbs += home.estimate.carbs - main.carbs;
      total.fat += home.estimate.fat - main.fat;
    }
  }
  (log.extras || []).forEach(extra => { total.kcal += Number(extra.kcal) || 0; total.protein += Number(extra.protein) || 0; total.carbs += Number(extra.carbs) || 0; total.fat += Number(extra.fat) || 0; });
  return total;
}

function macroCard(label, amount, target, unit = 'g') {
  const percent = Math.min(100, Math.round((amount / target) * 100));
  return `<div class="macro"><div class="macro-top"><span>${label}</span><b>${Math.round(amount)} / ${target}${unit}</b></div><div class="bar"><i style="width:${percent}%"></i></div></div>`;
}

function renderNutrition(dayPlan) {
  const profile = nutrition[dayPlan.nutritionType];
  const activeProfile = profile.meals.length ? profile : nutrition.bike;
  const log = getDayLog();
  const totals = mealTotals(activeProfile, log);
  const target = profile.target;
  const extraNote = profile.extra ? `<div class="nutrition-note"><b>Ajuste del día:</b> ${esc(profile.extra)}</div>` : '';

  const meals = activeProfile.meals.map(item => {
    const checked = Boolean(log.meals[item.slot]);
    const swaps = item.swaps?.length ? `<p class="swaps"><b>Alternativas:</b> ${item.swaps.map(esc).join(' · ')}</p>` : '';
    return `<article class="meal-card ${checked ? 'done' : ''}"><div class="meal-head"><div><span class="meal-slot">${esc(item.slot)}</span><h4>${esc(item.title)}</h4></div><label class="check"><input type="checkbox" data-meal="${esc(item.slot)}" ${checked ? 'checked' : ''}><span>Hecho</span></label></div><p class="quantity">${esc(item.quantity)}</p><div class="meal-macros">≈ ${item.kcal} kcal · P ${item.protein} g · HC ${item.carbs} g · G ${item.fat} g</div><p class="meal-why"><b>Por qué:</b> ${esc(item.why)}</p>${item.timing ? `<p class="timing">⏱ ${esc(item.timing)}</p>` : ''}${swaps}</article>`;
  }).join('');

  const homeOptions = Object.entries(homeMeals).map(([key, item]) => `<button class="home-option ${log.home === key ? 'selected' : ''}" data-home="${key}"><b>${esc(item.name)}</b><span>≈ ${item.estimate.kcal} kcal · ${item.estimate.protein} g proteína</span></button>`).join('');
  const selectedHome = log.home ? homeMeals[log.home] : null;

  $('#nutrition').innerHTML = `<section class="nutrition-hero"><div><p class="eyebrow">Nutrición de hoy</p><h3>${esc(profile.label)}</h3><p>${esc(profile.context)}</p></div><div class="goal-kcal"><span>Objetivo</span><b>${target.kcal}</b><small>kcal aprox.</small></div></section><div class="macro-grid">${macroCard('Calorías', totals.kcal, target.kcal, ' kcal')}${macroCard('Proteína', totals.protein, target.protein)}${macroCard('Hidratos', totals.carbs, target.carbs)}${macroCard('Grasas', totals.fat, target.fat)}</div>${extraNote}<div class="section-title"><h3>Menú base</h3><span>Marca lo que sigas</span></div><div class="meals">${meals}</div><div class="home-box"><div class="section-title"><h3>¿Qué hay en casa hoy?</h3><span>Cuenta como comida</span></div><p>La comida de casa no rompe el plan: sustituye la comida principal. Selecciónala para ver qué aporta y cómo equilibrar merienda y cena.</p><div class="home-options">${homeOptions}</div>${selectedHome ? `<div class="home-advice"><h4>${esc(selectedHome.name)}</h4><p><b>Qué aporta:</b> ${esc(selectedHome.why)}</p><p><b>Cómo encajarlo:</b> ${esc(selectedHome.advice)}</p></div>` : ''}</div><div class="extra-box"><div class="section-title"><h3>Extra o fuera de plan</h3><span>Sin culpa, con contexto</span></div><p>Registra solo lo que se salga de tu menú base. Una comida social no exige compensar con ayuno o cardio; importa la media semanal.</p><form id="extraForm"><input name="name" required placeholder="Ej.: 2 porciones de pizza" aria-label="Descripción del extra"><input name="kcal" type="number" min="0" required placeholder="kcal aprox." aria-label="Calorías aproximadas"><details><summary>Macros opcionales</summary><div class="optional-macros"><input name="protein" type="number" min="0" placeholder="Proteína g"><input name="carbs" type="number" min="0" placeholder="Hidratos g"><input name="fat" type="number" min="0" placeholder="Grasas g"></div></details><button class="add-extra" type="submit">+ Añadir extra</button></form><div class="extra-list">${(log.extras || []).map((item, index) => `<div><span>${esc(item.name)} · ${item.kcal} kcal</span><button data-remove-extra="${index}">Eliminar</button></div>`).join('')}</div></div>`;

  document.querySelectorAll('[data-meal]').forEach(input => input.addEventListener('change', event => {
    const next = getDayLog();
    next.meals[event.target.dataset.meal] = event.target.checked;
    setDayLog(next);
    renderNutrition(dayPlan);
  }));

  document.querySelectorAll('[data-home]').forEach(button => button.addEventListener('click', () => {
    const next = getDayLog();
    next.home = next.home === button.dataset.home ? null : button.dataset.home;
    setDayLog(next);
    renderNutrition(dayPlan);
  }));

  $('#extraForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = getDayLog();
    next.extras.push({ name: form.get('name'), kcal: form.get('kcal'), protein: form.get('protein'), carbs: form.get('carbs'), fat: form.get('fat') });
    setDayLog(next);
    renderNutrition(dayPlan);
  });

  document.querySelectorAll('[data-remove-extra]').forEach(button => button.addEventListener('click', () => {
    const next = getDayLog();
    next.extras.splice(Number(button.dataset.removeExtra), 1);
    setDayLog(next);
    renderNutrition(dayPlan);
  }));
}

function renderSummary() {
  const root = $('#weeklySummary');
  if (!root) return;
  const start = weekStart(selected);
  const logs = load('adntraining-day-log', {});
  const weights = load('adntraining-weights', {});
  let plannedKcal = 0; let loggedKcal = 0; let plannedProtein = 0; let loggedProtein = 0; let completedMeals = 0; let availableMeals = 0;
  const rows = [];

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(start); date.setDate(start.getDate() + index);
    const currentPlan = plan[date.getDay()];
    const profile = nutrition[currentPlan.nutritionType];
    const effectiveProfile = profile.meals.length ? profile : nutrition.bike;
    const log = logs[dateKey(date)] || { meals: {}, extras: [] };
    const total = mealTotals(effectiveProfile, log);
    plannedKcal += profile.target.kcal;
    plannedProtein += profile.target.protein;
    loggedKcal += total.kcal;
    loggedProtein += total.protein;
    completedMeals += Object.values(log.meals).filter(Boolean).length;
    availableMeals += effectiveProfile.meals.length;
    rows.push(`<tr><td>${names[date.getDay()]} ${date.getDate()}</td><td>${currentPlan.type.split(' · ')[0]}</td><td>${Math.round(total.kcal)} / ${profile.target.kcal}</td><td>${Math.round(total.protein)} / ${profile.target.protein} g</td></tr>`);
  }

  const weightEntries = Object.entries(weights).filter(([key]) => { const d = new Date(`${key}T12:00:00`); return d >= start && d <= new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 12); }).map(([, value]) => Number(value)).filter(Boolean);
  const averageWeight = weightEntries.length ? (weightEntries.reduce((a, b) => a + b, 0) / weightEntries.length).toFixed(1) : '—';
  const adherence = availableMeals ? Math.round((completedMeals / availableMeals) * 100) : 0;
  const suggestion = 'Mira la media de peso durante 2 semanas: si no sube aproximadamente 0,14–0,28 kg/semana, añade 100–150 kcal/día. Si sube claramente más deprisa durante 2 semanas, resta 100–150 kcal/día. Si estás dentro del rango, mantén.';

  root.innerHTML = `<section class="weekly-hero"><p class="eyebrow">Resumen semanal</p><h2>Volumen limpio, con datos</h2><p>El objetivo no es registrar cada mordisco: es seguir la base, ver tendencias y ajustar poco a poco. La referencia es una ganancia lenta, no una subida rápida de peso.</p></section><div class="summary-grid"><div class="summary-card"><span>Media de peso</span><b>${averageWeight} kg</b><small>${weightEntries.length} registro(s) esta semana</small></div><div class="summary-card"><span>Adherencia menú base</span><b>${adherence}%</b><small>${completedMeals}/${availableMeals} comidas marcadas</small></div><div class="summary-card"><span>Kcal registradas</span><b>${Math.round(loggedKcal / 7)}</b><small>media/día · objetivo ${Math.round(plannedKcal / 7)}</small></div><div class="summary-card"><span>Proteína registrada</span><b>${Math.round(loggedProtein / 7)} g</b><small>media/día · objetivo ${Math.round(plannedProtein / 7)} g</small></div></div><div class="weight-box"><h3>Registrar peso matinal</h3><p>Pésate al levantarte, tras ir al baño y antes de desayunar. No juzgues un único día: la media semanal reduce el ruido de líquidos, sal e hidratos.</p><form id="weightForm"><input type="date" name="date" value="${dateKey(selected)}" required><input type="number" name="weight" min="35" max="150" step="0.1" placeholder="Peso en kg" required><button type="submit">Guardar peso</button></form></div><div class="adjustment"><h3>Ajuste de calorías</h3><p>${suggestion}</p></div><div class="weekly-table"><h3>Semana seleccionada</h3><table><thead><tr><th>Día</th><th>Plan</th><th>Kcal</th><th>Proteína</th></tr></thead><tbody>${rows.join('')}</tbody></table></div><div class="principles"><h3>Principios de esta fase</h3><ul><li>Proteína estable cerca de 110 g/día; el hidrato cambia según la carga.</li><li>80–90% alimentos base; 10–20% flexible. Los extras se registran, no se castigan.</li><li>La comida de casa cuenta como comida principal: no tienes que rechazar potajes, lentejas, pisto o magro.</li><li>Con tu historial digestivo, prioriza tolerancia: si algo causa dolor, ardor o náusea, sustitúyelo y consulta a un profesional sanitario.</li></ul></div>`;

  $('#weightForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = load('adntraining-weights', {});
    next[form.get('date')] = Number(form.get('weight'));
    save('adntraining-weights', next);
    renderSummary();
  });
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
  hero.innerHTML = `<span class="tag">${dayPlan.type}</span><h2>${dayPlan.title}</h2><p>${dayPlan.intro}</p><div class="chips">${dayPlan.chips.map(chip => `<span class="chip">${chip}</span>`).join('')}</div>`;
  $('#workoutTitle').textContent = dayPlan.type.includes('GYM') ? 'Rutina de hoy' : 'Sesión de hoy';
  $('#workouts').innerHTML = dayPlan.sessions.map(renderExercise).join('');
  $('#effort').textContent = dayPlan.effort;
  $('#recovery').innerHTML = `<p>Para que esta sesión sume y no reste:</p><ul>${dayPlan.recovery.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
  renderNutrition(dayPlan);
  renderWeek();
  renderSummary();
}

$('#prevBtn').addEventListener('click', () => { selected.setDate(selected.getDate() - 1); render(); });
$('#nextBtn').addEventListener('click', () => { selected.setDate(selected.getDate() + 1); render(); });
$('#todayBtn').addEventListener('click', () => { selected = new Date(today); render(); });
render();