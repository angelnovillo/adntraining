const APP_CONFIG = {
  gymStart: '2026-10-01',
  adaptationEnd: '2026-10-28',
  progressionStart: '2026-10-29',
  weightKg: 54.1
};

const IMG = {
  chest: 'https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/1c1a27a1-10df-54c6-9b8a-91700068a8d3/d90d4096-05bd-5065-a360-9a5d5368b3e4.jpg',
  pulldown: 'https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/970acedb-a03f-5033-8888-df67d16af194/7a774c10-0fb0-52e7-9e55-e098632ce07a.jpg',
  legpress: 'https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/eaaba39e-1bb2-5a3a-8a57-d80d2e148f9d/e1b1b401-9eba-53da-bbf6-4f114842517a.jpg'
};

const videos = {
  chest: 'https://www.youtube.com/watch?v=rY0B8UFdne0',
  pulldown: 'https://www.youtube.com/watch?v=rpkWBC1gCcE',
  machines: 'https://www.youtube.com/watch?v=kCs4Jj0X-Dc',
  pec: 'https://www.youtube.com/watch?v=wsNAD1BpiaE',
  row: 'https://www.youtube.com/watch?v=tozrI76n4QE',
  pull2: 'https://www.youtube.com/watch?v=bGxl-bpoL2E'
};

const ex = (group, title, sets, rest, notes, alt, video, image, icon = '🏋️') => ({ group, title, sets, rest, notes, alt, video, image, icon });
const session = (title, kind, target, notes, icon) => ({ title, kind, target, notes, icon });

const phases = {
  prep: {
    id: 'prep', label: 'Fase 0 · Preparación', range: 'Hasta el 30 de septiembre', color: '#64748b',
    description: 'Aún no hay gimnasio. Mantén bici y carrera sin añadir fatiga innecesaria; prepara la rutina, la nutrición y la constancia para empezar máquinas el 1 de octubre.',
    effort: 'RPE 2–7/10 · sin fuerza estructurada', nutrition: 'recovery'
  },
  adaptation: {
    id: 'adaptation', label: 'Fase 1 · Adaptación', range: '1–28 de octubre', color: '#0f766e',
    description: 'Aprende ajustes y recorridos en máquinas. El objetivo es repetir bien, no acabar reventado: deja 3–4 repeticiones en recámara y termina con ganas de volver.',
    effort: 'RIR 3–4 · sin fallo muscular', nutrition: 'training'
  },
  progression: {
    id: 'progression', label: 'Fase 2 · Progresión muscular', range: 'Desde el 29 de octubre', color: '#2563eb',
    description: 'Empieza la progresión controlada. En compuestos trabaja normalmente a RIR 1–2; en aislamientos puedes acercarte al fallo técnico solo en la última serie si recuperas bien.',
    effort: 'RIR 1–2 · fallo técnico puntual', nutrition: 'training'
  }
};

function phaseFor(date) {
  const key = date.toISOString().slice(0, 10);
  if (key < APP_CONFIG.gymStart) return phases.prep;
  if (key <= APP_CONFIG.adaptationEnd) return phases.adaptation;
  return phases.progression;
}

const nutritionProfiles = {
  recovery: { kcal: 2200, protein: 110, carbs: 270, fat: 68, note: 'Día suave: proteína estable y menos hidrato que en carga. No es recortar; es adaptar combustible al gasto.' },
  bike: { kcal: 2500, protein: 110, carbs: 365, fat: 62, note: 'Bici: el extra viene sobre todo de hidrato para sostener pedaleo y recuperación, no de grasa.' },
  training: { kcal: 2400, protein: 110, carbs: 330, fat: 64, note: 'Gym: proteína estable para músculo e hidrato suficiente para entrenar a las 19:00 y cenar recuperando.' },
  double: { kcal: 2500, protein: 112, carbs: 355, fat: 62, note: 'Fuerza + carrera: más hidrato antes y después; la grasa no necesita subir para alimentar doble sesión.' },
  long: { kcal: 2750, protein: 110, carbs: 420, fat: 62, note: 'Fondo: desayuna ligero, come durante si dura más de 90 min y recupera gran parte de la energía después.' }
};

