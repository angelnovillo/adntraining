const APP_CONFIG = {
  athleteName: 'Angel David',
  gymStart: '2026-10-01',
  adaptationEnd: '2026-10-28',
  defaultWeightKg: 54.1,
  trainingHour: '19:00'
};

const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const DAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

const VIDEOS = {
  chest: 'https://www.youtube.com/watch?v=rY0B8UFdne0',
  pulldown: 'https://www.youtube.com/watch?v=rpkWBC1gCcE',
  machines: 'https://www.youtube.com/watch?v=kCs4Jj0X-Dc',
  pec: 'https://www.youtube.com/watch?v=wsNAD1BpiaE',
  row: 'https://www.youtube.com/watch?v=tozrI76n4QE'
};

const phases = {
  prep: {
    id: 'prep',
    label: 'Fase 0',
    headline: 'prepara consistencia',
    range: 'Hasta el 30 de septiembre',
    effort: 'Base suave',
    description: 'Antes del gimnasio: bici y carrera sin anadir fatiga innecesaria. El objetivo es llegar al 1 de octubre con horarios, comidas y registro ya ordenados.'
  },
  adaptation: {
    id: 'adaptation',
    label: 'Fase 1',
    headline: 'RIR 3-4',
    range: '1-28 de octubre',
    effort: 'RIR 3-4',
    description: 'Aprende maquinas y recorridos. Deja 3-4 repeticiones en recamara y termina con ganas de volver.'
  },
  progression: {
    id: 'progression',
    label: 'Fase 2',
    headline: 'progresion muscular',
    range: 'Desde el 29 de octubre',
    effort: 'RIR 1-2',
    description: 'Progresion controlada: sube carga cuando cumplas repeticiones con tecnica estable. El fallo queda para aislamientos puntuales.'
  }
};

function phaseFor(date) {
  const key = date.toISOString().slice(0, 10);
  if (key < APP_CONFIG.gymStart) return phases.prep;
  if (key <= APP_CONFIG.adaptationEnd) return phases.adaptation;
  return phases.progression;
}

const nutritionProfiles = {
  recovery: { label: 'Recuperacion', kcal: 2200, protein: 110, carbs: 270, fat: 68 },
  bike: { label: 'Bici', kcal: 2500, protein: 110, carbs: 365, fat: 62 },
  training: { label: 'Gym', kcal: 2400, protein: 110, carbs: 330, fat: 64 },
  double: { label: 'Gym + carrera', kcal: 2500, protein: 112, carbs: 355, fat: 62 },
  long: { label: 'Fondo', kcal: 2750, protein: 110, carbs: 420, fat: 62 }
};

const homeMeals = {
  potaje: {
    name: 'Potaje de alubias, espinacas, pollo y patata',
    grams: 'Alubias cocidas 220 g + pollo 120 g + patata 180 g + espinaca',
    alt: 'Si falta pollo: 2 huevos + 80 g jamon york. Si falta patata: 80 g arroz seco o 100 g pan.',
    kcal: 650, protein: 35, carbs: 85, fat: 16
  },
  lentejas: {
    name: 'Lentejas con pollo y patata',
    grams: 'Lentejas cocidas 240 g + pollo 120 g + patata 160 g',
    alt: 'Si falta pollo: magro 140 g o queso de Burgos 200 g. Si falta patata: pan 90 g.',
    kcal: 640, protein: 34, carbs: 82, fat: 15
  },
  magro: {
    name: 'Magro con tomate',
    grams: 'Magro 170 g + arroz/pasta 90 g seco o patata 350 g',
    alt: 'Si falta magro: pollo 170 g o 2 latas de atun. Si falta arroz: pan 100 g o noquis 300 g.',
    kcal: 700, protein: 42, carbs: 88, fat: 18
  },
  pisto: {
    name: 'Pisto manchego completo',
    grams: 'Pisto 250 g + 2 huevos + pan 90 g o patata 300 g',
    alt: 'Si falta huevo: pollo 150 g o queso de Burgos 220 g. Si falta pan: arroz 80 g seco.',
    kcal: 620, protein: 32, carbs: 78, fat: 20
  },
  pasta: {
    name: 'Pasta con pollo y tomate',
    grams: 'Pasta 100 g seco + pollo 170 g + tomate',
    alt: 'Si falta pasta: arroz 100 g seco o noquis 300 g. Si falta pollo: magro 170 g.',
    kcal: 720, protein: 40, carbs: 105, fat: 15
  },
  arroz: {
    name: 'Arroz con pollo o magro',
    grams: 'Arroz 100 g seco + pollo/magro 170 g + verdura',
    alt: 'Si falta arroz: pasta 100 g seco, patata 400 g o pan 110 g.',
    kcal: 700, protein: 40, carbs: 100, fat: 15
  }
};

