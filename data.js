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
    alt: 'Si la ración lleva poco pollo: añade 1 lata de atún al natural, 2 huevos + claras o un pudding/leche alta en proteína en otra toma. Si falta patata: 80 g arroz seco o 100 g pan.',
    kcal: 650, protein: 35, carbs: 85, fat: 16
  },
  lentejas: {
    name: 'Lentejas con pollo y patata',
    grams: 'Lentejas cocidas 240 g + pollo 120 g + patata 160 g',
    alt: 'Si falta pollo: magro/lomo 140–170 g, 1 lata de atún o tortilla de 2 huevos + claras. Si falta patata: pan 90 g.',
    kcal: 640, protein: 34, carbs: 82, fat: 15
  },
  magro: {
    name: 'Magro con tomate',
    grams: 'Magro 170 g + arroz/pasta 90 g seco o patata 350 g',
    alt: 'Si falta magro: pollo 170 g, lomo de cerdo, 1–2 latas de atún, pescado blanco o tortilla de huevos + claras. Si falta arroz: pan 100 g o ñoquis 300 g.',
    kcal: 700, protein: 42, carbs: 88, fat: 18
  },
  pisto: {
    name: 'Pisto manchego completo',
    grams: 'Pisto 250 g + 2 huevos + 200 ml de claras + pan 90 g o patata 300 g',
    alt: 'Si faltan huevos: pollo/lomo 150–170 g o atún al natural. Si falta pan: arroz 80 g seco. El pisto necesita una proteína y un hidrato para ser comida completa.',
    kcal: 620, protein: 32, carbs: 78, fat: 20
  },
  pasta: {
    name: 'Pasta con pollo y tomate',
    grams: 'Pasta 100 g seco + pollo 170 g + tomate',
    alt: 'Si falta pollo: magro, lomo, 1–2 latas de atún, pescado blanco o tortilla de huevos + claras. Si falta pasta: arroz 100 g seco o ñoquis 300 g.',
    kcal: 720, protein: 40, carbs: 105, fat: 15
  },
  arroz: {
    name: 'Arroz con pollo o magro',
    grams: 'Arroz 100 g seco + pollo/magro 170 g + verdura',
    alt: 'Si falta pollo/magro: atún, pescado, lomo o tortilla de 2 huevos + claras. Si falta arroz: pasta 100 g seco, patata 400 g o pan 110 g.',
    kcal: 700, protein: 40, carbs: 100, fat: 15
  }
};

const proteinBoosters = {
  milkProtein: {
    id: 'leche-proteica',
    title: 'Leche alta en proteína',
    portion: '330 ml (1 botella)',
    protein: '20–25 g',
    use: 'Desayuno, merienda o después de entrenar. Cero cocina y fácil de combinar con fruta o pan.',
    alt: 'Batido de whey/isolate con agua, 1 pudding proteico o 1 bol de queso fresco batido alto en proteína.'
  },
  pudding: {
    id: 'pudding-proteico',
    title: 'Pudding o natilla proteica',
    portion: '1 tarrina',
    protein: '15–20 g',
    use: 'Postre o merienda rápida cuando no apetece cocinar ni comer más carne.',
    alt: 'Skyr/yogur alto en proteína o queso fresco batido alto en proteína.'
  },
  skyr: {
    id: 'skyr',
    title: 'Skyr o yogur alto en proteína',
    portion: '1 bol/tarrina grande',
    protein: '15–20 g',
    use: 'Media mañana, merienda o postre. Añade fruta si necesitas más hidrato.',
    alt: 'Pudding proteico, leche alta en proteína o queso fresco batido.'
  },
  whey: {
    id: 'batido',
    title: 'Batido de proteína opcional',
    portion: '1 scoop con agua',
    protein: '20–25 g',
    use: 'Comodín: úsalo solo si al final del día te faltan aproximadamente 20–25 g. No sustituye sistemáticamente una comida.',
    alt: 'Leche alta en proteína, 1 lata de atún al natural, 200 ml de claras en comida/cena o 2 huevos + un lácteo proteico.'
  },
  tuna: {
    id: 'atun',
    title: 'Atún al natural',
    portion: '1 lata escurrida',
    protein: '18–25 g',
    use: 'Plan B de comida o cena para pasta, arroz, pisto o bocadillo.',
    alt: 'Caballa/sardinas en conserva, pollo, magro, lomo o tortilla.'
  },
  eggs: {
    id: 'huevos',
    title: 'Huevos y claras',
    portion: '2 huevos + 200 ml claras',
    protein: '30–35 g',
    use: 'Comida o cena rápida: tortilla/revuelto con pisto, patata, arroz o pan.',
    alt: 'Pollo, magro, lomo de cerdo, pescado o atún.'
  }
};