const homeMeals = {
  potaje: { name: 'Potaje de alubias, espinacas, pollo y patata', kcal: 650, protein: 35, carbs: 85, fat: 16, why: 'Es una comida completa: alubia y patata aportan hidrato, pollo aporta proteína y espinaca añade micronutrientes. No es una comida fuera de dieta.', advice: 'Si entrenas por la tarde, toma una ración normal a mediodía y deja varias horas para digerir. Completa con plátano + pan blanco tostado antes de entrenar.' },
  lentejas: { name: 'Lentejas con pollo y patata', kcal: 640, protein: 34, carbs: 82, fat: 15, why: 'Aporta hidrato, proteína vegetal, fibra y pollo. Es especialmente útil como comida de mediodía en días de carga moderada.', advice: 'No la tomes justo antes de correr. Si te resulta pesada, reduce algo legumbre y usa fruta/pan en la merienda para llegar con energía.' },
  magro: { name: 'Magro con tomate', kcal: 500, protein: 38, carbs: 25, fat: 24, why: 'El magro da proteína, pero necesita una guarnición de hidrato en días de entrenamiento para cubrir energía.', advice: 'Completa con arroz, pasta, patata, ñoquis o pan. Usa ración mayor de hidrato en bici, gym + run o salida larga.' },
  pisto: { name: 'Pisto manchego', kcal: 330, protein: 10, carbs: 25, fat: 20, why: 'Es una gran base de verdura y sabor, pero no suele aportar suficiente proteína ni energía como plato único.', advice: 'Completa con pollo, huevo o magro, y añade arroz, patata o pan. Si el tomate da molestias, prioriza la versión y cantidad que toleres.' },
  pasta: { name: 'Pasta con pollo y tomate', kcal: 720, protein: 40, carbs: 105, fat: 15, why: 'Pasta para energía y pollo para proteína: una combinación directa y muy útil alrededor de entrenamientos de tarde.', advice: 'En bici o gym + run, usa una ración algo mayor de pasta o añade fruta/pan. En recuperación, reduce pasta pero conserva proteína.' },
  arroz: { name: 'Arroz con pollo o magro', kcal: 700, protein: 40, carbs: 100, fat: 15, why: 'El arroz se ajusta muy fácilmente en cantidad y con pollo o magro forma una comida simple de recuperación.', advice: 'Útil en todo el plan. Aumenta la ración en fondo, bici o doble sesión. Si lo pesas seco, regístralo siempre como seco.' }
};

