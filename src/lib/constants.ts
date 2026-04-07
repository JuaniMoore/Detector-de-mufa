export const MUFA_PHRASES = [
  "Ya somos campeones",
  "A estos nos los comemos crudos",
  "Este partido es un trámite",
  "La copa ya tiene nuestro nombre",
  "No hay forma de que perdamos esto",
  "Es imposible que nos ganen",
  "Ya estoy sacando pasaje para la final",
  "Goleamos seguro",
  "Hoy hay baile",
  "No se presentan directamente",
  "Es cuestión de entrar a la cancha nomás"
];

export const CANCEL_CHALLENGES = [
  "Mirar el partido sentado en el piso con un diente de ajo",
  "Escribir 'Anulo Mufa' 100 veces a mano",
  "Prohibido usar la camiseta titular, usar una remera blanca lisa",
  "Ver los primeros 15 minutos de espaldas a la tele",
  "Tomar mates dulces todo el primer tiempo",
  "Congelar el nombre de la selección rival en el freezer",
  "No nombrar a la selección hasta que empiece el partido",
  "Besar la estampita del Diego 3 veces antes de empezar el partido",
  "Bañarse con agua fría antes del partido",
  "Apagar el celular el partido entero"
];

export const SEVERITY_LEVELS = [
  "Leve",
  "Moderado",
  "Grave",
  "Prisión Efectiva",
  "Exilio Permanente"
];

export const TOURNAMENT_STAGES = [
  "Fase de Grupos",
  "Dieciséisavos de Final",
  "Octavos de Final",
  "Cuartos de Final",
  "Semifinal",
  "Final"
];

export const MUFA_DANGER_WORDS = [
  // Las originales
  "campeón", "campeones", "fácil", "trámite", "goleada",
  "ganamos", "paseo", "crudos", "baile", "copa", "vuelta",
  "seguro", "imposible", "pasaje", "sobrados", "ganada", "liquidado",
  "muertos", "pecho", "pechos", "suerte", "cocinado",

  // Exceso de confianza extremo
  "caminando", "taquito", "ojos cerrados", "pan comido",
  "olvidate", "adentro", "fija", "regalados", "despeinado",
  "robo", "afano", "goleamos", "sobra", "tranqui",

  // Ninguneo al rival
  "conos", "troncos", "cojos", "microbio", "minúsculo",
  "chico", "existen", "desastre", "horribles", "amateur",
  "retirados", "kiosqueros", "verdulería", "oficinistas",

  // Festejo anticipado
  "obelisco", "semis", "final", "bicampeón", "bicampeones",
  "tricampeón", "tercera", "cuarta", "estrellita", "medalla",

  // Expresiones absolutas
  "siempre", "nunca", "obvio", "descontado", "listo",

  // Variantes y abreviaciones comunes en redes
  "ez", "izi", "rip", "lobby", "casa", "afuera", "lloren"
];

export const calculateSeverity = (stage: string, phrase: string): string => {
  // 1. Calculate base level index based on Stage (0 to 4)
  let baseLevel = 0;
  switch (stage) {
    case "Fase de Grupos": baseLevel = 0; break; // Leve
    case "16avos de Final": baseLevel = 1; break; // Moderado
    case "Octavos de Final": baseLevel = 1; break; // Moderado
    case "Cuartos de Final": baseLevel = 2; break; // Grave
    case "Semifinal": baseLevel = 3; break; // Prisión Efectiva
    case "Final": baseLevel = 4; break; // Traición a la patria (Exilio)
    default: baseLevel = 1; break;
  }

  // 2. Count Danger Words in the specific custom phrase
  const normalizedPhrase = phrase.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let dangerCount = 0;
  MUFA_DANGER_WORDS.forEach(word => {
    const normalizedWord = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalizedPhrase.includes(normalizedWord)) {
      dangerCount++;
    }
  });

  // 3. Early exit if no mufa words are detected
  if (dangerCount === 0) {
    return "Cargos Desestimados (Libre de Mufa)";
  }

  // 4. Add gravity points based on word danger
  // Each danger word shifts the severity up by 1 rank (max cap logic applies later)
  let finalLevelIndex = baseLevel + dangerCount;

  // 5. Resolve the calculated Severity
  if (stage === "Final" || finalLevelIndex >= 4) {
    return "Traición a la Patria (Máxima Seguridad)";
  } else if (finalLevelIndex === 3) {
    return "Prisión Efectiva";
  } else if (finalLevelIndex === 2) {
    return "Grave";
  } else if (finalLevelIndex === 1) {
    return "Moderado";
  } else {
    return "Leve";
  }
};

export const FAKE_HISTORY_REPORTS = [
  { name: "Tío Beto", offense: "Dijo 'A los brazucas los paseamos tranqui'", penalty: "Derivación al Pabellón Evita", time: "Hace 2 min" },
  { name: "Santi", offense: "Compró pasajes para la final en Fase de Grupos", penalty: "Exilio Inmediato a Uruguay", time: "Hace 5 min" },
  { name: "La abuela Norma", offense: "Lavó la camiseta blanca por accidente el día del partido", penalty: "Arresto Domiciliario sin PAMI", time: "Hace 12 min" },
  { name: "Marcos de Caballito", offense: "Gritó un gol antes de que cruce la línea", penalty: "Cadena Perpetua visualizando el VAR", time: "Hace 15 min" },
  { name: "Un Pelado Genérico", offense: "Tiró 'El partido es un mero trámite'", penalty: "Pérdida de la Patria Potestad", time: "Hace 21 min" },
  { name: "Kevin", offense: "Intentó revender entradas afirmando que 'ya ganamos'", penalty: "Trabajo Comunitario en Liniers", time: "Hace 34 min" },
  { name: "El Perro Firulais", offense: "Aulló de alegría cuando el arbitro cobró falta en contra", penalty: "Suspensión de asado por 3 domingos", time: "Hace 1 hora" },
  { name: "Micaela", offense: "Preguntó en pleno penal '¿quién es ese De Paul?'", penalty: "Deportación a Miami", time: "Hace 2 horas" },
  { name: "Tu Suegro", offense: "Apagó la tele en el minuto 89 para que 'no consuma el WiFi'", penalty: "Prohibición de ver partidos en HD", time: "Hace 3 horas" },
  { name: "Chapu", offense: "Hola", penalty: "Afuera de EEUU", time: "Hace 1 hora" },

];