const commonMeals = {
  breakfast: { id: 'desayuno', time: '08:30', slot: 'Desayuno', title: 'Pan tostado + queso de Burgos + fruta', qty: 'Pan 100 g + queso de Burgos 100 g + 1 fruta', alt: ['Si falta queso: jamon york 80 g', 'Si falta pan: patata cocida 250 g o tortitas de arroz'], why: 'Hidrato facil y proteina temprana sin cargar grasa.' },
  mid: { id: 'media', time: '11:30', slot: 'Media manana', title: 'Fruta + pan con jamon york', qty: '1 fruta + pan 70 g + jamon york 60-80 g', alt: ['Si falta jamon: queso de Burgos 150 g', 'Si falta fruta: pan 30 g extra'], why: 'Mantiene energia y evita llegar vacio a la tarde.' },
  meal: { id: 'comida', time: '14:30', slot: 'Comida', title: 'Comida de casa o pasta/arroz + pollo/magro', qty: 'Plato de casa o pasta/arroz 95-100 g seco + proteina 170 g', alt: ['Potaje, lentejas, magro, pisto completo, pasta o arroz', 'Si falta pasta/arroz: patata 400 g o pan 110 g'], why: 'La comida de casa sustituye la base, no se suma encima.' },
  pre: { id: 'pre', time: '17:30', slot: 'Pre-entreno', title: 'Platano + pan tostado + proteina ligera', qty: '1 platano + pan 70 g + jamon york 60 g o queso 100 g', alt: ['Si falta platano: fruta + mermelada', 'Si falta pan: 5 tortitas de arroz'], why: 'Energia para entrenar a las 19:00 sin pesadez.' },
  dinner: { id: 'cena', time: '21:15', slot: 'Cena post-entreno', title: 'Arroz, pasta o noquis + pollo/magro + fruta', qty: 'Arroz/pasta 100 g seco o noquis 300 g + proteina 170 g', alt: ['Si falta arroz/pasta: patata 450 g', 'Si falta proteina: huevos + jamon york'], why: 'Recuperacion y progresion de cargas.' }
};