const commonMeals = {
  breakfastCheese: {
    id: 'desayuno-burgos',
    time: '08:30',
    slot: 'Desayuno',
    title: 'Pan tostado + queso de Burgos + fruta',
    qty: 'Pan blanco tostado 80–100 g + 1–2 tarrinas de Burgos (62,5–125 g) + 1 fruta',
    proteinApprox: '7–15 g',
    alt: [
      'Más proteína sin cocinar: añade 330 ml de leche alta en proteína',
      'Alternativa: pan 80 g + jamón york 80–100 g + fruta',
      'Alternativa: pan 80 g + 2 huevos + fruta'
    ],
    why: 'El queso de Burgos se usa como complemento: una tarrina de 62,5 g no basta por sí sola para un desayuno alto en proteína. La leche alta en proteína es la forma sencilla de completar.'
  },
  breakfastProtein: {
    id: 'desayuno-leche-proteica',
    time: '08:30',
    slot: 'Desayuno',
    title: 'Leche alta en proteína + pan tostado + fruta',
    qty: 'Leche alta en proteína 330 ml + pan blanco tostado 80–100 g + 1 fruta',
    proteinApprox: '20–25 g',
    alt: [
      '1 pudding/natilla proteica + pan 80–100 g + fruta',
      'Skyr/yogur alto en proteína + pan 80–100 g + fruta',
      'Batido de proteína opcional + pan + fruta'
    ],
    why: 'Desayuno muy práctico para elevar la proteína sin cocinar ni repetir siempre queso o jamón york. El pan y la fruta aportan hidrato útil para el día.'
  },
  midProtein: {
    id: 'media-proteica',
    time: '11:30',
    slot: 'Media mañana',
    title: 'Lácteo proteico + fruta',
    qty: '1 pudding/natilla proteica o Skyr + 1 fruta',
    proteinApprox: '15–20 g',
    alt: [
      '330 ml de leche alta en proteína + fruta',
      '1–2 tarrinas de queso de Burgos + fruta',
      'Pan 60–70 g + jamón york 80–100 g'
    ],
    why: 'Evita repetir bocadillo de jamón york cada día y añade una toma de proteína fácil de llevar, abrir y consumir sin cocinar.'
  },
  midYork: {
    id: 'media-jamon',
    time: '11:30',
    slot: 'Media mañana',
    title: 'Pan tostado con jamón york + fruta',
    qty: 'Pan blanco tostado 60–70 g + jamón york 80–100 g + 1 fruta',
    proteinApprox: '15–20 g',
    alt: [
      'Pudding/natilla proteica + fruta',
      'Leche alta en proteína + pan 40–60 g',
      'Skyr/yogur alto en proteína + fruta'
    ],
    why: 'Opción salada y rápida para rotar con lácteos proteicos. No tiene que aparecer todos los días.'
  },
  lunchHome: {
    id: 'comida',
    time: '14:30',
    slot: 'Comida',
    title: 'Comida de casa o plato principal completo',
    qty: 'Usa el selector de comida de casa o una base de hidrato + 150–180 g de fuente proteica',
    proteinApprox: '25–40 g',
    alt: [
      'Pasta/arroz/ñoquis + pollo, magro, lomo, atún o pescado',
      'Pisto + tortilla de 2 huevos y 200 ml de claras + pan/patata',
      'Potaje o lentejas con pollo; si falta proteína añade atún, huevo o lácteo proteico en otra toma'
    ],
    why: 'La comida principal es donde resulta más fácil sumar proteína real y variada. La comida de casa sustituye este bloque, no se considera extra.'
  },
  preSimple: {
    id: 'pre',
    time: '17:30',
    slot: 'Pre-entreno',
    title: 'Plátano + hidrato fácil + proteína ligera',
    qty: '1 plátano + pan blanco tostado 60–80 g o 4–6 tortitas + una opción proteica',
    proteinApprox: '10–25 g',
    alt: [
      '330 ml de leche alta en proteína',
      '1 pudding/natilla proteica',
      'Jamón york 60–80 g o 1 tarrina de Burgos si te apetece salado'
    ],
    why: 'Antes de entrenar importa sobre todo llegar con hidrato disponible y buena digestión. La proteína es un complemento: evita hacer una merienda enorme o muy grasa.'
  },
  dinnerMeat: {
    id: 'cena-carne',
    time: '21:15',
    slot: 'Cena post-entreno',
    title: 'Hidrato + proteína magra + fruta',
    qty: 'Arroz/pasta 90–110 g en seco o ñoquis 300 g + pollo/magro/lomo 150–180 g + fruta',
    proteinApprox: '30–40 g',
    alt: [
      'Pasta con 1–2 latas de atún al natural',
      'Pisto + 2 huevos + 200 ml claras + pan/patata',
      'Pescado blanco + patata/arroz'
    ],
    why: 'La cena post-entreno no tiene que ser siempre pollo: magro, lomo, atún, huevos con claras o pescado permiten llegar al objetivo con variedad.'
  },
  dinnerLight: {
    id: 'cena-ligera',
    time: '21:15',
    slot: 'Cena',
    title: 'Cena ligera con proteína suficiente',
    qty: 'Patata 250–350 g o pan 60–80 g + fuente proteica 150–170 g + verdura/pisto',
    proteinApprox: '25–35 g',
    alt: [
      'Tortilla de 2 huevos + 200 ml claras + pan',
      'Atún con patata/pan y tomate o pisto',
      'Si la cena aporta menos de 25 g de proteína: añade 1 pudding/natilla proteica o 330 ml de leche alta en proteína'
    ],
    why: 'En recuperación se baja hidrato respecto a bici/gym, pero se mantiene una dosis útil de proteína para seguir construyendo músculo.'
  }
};

