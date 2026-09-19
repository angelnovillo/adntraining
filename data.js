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

const ex = (group, title, sets, rest, notes, alt, video, image, icon = '🏋️') => ({
  group, title, sets, rest, notes, alt, video, image, icon
});

const plan = {
  1: {
    type: 'GYM · PIERNA + CORE', color: '#6c4cf5', color2: '#1f3f8e', title: 'Mantén la base',
    intro: 'Pierna suficiente para conservar fuerza y robustez, sin dejarte vacío para la bici. Técnica, recorrido y control.',
    chips: ['45–55 min', 'RIR según fase', 'Máquinas'], effort: 'RIR 3–4 / 2–3 / 1–2',
    sessions: [
      ex('Cuádriceps · glúteo', 'Prensa de piernas', '3 × 10–12', '90–120 s', 'Pies a anchura de hombros. Baja sin despegar cadera o zona lumbar. Empuja desde mediopié-talón; no bloquees rodillas.', 'Hack squat guiada o multipower con banco/limitadores.', videos.machines, IMG.legpress, '🦵'),
      ex('Cuádriceps', 'Extensión de piernas', '2 × 12–15', '60–75 s', 'Alinea el eje de la máquina con la rodilla. Sube controlado, sin golpe al final del recorrido.', 'Prensa ligera con pies algo bajos.', videos.machines, null, '🦿'),
      ex('Isquios', 'Curl femoral sentado', '3 × 10–12', '75–90 s', 'Cadera pegada al asiento y rodillas alineadas con el eje. No dejes caer el peso al volver.', 'Curl femoral tumbado.', videos.machines, null, '🦿'),
      ex('Gemelos', 'Elevación de gemelos en máquina', '2 × 12–15', '60 s', 'Recorrido amplio: pausa arriba, estira abajo y no rebotes.', 'Gemelos en prensa de piernas.', videos.machines, null, '🦶'),
      ex('Core', 'Crunch en máquina', '2 × 12–15', '60 s', 'Flexiona el tronco; no tires de los brazos ni arquees la espalda.', 'Crunch en polea alta con cuerda.', videos.machines, null, '◉'),
      ex('Core', 'Pallof press en polea', '2 × 10–12/lado', '45–60 s', 'Polea a altura del pecho. Al extender brazos, evita rotar el tronco.', 'Plancha frontal: 2 × 30–45 s.', videos.row, null, '◉')
    ],
    recovery: ['Nada de fallo en pierna: tu objetivo es mantenimiento y llegar bien al martes de bici.', 'Después, 5–10 min de movilidad suave de cadera/tobillo si lo notas necesario.', 'Prioriza cena con proteína e hidratos si el martes será una salida larga o intensa.']
  },
  2: {
    type: 'CICLISMO · BASE AERÓBICA', color: '#087f5b', color2: '#174f64', title: 'Suma sin desgastarte',
    intro: 'Rodaje aeróbico para disfrutar y construir fondo. Mantén el esfuerzo controlado: hoy no necesitas demostrar nada.',
    chips: ['60–120 min', 'Z2 predominante', 'Cadencia cómoda'], effort: 'RPE 4–5/10',
    sessions: [ex('Ciclismo', 'Rodaje Z2 / fondo medio', '60–120 min', '—', 'Ritmo conversacional. Evita convertir cada repecho en una serie. Si vas con grupo, limita los esfuerzos largos por encima de umbral.', 'Rodillo: 60–75 min en Z2 estable.', videos.machines, null, '🚴')],
    recovery: ['Hidrátate de forma regular; en salidas largas, lleva carbohidrato suficiente.', 'Si las piernas pesan por el gym, reduce duración antes que forzar intensidad.', '5 min muy suaves al terminar y algo de movilidad de cadera/cuádriceps.']
  },
  3: {
    type: 'GYM · SUPERIOR A + RUN', color: '#1565c0', color2: '#293d83', title: 'Base equilibrada',
    intro: 'Pecho, espalda, hombros y brazos con empujes y tracciones equilibrados. Después, carrera muy suave si te apetece.',
    chips: ['60–70 min', 'Superior completo', 'Run Z2 opcional'], effort: 'RIR 3–4 / 2–3 / 1–2',
    sessions: [
      ex('Pecho', 'Press de pecho en máquina', '3 × 8–12', '90–120 s', 'Asas a mitad de pecho. Espalda y pies apoyados; muñecas neutras; empuja sin encoger hombros.', 'Press convergente plate-loaded o press sentado en polea.', videos.chest, IMG.chest, '▰'),
      ex('Espalda · vertical', 'Jalón al pecho en polea', '3 × 8–12', '90–120 s', 'Muslos sujetos, pecho alto y ligera inclinación atrás. Lleva la barra al pecho superior, nunca detrás de la nuca.', 'Máquina de jalón convergente/iso-lateral.', videos.pulldown, IMG.pulldown, '↧'),
      ex('Hombros', 'Press de hombros en máquina', '3 × 10–12', '90 s', 'Asiento para empezar con asas cerca de las orejas. Espalda apoyada; no arquees lumbar.', 'Press convergente de hombro o multipower sentado muy ligero.', videos.machines, null, '⬆'),
      ex('Espalda · horizontal', 'Remo sentado con apoyo de pecho', '3 × 10–12', '90 s', 'Torso estable. Tira con los codos hacia atrás, junta escápulas y vuelve lento.', 'Remo sentado en polea baja.', videos.row, null, '↔'),
      ex('Pecho', 'Pec deck / aperturas', '2 × 12–15', '60–75 s', 'Hombros abajo. Abraza hacia delante sin forzar el estiramiento ni elevar hombros.', 'Aperturas en polea de pie.', videos.pec, null, '◜◝'),
      ex('Hombro posterior', 'Reverse pec deck', '2 × 12–15', '60–75 s', 'Pecho contra almohadilla, abre hacia atrás con control y sin encoger hombros.', 'Face pull en polea con cuerda.', videos.pec, null, '↩'),
      ex('Bíceps', 'Curl de bíceps en máquina', '2 × 10–15', '60–75 s', 'Codos quietos y torso inmóvil. Baja lento; no uses impulso.', 'Curl en polea baja con barra.', videos.machines, null, '⌁'),
      ex('Tríceps', 'Pushdown con cuerda', '2 × 10–15', '60–75 s', 'Codos pegados al cuerpo. Solo se mueve el antebrazo; termina sin inclinarte hacia delante.', 'Máquina de extensión de tríceps.', videos.machines, null, '⌁')
    ],
    recovery: ['Si corres: 20–30 min Z2, ritmo en el que puedas hablar. No añadas series hoy.', 'Si haces gym y run el mismo día, haz primero gym. Si puedes separarlos 6 h, mejor.', 'Proteína distribuida en comidas y sueño suficiente: el progreso se consolida fuera del gimnasio.']
  },
  4: {
    type: 'CICLISMO · CALIDAD CONTROLADA', color: '#0e7490', color2: '#164e63', title: 'Bici con propósito',
    intro: 'Día para una salida de tempo o series si llegas recuperado. Si no, mantén Z2: la consistencia gana a una sesión heroica.',
    chips: ['60–105 min', 'Tempo o Z2', 'Flexible'], effort: 'RPE 5–8/10',
    sessions: [ex('Ciclismo', 'Tempo / bloques controlados', '60–105 min', '3–5 min suave entre bloques', 'Tras 15–20 min de calentamiento, prueba 2–3 bloques de 8–12 min a ritmo duro sostenible. Enfría 10 min.', 'Si hay fatiga: rodaje Z2 de 60–90 min.', videos.machines, null, '🚴')],
    recovery: ['No hagas intensidad si notas las piernas anormalmente pesadas o tienes mal sueño acumulado.', 'Tras calidad, mete carbohidratos y líquido durante las horas posteriores.', 'El viernes es tren superior, así que no necesitas reservar tanto las piernas como antes de un día duro de fuerza.']
  },
  5: {
    type: 'GYM · SUPERIOR B + RUN', color: '#b45309', color2: '#7c2d12', title: 'Volumen equilibrado',
    intro: 'Segundo estímulo completo de tren superior: espalda, pecho, hombros y brazos. Calidad de repeticiones antes que peso.',
    chips: ['60–75 min', 'Volumen superior', 'Run Z2 opcional'], effort: 'RIR 3–4 / 2–3 / 1–2',
    sessions: [
      ex('Espalda · vertical', 'Jalón al pecho agarre neutro', '3 × 10–12', '90 s', 'Hombros abajo; lleva los codos hacia los bolsillos. Controla la subida hasta casi extender brazos.', 'Jalón estándar o máquina iso-lateral.', videos.pull2, IMG.pulldown, '↧'),
      ex('Pecho', 'Press de pecho inclinado en máquina', '3 × 10–12', '90 s', 'Asas a nivel de pecho superior. Escápulas estables, muñecas neutras y sin despegar espalda.', 'Press convergente estándar.', videos.chest, IMG.chest, '▰'),
      ex('Espalda · horizontal', 'Remo sentado en polea baja', '3 × 10–12', '90 s', 'Columna neutra, tira hacia ombligo/costillas bajas y no te balancees.', 'Remo en máquina con apoyo de pecho.', videos.row, null, '↔'),
      ex('Hombro lateral', 'Máquina de elevación lateral', '3 × 12–15', '60–75 s', 'Hombros bajos; codos ligeramente flexionados; sube hasta línea de hombros sin impulso.', 'Elevación lateral unilateral en polea.', videos.machines, null, '⌃'),
      ex('Hombro posterior', 'Reverse pec deck', '2 × 12–15', '60–75 s', 'Pecho firme contra almohadilla y cuello relajado. Abre con control.', 'Face pull en polea con cuerda.', videos.pec, null, '↩'),
      ex('Pecho', 'Pec deck / aperturas', '2 × 12–15', '60–75 s', 'Recorrido fluido y sin molestia en hombro anterior.', 'Aperturas en polea.', videos.pec, null, '◜◝'),
      ex('Bíceps', 'Curl de bíceps en máquina', '3 × 10–15', '60–75 s', 'Sin balanceo; mantén codos estables y baja en 2–3 segundos.', 'Curl en polea baja con barra.', videos.machines, null, '⌁'),
      ex('Bíceps / braquial', 'Curl martillo en polea baja', '2 × 12–15', '60–75 s', 'Palmas enfrentadas y muñecas rectas.', 'Curl máquina con agarre neutro.', videos.machines, null, '⌁'),
      ex('Tríceps', 'Pushdown con cuerda', '3 × 10–15', '60–75 s', 'Codos fijos. Separa ligeramente cuerda abajo sin mover hombros.', 'Máquina de tríceps.', videos.machines, null, '⌁'),
      ex('Tríceps', 'Extensión sobre cabeza en polea', '2 × 12–15', '60–75 s', 'Codos al frente/arriba; torso estable y estiramiento controlado.', 'Máquina de extensión de tríceps.', videos.machines, null, '⌁')
    ],
    recovery: ['Si corres: 15–25 min Z2, solo para sumar base y soltar piernas.', 'No hagas calidad de carrera tras esta sesión. Reserva las series o tirada más larga para el fin de semana.', 'Si el sábado será bici larga, cuida sueño, hidratación y carbohidratos el viernes.']
  },
  6: {
    type: 'FINDE · BICI O CARRERA', color: '#7c3aed', color2: '#4c1d95', title: 'Elige el objetivo',
    intro: 'El día más flexible: prioriza bici larga si tu foco sigue siendo ciclismo; prioriza carrera larga si estás en un bloque de 10K.',
    chips: ['1–3 h', 'Una sesión clave', 'No ambas intensas'], effort: 'RPE 4–7/10',
    sessions: [
      ex('Opción A · ciclismo', 'Salida larga Z2', '1.5–3 h', '—', 'Ritmo estable y conversacional. Alimenta la salida si supera 90 min.', 'Rodillo Z2 de 75–120 min si no puedes salir.', videos.machines, null, '🚴'),
      ex('Opción B · running', 'Tirada continua suave', '35–60 min', '—', 'Corre cómodo, sin perseguir ritmo. Aumenta duración gradualmente si estás adaptándote a correr.', 'Bici suave 60–90 min si las piernas no toleran impacto.', videos.machines, null, '🏃')
    ],
    recovery: ['Escoge una única sesión principal. Evita combinar bici larga + carrera larga al principio.', 'Come e hidrátate durante la sesión larga según duración y temperatura.', 'Tras acabar: paseo breve, comida completa y descanso.']
  },
  0: {
    type: 'FINDE · RECUPERA O SUMA SUAVE', color: '#475569', color2: '#1e293b', title: 'Consistencia sostenible',
    intro: 'Día de recuperación activa o carrera/bici suave. Debe dejarte listo para el lunes, no más cansado.',
    chips: ['30–90 min', 'Z1–Z2', 'Recuperación'], effort: 'RPE 2–4/10',
    sessions: [
      ex('Opción A · bici', 'Rodaje regenerativo', '45–90 min', '—', 'Pedaleo muy cómodo, cadencia natural y sin apretar repechos.', 'Descanso total + paseo de 20–40 min.', videos.machines, null, '🚴'),
      ex('Opción B · running', 'Rodaje suave', '25–45 min', '—', 'Ritmo conversacional y recorrido fácil. Si notas impacto o molestias, cambia a bici o paseo.', 'Elíptica suave 25–40 min.', videos.machines, null, '🏃')
    ],
    recovery: ['La prioridad es llegar fresco al lunes. Si dudas entre entrenar y descansar, elige la opción más suave.', 'Prepara ropa, agua y planificación de la semana.', 'Movilidad opcional 5–10 min, sin convertirla en otra sesión dura.']
  }
};