const mealTemplates = {
  recovery: [
    { ...commonMeals.breakfast, qty: 'Pan 80 g + queso de Burgos 100 g + 1 fruta' },
    { ...commonMeals.mid, title: 'Fruta + jamon york', qty: '1 fruta + jamon york 60-80 g' },
    { ...commonMeals.meal, qty: 'Plato de casa o arroz/pasta 80-90 g seco + proteina 160 g' },
    { id: 'merienda', time: '17:30', slot: 'Merienda', title: 'Fruta + pan o queso fresco', qty: '1 fruta + pan 50 g o queso de Burgos 150 g', alt: ['Si hay poca hambre: solo fruta', 'Si entrenas suave: pan 70 g'], why: 'Mantiene energia sin convertir el descanso en deficit.' },
    { id: 'cena', time: '21:15', slot: 'Cena', title: 'Pollo/magro + patata/pan + verdura', qty: 'Proteina 170 g + patata 300 g o pan 80 g + verdura', alt: ['Si falta patata: arroz 80 g seco', 'Si falta pollo: magro 170 g o huevos'], why: 'Proteina estable y carbohidrato moderado.' }
  ],
  bike: [
    { ...commonMeals.breakfast, qty: 'Pan 100-110 g + queso 100 g + fruta' },
    { ...commonMeals.mid, qty: '1 fruta + pan 70-80 g + jamon 60 g' },
    { ...commonMeals.meal, qty: 'Plato de casa o arroz/pasta 100 g seco + pollo 170 g' },
    { ...commonMeals.pre, title: 'Platano + pan tostado', qty: '1 platano + pan 80-90 g + jamon york opcional', why: 'Hidrato disponible y baja grasa.' },
    { ...commonMeals.dinner, title: 'Arroz/pasta/noquis + pollo o magro + fruta', qty: 'Arroz/pasta 110 g seco o noquis 300 g + proteina 170 g' }
  ],
  training: [commonMeals.breakfast, commonMeals.mid, commonMeals.meal, commonMeals.pre, commonMeals.dinner],
  double: [
    { ...commonMeals.breakfast, qty: 'Pan 110 g + queso 100 g + fruta' },
    commonMeals.mid,
    { ...commonMeals.meal, qty: 'Plato de casa o pasta/arroz 110 g seco + proteina 170 g', why: 'Mas hidrato para gym + carrera.' },
    { ...commonMeals.pre, qty: '1 platano + pan 90 g o 6 tortitas + jamon 60 g' },
    { ...commonMeals.dinner, qty: 'Pasta/arroz 125 g seco o noquis 350 g + proteina 180 g' }
  ],
  long: [
    { id: 'antes', time: '08:00', slot: 'Antes de salir', title: 'Platano + pan con miel/mermelada', qty: '1-2 platanos + pan 80 g', alt: ['Si falta platano: fruta o zumo', 'Si falta pan: tortitas 6 unidades'], why: 'Hidrato facil antes de fondo.' },
    { id: 'durante', time: '10:30', slot: 'Durante', title: 'Hidrato facil de transportar', qty: '30-60 g hidrato por hora si supera 90 min', alt: ['Bebida isotonica, gel, barrita o pan con mermelada'], why: 'Evita acabar vacio y mejora recuperacion.' },
    { ...commonMeals.meal, slot: 'Comida post-entreno', qty: 'Plato de casa o pasta/arroz 110 g seco + pollo 170 g', why: 'Reponer energia tras una sesion larga.' },
    { id: 'merienda', time: '17:30', slot: 'Merienda', title: 'Fruta + queso o pan con jamon', qty: '1-2 frutas + queso 150 g o pan 70 g + jamon 60 g', alt: ['Si falta queso/jamon: atun o huevos'], why: 'Sigue recuperando durante la tarde.' },
    { id: 'cena', time: '21:15', slot: 'Cena', title: 'Patata/arroz/noquis + proteina magra', qty: 'Patata 400 g o arroz 90 g seco + proteina 170 g', alt: ['Si falta patata/arroz: pasta 90 g seco o pan 100 g'], why: 'Cierra el dia sin deficit excesivo.' }
  ]
};

function exercise(group, title, sets, rest, notes, substitutions, video) {
  return { group, title, sets, rest, notes, substitutions, video };
}