const mealTemplates = {
  recovery: [
    commonMeals.breakfastProtein,
    commonMeals.midProtein,
    { ...commonMeals.lunchHome, qty: 'Comida de casa o arroz/pasta 80–90 g en seco + fuente proteica 150–170 g' },
    { id: 'merienda', time: '17:30', slot: 'Merienda', title: 'Fruta + proteína opcional', qty: '1–2 frutas + 1 tarrina de Burgos, Skyr o pudding proteico', proteinApprox: '6–20 g', alt: ['Si no tienes hambre: solo fruta', 'Si faltan proteínas: leche alta en proteína'], why: 'Merienda flexible que evita llegar con ansiedad a la cena sin forzar comida en un día suave.' },
    commonMeals.dinnerLight
  ],
  bike: [
    commonMeals.breakfastProtein,
    commonMeals.midYork,
    { ...commonMeals.lunchHome, qty: 'Comida de casa o arroz/pasta 100–110 g en seco + fuente proteica 150–180 g' },
    { ...commonMeals.preSimple, qty: '1 plátano + pan blanco tostado 80–90 g o 5–6 tortitas + opción proteica ligera' },
    { ...commonMeals.dinnerMeat, qty: 'Arroz/pasta 100–110 g en seco o ñoquis 300 g + proteína 150–180 g + fruta' }
  ],
  training: [
    commonMeals.breakfastProtein,
    commonMeals.midProtein,
    commonMeals.lunchHome,
    commonMeals.preSimple,
    commonMeals.dinnerMeat
  ],
  double: [
    { ...commonMeals.breakfastProtein, qty: 'Leche alta en proteína 330 ml + pan blanco tostado 100–110 g + fruta' },
    commonMeals.midYork,
    { ...commonMeals.lunchHome, qty: 'Comida de casa o pasta/arroz 110 g en seco + fuente proteica 170–180 g', why: 'Gym + carrera necesita un poco más de hidrato, no más grasa.' },
    { ...commonMeals.preSimple, qty: '1 plátano + pan blanco tostado 80–90 g o 5–6 tortitas + leche proteica/pudding/jamón york' },
    { ...commonMeals.dinnerMeat, qty: 'Pasta/arroz 120–125 g en seco o ñoquis 350 g + proteína 170–180 g + fruta' }
  ],
  long: [
    { id: 'antes', time: '08:00', slot: 'Antes de salir', title: 'Hidrato fácil para fondo', qty: '1–2 plátanos + pan blanco tostado 80 g con miel/mermelada', proteinApprox: '0–10 g', alt: ['Tortitas de arroz/maíz + miel o mermelada', 'Si entra bien: leche alta en proteína pequeña'], why: 'Antes de bici/carrera de mañana prioriza tolerancia y carbohidrato. No hace falta forzar una gran dosis de proteína aquí.' },
    { id: 'durante', time: '10:30', slot: 'Durante', title: 'Hidrato e hidratación', qty: '30–60 g de hidrato/hora si dura más de 90 min', proteinApprox: '0 g', alt: ['Plátano, bebida isotónica, gel, barrita baja en grasa o pan con mermelada'], why: 'Comer durante el fondo evita terminar vacío y facilita recuperar sin atracón posterior.' },
    { ...commonMeals.lunchHome, slot: 'Comida post-entreno', qty: 'Comida de casa o pasta/arroz 110–120 g en seco + fuente proteica 170–180 g', why: 'Después de fondo, combina hidrato con una fuente proteica completa para recuperar.' },
    { id: 'merienda', time: '17:30', slot: 'Merienda', title: 'Fruta + refuerzo proteico cómodo', qty: '1–2 frutas + leche proteica, pudding/Skyr o pan con jamón york', proteinApprox: '15–25 g', alt: ['1–2 tarrinas de Burgos como complemento', 'Batido opcional si el día va corto'], why: 'No dependes de cocinar ni de repetir carne: los lácteos proteicos ayudan a cerrar el día de fondo.' },
    { ...commonMeals.dinnerMeat, qty: 'Patata 350–400 g o arroz 90 g en seco + proteína 150–180 g' }
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

const proteinAlternativesForHomeMeals = {
  potaje: 'Si la ración lleva poco pollo: añade 1 lata de atún al natural, 2 huevos + claras, un pudding proteico o leche alta en proteína en otra toma.',
  lentejas: 'Si la ración lleva poco pollo: añade atún, lomo/magro, huevos con claras o un lácteo proteico de postre.',
  magro: 'Si falta magro: pollo, lomo de cerdo, atún, pescado blanco o tortilla de huevos + claras.',
  pisto: 'Completa con pollo, lomo, atún o tortilla de 2 huevos + 200 ml de claras; así deja de ser solo una guarnición.',
  pasta: 'Si falta pollo: atún natural, magro, lomo, pescado blanco o huevos + claras.',
  arroz: 'Si falta pollo/magro: atún, pescado, lomo o tortilla con claras.'
};