const mealTemplates = {
  recovery: [
    ['Desayuno', 'Pan blanco tostado + queso de Burgos + fruta', '80 g pan + 100 g queso de Burgos + fruta', 'Aporta hidrato fácil y proteína desde temprano sin usar alimentos raros.'],
    ['Media mañana', 'Fruta + jamón york', '1 fruta + 60–80 g jamón york', 'Es una toma rápida; el jamón york es tu opción de fiambre preferida.'],
    ['Comida', 'Comida de casa o arroz/pasta + proteína', 'Selector de comida de casa', 'La comida casera sustituye esta comida, no se suma por encima.'],
    ['Merienda', 'Fruta + pan tostado o queso de Burgos', '1–2 frutas + 50 g pan o queso fresco', 'Evita llegar a la cena con demasiada hambre y ayuda a repartir energía.'],
    ['Cena', 'Pollo/magro + patata/pan + verdura', '170 g proteína + patata o pan + pisto/verdura', 'Mantiene proteína alta mientras adapta el hidrato a un día de menor carga.']
  ],
  bike: [
    ['Desayuno', 'Pan blanco tostado + queso de Burgos + fruta', '100–110 g pan + 100 g queso de Burgos + fruta', 'Construye una base de hidrato y proteína para un día de bici de tarde.'],
    ['Media mañana', 'Fruta + pan tostado con jamón york', '1 fruta + 70–80 g pan + 60 g jamón york', 'Distribuye energía y evita depender de un picoteo impulsivo.'],
    ['Comida', 'Comida de casa o arroz/pasta + pollo', 'Selector de comida de casa', 'La comida de mediodía ayuda a llenar depósitos para pedalear a las 19:00.'],
    ['Pre-bici · 17:30–18:00', 'Plátano + pan tostado con mermelada/jamón york', '1 plátano + 80–90 g pan', 'Hidrato disponible y baja grasa para pedalear sin sensación de pesadez.'],
    ['Durante · si >90 min', 'Hidrato fácil de transportar', '30–60 g hidrato/hora', 'Comer durante fondos evita acabar vacío y mejora la recuperación posterior.'],
    ['Cena post-bici', 'Arroz/pasta/ñoquis + pollo o magro + fruta', '110 g arroz/pasta seco o 300 g ñoquis + 170 g proteína', 'Reponer hidrato y proteína permite que la bici sume sin arrastrar fatiga.']
  ],
  training: [
    ['Desayuno', 'Pan blanco tostado + queso de Burgos + fruta', '100 g pan + 100 g queso de Burgos + fruta', 'Combina hidrato fácil con proteína repartida desde primera hora.'],
    ['Media mañana', 'Fruta + pan tostado con jamón york', '1 fruta + 70 g pan + 60–80 g jamón york', 'Mantiene una toma de proteína práctica sin cocinar para merendar.'],
    ['Comida', 'Comida de casa o pasta/arroz + pollo/magro', 'Selector de comida de casa', 'La comida de casa es compatible con ganar músculo; solo se ajusta el resto del día.'],
    ['Pre-gym · 17:30–18:00', 'Plátano + pan blanco tostado + jamón york/queso de Burgos', '1 plátano + 70 g pan + proteína ligera', 'Deja 60–90 min antes del gym: hidrato para rendir y poco volumen/grasa para digerir bien.'],
    ['Cena post-gym', 'Arroz, pasta o ñoquis + pollo/magro + fruta', '100 g arroz/pasta seco o 300 g ñoquis + 170 g proteína', 'Cena completa que apoya recuperación y progresión de cargas.']
  ],
  double: [
    ['Desayuno', 'Pan blanco tostado + queso de Burgos + fruta', '110 g pan + queso de Burgos + fruta', 'Empieza a cubrir el extra de hidrato de una sesión doble.'],
    ['Media mañana', 'Fruta + pan tostado con jamón york', '1 fruta + 70 g pan + 60–80 g jamón york', 'Reparte energía y proteína para llegar a la tarde con margen.'],
    ['Comida', 'Comida de casa o pasta/arroz alto en hidrato', 'Selector de comida de casa', 'Una comida completa con varias horas de margen ayuda a llegar a gym + carrera con energía.'],
    ['Pre-entreno · 17:30–18:00', 'Plátano + pan/tortitas + jamón york', '1 plátano + 90 g pan o 4–6 tortitas', 'Más hidrato que un día de gym simple; baja grasa y fibra para evitar molestias.'],
    ['Cena post-gym + run', 'Pasta/arroz/ñoquis + pollo/magro + fruta', '125 g pasta/arroz seco o 350 g ñoquis + 180 g proteína', 'Recupera glucógeno y ofrece proteína para adaptarte al gimnasio.']
  ],
  long: [
    ['Antes de salir · 60–120 min', 'Plátano + pan blanco tostado con miel/mermelada', '1–2 plátanos + 80 g pan', 'Antes de bici/carrera por la mañana se busca hidrato fácil, bajo en grasa y digestible.'],
    ['Durante · si >90 min', 'Hidratación + hidrato', '30–60 g hidrato/hora', 'Comer durante forma parte de un fondo: mantiene energía y reduce el déficit posterior.'],
    ['Comida post-entreno', 'Comida de casa o pasta/arroz + pollo', 'Selector de comida de casa', 'Tras una sesión larga, una comida con hidrato y proteína repone energía sin obsesionarse con una ventana exacta.'],
    ['Merienda', 'Fruta + queso de Burgos o pan con jamón york', '1–2 frutas + proteína ligera', 'Ayuda a seguir recuperando durante la tarde.'],
    ['Cena', 'Patata/arroz/ñoquis + proteína magra', 'Patata 400 g o arroz 90 g seco + 170 g proteína', 'Termina de recuperar para empezar la semana sin déficit energético excesivo.']
  ]
};