const gymPlans = {
  1: [
    exercise('Cuadriceps y gluteo', 'Prensa de piernas', '3 x 10-12', '90-120 s', 'Pies a anchura de hombros. Baja sin despegar cadera/lumbar y no bloquees rodillas.', ['Hack squat guiada', 'Multipower con limitadores'], VIDEOS.machines),
    exercise('Cuadriceps', 'Extension de piernas', '2 x 12-15', '60-75 s', 'Alinea el eje de la maquina con la rodilla. Controla la vuelta.', ['Prensa ligera con pies bajos'], VIDEOS.machines),
    exercise('Isquios', 'Curl femoral sentado', '3 x 10-12', '75-90 s', 'Cadera pegada al asiento; no dejes caer el peso.', ['Curl femoral tumbado'], VIDEOS.machines),
    exercise('Gemelos', 'Elevacion de gemelos en maquina', '2 x 12-15', '60 s', 'Pausa arriba y estira abajo sin rebote.', ['Gemelos en prensa'], VIDEOS.machines),
    exercise('Core', 'Crunch en maquina', '2 x 12-15', '60 s', 'Flexiona tronco sin tirar de brazos ni arquear lumbar.', ['Crunch en polea'], VIDEOS.machines)
  ],
  3: [
    exercise('Pecho', 'Press de pecho en maquina', '3 x 8-12', '90-120 s', 'Asas a mitad de pecho; pies y espalda apoyados; no encoger hombros.', ['Press convergente', 'Press en polea sentado'], VIDEOS.chest),
    exercise('Espalda vertical', 'Jalon al pecho en polea', '3 x 8-12', '90-120 s', 'Pecho alto, codos abajo y atras. Barra al pecho, nunca detras de nuca.', ['Maquina de jalon convergente'], VIDEOS.pulldown),
    exercise('Hombros', 'Press de hombros en maquina', '3 x 10-12', '90 s', 'Espalda apoyada, sin arquear lumbar.', ['Press de hombro convergente'], VIDEOS.machines),
    exercise('Espalda horizontal', 'Remo con apoyo de pecho', '3 x 10-12', '90 s', 'Torso estable; junta escapulas y vuelve despacio.', ['Remo sentado en polea baja'], VIDEOS.row),
    exercise('Pecho', 'Pec deck / aperturas', '2 x 12-15', '60-75 s', 'Hombros bajos; no fuerces estiramiento.', ['Aperturas en polea'], VIDEOS.pec),
    exercise('Hombro posterior', 'Reverse pec deck', '2 x 12-15', '60-75 s', 'Pecho contra almohadilla; abre sin encoger hombros.', ['Face pull en polea'], VIDEOS.pec),
    exercise('Biceps', 'Curl de biceps en maquina', '2 x 10-15', '60-75 s', 'Codos quietos y torso inmovil.', ['Curl en polea baja'], VIDEOS.machines),
    exercise('Triceps', 'Pushdown con cuerda', '2 x 10-15', '60-75 s', 'Codos fijos al costado; mueve antebrazos.', ['Maquina de triceps'], VIDEOS.machines)
  ],
  5: [
    exercise('Espalda vertical', 'Jalon al pecho agarre neutro', '3 x 10-12', '90 s', 'Hombros abajo; codos hacia los bolsillos.', ['Jalon estandar', 'Iso-lateral'], VIDEOS.pulldown),
    exercise('Pecho', 'Press de pecho inclinado en maquina', '3 x 10-12', '90 s', 'Escapulas estables y munecas neutras.', ['Press convergente estandar'], VIDEOS.chest),
    exercise('Espalda horizontal', 'Remo sentado en polea baja', '3 x 10-12', '90 s', 'Columna neutra; tira hacia ombligo sin balanceo.', ['Remo con apoyo de pecho'], VIDEOS.row),
    exercise('Hombro lateral', 'Maquina de elevacion lateral', '3 x 12-15', '60-75 s', 'Sube hasta linea de hombros sin impulso.', ['Elevacion lateral en polea'], VIDEOS.machines),
    exercise('Hombro posterior', 'Reverse pec deck', '2 x 12-15', '60-75 s', 'Pecho firme y cuello relajado.', ['Face pull en polea'], VIDEOS.pec),
    exercise('Pecho', 'Pec deck / aperturas', '2 x 12-15', '60-75 s', 'Recorrido fluido, sin dolor en hombro.', ['Aperturas en polea'], VIDEOS.pec),
    exercise('Biceps', 'Curl de biceps en maquina', '3 x 10-15', '60-75 s', 'Sin balanceo; baja 2-3 segundos.', ['Curl en polea baja'], VIDEOS.machines),
    exercise('Biceps / braquial', 'Curl martillo en polea baja', '2 x 12-15', '60-75 s', 'Palmas enfrentadas, munecas rectas.', ['Curl con agarre neutro'], VIDEOS.machines),
    exercise('Triceps', 'Pushdown con cuerda', '3 x 10-15', '60-75 s', 'Codos fijos; separa cuerda abajo.', ['Maquina de triceps'], VIDEOS.machines),
    exercise('Triceps', 'Extension sobre cabeza en polea', '2 x 12-15', '60-75 s', 'Codos delante/arriba, torso estable.', ['Maquina de triceps'], VIDEOS.machines)
  ]
};

function session(title, kind, duration, notes) {
  return { title, kind, duration, notes };
}

function workoutFor(date) {
  const day = date.getDay();
  const phase = phaseFor(date);
  const isGymPhase = phase.id !== 'prep';

  if (!isGymPhase) {
    const prep = {
      1: { sessions: [session('Descanso activo y movilidad', 'Recovery', '20-30 min', 'Paseo y movilidad ligera.')], gymExercises: [], nutrition: 'recovery' },
      2: { sessions: [session('Ciclismo Z2', 'Bike', '60-120 min', 'Ritmo conversacional.')], gymExercises: [], nutrition: 'bike' },
      3: { sessions: [session('Carrera suave + movilidad', 'Run', '25-40 min', 'Sin series.')], gymExercises: [], nutrition: 'recovery' },
      4: { sessions: [session('Ciclismo tempo opcional', 'Bike', '60-105 min', 'Tempo solo si recuperas bien.')], gymExercises: [], nutrition: 'bike' },
      5: { sessions: [session('Descanso o core/movilidad', 'Recovery', '15-25 min', 'Elige descanso si hay fatiga.')], gymExercises: [], nutrition: 'recovery' },
      6: { sessions: [session('Bici larga o carrera continua', 'Long', 'Una sesion principal', 'No combines ambas largas al principio.')], gymExercises: [], nutrition: 'long' },
      0: { sessions: [session('Recuperacion activa o descanso', 'Recovery', '30-75 min max', 'Debe dejarte fresco para el lunes.')], gymExercises: [], nutrition: 'recovery' }
    };
    return prep[day];
  }

  const plan = {
    1: { sessions: [session('Gym · pierna + core', 'Gym', '45-55 min', 'Mantenimiento de tren inferior y tecnica.')], gymExercises: gymPlans[1], nutrition: 'training' },
    2: { sessions: [session('Ciclismo Z2', 'Bike', '60-120 min', 'Volumen aerobico sin desgaste.')], gymExercises: [], nutrition: 'bike' },
    3: { sessions: [session('Gym · superior A', 'Gym', '60-70 min', 'Pecho, espalda, hombros y brazos equilibrados.'), session('Carrera Z2 opcional', 'Run', '20-30 min', 'Solo suave.')], gymExercises: gymPlans[3], nutrition: 'double' },
    4: { sessions: [session('Ciclismo tempo / Z2', 'Bike', '60-105 min', 'Calidad solo si llegas recuperado.')], gymExercises: [], nutrition: 'bike' },
    5: { sessions: [session('Gym · superior B', 'Gym', '60-75 min', 'Segundo estimulo de tren superior.'), session('Carrera Z2 opcional', 'Run', '15-25 min', 'Suave.')], gymExercises: gymPlans[5], nutrition: 'double' },
    6: { sessions: [session('Bici larga o carrera continua', 'Long', 'Una sesion principal', 'Elige bici Z2 1,5-3 h o carrera suave 35-60 min.')], gymExercises: [], nutrition: 'long' },
    0: { sessions: [session('Recuperacion activa o descanso', 'Recovery', '30-90 min max', 'Prioridad: llegar fresco al lunes.')], gymExercises: [], nutrition: 'recovery' }
  };
  return plan[day];
}