const gymPlans = {
  1: [
    ex('Cuádriceps · glúteo', 'Prensa de piernas', '3 × 10–12', '90–120 s', 'Pies a anchura de hombros. Baja sin despegar cadera/lumbar y no bloquees rodillas.', 'Hack squat guiada o multipower con limitadores.', videos.machines, IMG.legpress, '🦵'),
    ex('Cuádriceps', 'Extensión de piernas', '2 × 12–15', '60–75 s', 'Alinea el eje de la máquina con la rodilla. Movimiento controlado, sin golpe final.', 'Prensa ligera con pies bajos.', videos.machines, null, '🦿'),
    ex('Isquios', 'Curl femoral sentado', '3 × 10–12', '75–90 s', 'Cadera pegada al asiento; no dejes caer el peso en la vuelta.', 'Curl femoral tumbado.', videos.machines, null, '🦿'),
    ex('Gemelos', 'Elevación de gemelos en máquina', '2 × 12–15', '60 s', 'Pausa arriba y estira abajo sin rebote.', 'Gemelos en prensa.', videos.machines, null, '🦶'),
    ex('Core', 'Crunch en máquina', '2 × 12–15', '60 s', 'Flexiona tronco sin tirar de brazos ni arquear lumbar.', 'Crunch en polea.', videos.machines, null, '◉')
  ],
  3: [
    ex('Pecho', 'Press de pecho en máquina', '3 × 8–12', '90–120 s', 'Asas a mitad de pecho; pies y espalda apoyados; no encoger hombros.', 'Press convergente o press en polea sentado.', videos.chest, IMG.chest, '▰'),
    ex('Espalda · vertical', 'Jalón al pecho en polea', '3 × 8–12', '90–120 s', 'Pecho alto, codos abajo y atrás. Barra al pecho, nunca detrás de nuca.', 'Máquina de jalón convergente.', videos.pulldown, IMG.pulldown, '↧'),
    ex('Hombros', 'Press de hombros en máquina', '3 × 10–12', '90 s', 'Espalda apoyada, sin arquear lumbar.', 'Press de hombro convergente.', videos.machines, null, '⬆'),
    ex('Espalda · horizontal', 'Remo con apoyo de pecho', '3 × 10–12', '90 s', 'Torso estable; junta escápulas y vuelve despacio.', 'Remo sentado en polea baja.', videos.row, null, '↔'),
    ex('Pecho', 'Pec deck / aperturas', '2 × 12–15', '60–75 s', 'Hombros bajos; no fuerces estiramiento.', 'Aperturas en polea.', videos.pec, null, '◜◝'),
    ex('Hombro posterior', 'Reverse pec deck', '2 × 12–15', '60–75 s', 'Pecho contra almohadilla; abre sin encoger hombros.', 'Face pull en polea.', videos.pec, null, '↩'),
    ex('Bíceps', 'Curl de bíceps en máquina', '2 × 10–15', '60–75 s', 'Codos quietos y torso inmóvil.', 'Curl en polea baja.', videos.machines, null, '⌁'),
    ex('Tríceps', 'Pushdown con cuerda', '2 × 10–15', '60–75 s', 'Codos fijos al costado; mueve antebrazos.', 'Máquina de tríceps.', videos.machines, null, '⌁')
  ],
  5: [
    ex('Espalda · vertical', 'Jalón al pecho agarre neutro', '3 × 10–12', '90 s', 'Hombros abajo; codos hacia los bolsillos.', 'Jalón estándar o iso-lateral.', videos.pull2, IMG.pulldown, '↧'),
    ex('Pecho', 'Press de pecho inclinado en máquina', '3 × 10–12', '90 s', 'Escápulas estables y muñecas neutras.', 'Press convergente estándar.', videos.chest, IMG.chest, '▰'),
    ex('Espalda · horizontal', 'Remo sentado en polea baja', '3 × 10–12', '90 s', 'Columna neutra; tira hacia ombligo sin balanceo.', 'Remo con apoyo de pecho.', videos.row, null, '↔'),
    ex('Hombro lateral', 'Máquina de elevación lateral', '3 × 12–15', '60–75 s', 'Sube hasta línea de hombros sin impulso.', 'Elevación lateral en polea.', videos.machines, null, '⌃'),
    ex('Hombro posterior', 'Reverse pec deck', '2 × 12–15', '60–75 s', 'Pecho firme y cuello relajado.', 'Face pull en polea.', videos.pec, null, '↩'),
    ex('Pecho', 'Pec deck / aperturas', '2 × 12–15', '60–75 s', 'Recorrido fluido, sin dolor en hombro.', 'Aperturas en polea.', videos.pec, null, '◜◝'),
    ex('Bíceps', 'Curl de bíceps en máquina', '3 × 10–15', '60–75 s', 'Sin balanceo; baja 2–3 segundos.', 'Curl en polea baja.', videos.machines, null, '⌁'),
    ex('Bíceps / braquial', 'Curl martillo en polea baja', '2 × 12–15', '60–75 s', 'Palmas enfrentadas, muñecas rectas.', 'Curl con agarre neutro.', videos.machines, null, '⌁'),
    ex('Tríceps', 'Pushdown con cuerda', '3 × 10–15', '60–75 s', 'Codos fijos; separa cuerda abajo.', 'Máquina de tríceps.', videos.machines, null, '⌁'),
    ex('Tríceps', 'Extensión sobre cabeza en polea', '2 × 12–15', '60–75 s', 'Codos delante/arriba, torso estable.', 'Máquina de tríceps.', videos.machines, null, '⌁')
  ]
};

function workoutFor(date) {
  const day = date.getDay();
  const phase = phaseFor(date);
  const isGymPhase = phase.id !== 'prep';

  if (!isGymPhase) {
    const prep = {
      1: [session('Descanso activo y movilidad', 'Recovery', '20–30 min', 'Paseo, movilidad ligera de cadera/tobillo/torácica y preparación del plan. No intentes sustituir el gym con una sesión dura.', '🧘')],
      2: [session('Ciclismo Z2', 'Bike', '60–120 min', 'Ritmo conversacional. Mantén base aeróbica sin convertir cada salida en competición.', '🚴')],
      3: [session('Carrera suave + movilidad', 'Run', '25–40 min', 'Carrera cómoda, sin series. Mantiene tolerancia al impacto y deja margen de recuperación.', '🏃')],
      4: [session('Ciclismo tempo opcional', 'Bike', '60–105 min', 'Si duermes y recuperas bien: 2–3 bloques de 8–12 min tempo. Si no, Z2 simple.', '🚴')],
      5: [session('Descanso o core/movilidad', 'Recovery', '15–25 min', 'Elige descanso total si hay fatiga. La constancia no necesita rellenar todos los días con carga.', '🧘')],
      6: [session('Bici larga o carrera continua', 'Long', 'Una sesión principal', 'Elige una: bici Z2 de 1,5–3 h o carrera suave de 35–60 min. No combines ambas largas al principio.', '🚴')],
      0: [session('Recuperación activa o descanso', 'Recovery', '30–75 min máximo', 'Paseo, bici muy suave o descanso. Debe dejarte preparado para el lunes.', '🌿')]
    };
    return { sessions: prep[day], gymExercises: [], nutrition: day === 2 || day === 4 ? 'bike' : day === 6 ? 'long' : 'recovery' };
  }

  const plan = {
    1: { sessions: [session('Gym · pierna + core', 'Gym', '45–55 min', 'Mantenimiento de tren inferior, técnica y robustez sin competir con bici/running.', '🏋️')], gymExercises: gymPlans[1], nutrition: 'training' },
    2: { sessions: [session('Ciclismo Z2', 'Bike', '60–120 min', 'Ritmo conversacional; volumen aeróbico sin desgastarte.', '🚴')], gymExercises: [], nutrition: 'bike' },
    3: { sessions: [session('Gym · superior A', 'Gym', '60–70 min', 'Pecho, espalda, hombros y brazos equilibrados.', '🏋️'), session('Carrera Z2 opcional', 'Run', '20–30 min', 'Solo suave después del gym o separada varias horas; no hay series hoy.', '🏃')], gymExercises: gymPlans[3], nutrition: 'double' },
    4: { sessions: [session('Ciclismo tempo / Z2', 'Bike', '60–105 min', 'Calidad solo si llegas recuperado; si no, Z2.', '🚴')], gymExercises: [], nutrition: 'bike' },
    5: { sessions: [session('Gym · superior B', 'Gym', '60–75 min', 'Segundo estímulo equilibrado de tren superior.', '🏋️'), session('Carrera Z2 opcional', 'Run', '15–25 min', 'Suave; reserva la calidad de carrera para otro momento.', '🏃')], gymExercises: gymPlans[5], nutrition: 'double' },
    6: { sessions: [session('Bici larga o carrera continua', 'Long', 'Una sesión principal', 'Elige bici Z2 1,5–3 h o carrera suave 35–60 min. No ambas intensas.', '🚴')], gymExercises: [], nutrition: 'long' },
    0: { sessions: [session('Recuperación activa o descanso', 'Recovery', '30–90 min máximo', 'Bici muy suave, carrera fácil o descanso. Prioridad: llegar fresco al lunes.', '🌿')], gymExercises: [], nutrition: 'recovery' }
  };
  return plan[day];
}