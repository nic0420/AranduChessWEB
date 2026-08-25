// ==========================================================================
// Training Zone Data: Openings, Endgames, Vision Speed Test, and AI Bots
// ==========================================================================

export const OPENINGS_DATA = [
  {
    id: 'op-ruy-lopez',
    name: 'Apertura Española (Ruy López)',
    moves: ['1.e4', 'e5', '2.Nf3', 'Nc6', '3.Bb5'],
    eco: 'C60',
    description: 'La apertura clásica más respetada a nivel de Gran Maestro. Presiona el caballo c6 que defiende e5.',
    fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3'
  },
  {
    id: 'op-sicilian',
    name: 'Defensa Siciliana',
    moves: ['1.e4', 'c5'],
    eco: 'B20',
    description: 'La respuesta más combativa y popular de las negras contra 1.e4, buscando un juego asimétrico.',
    fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2'
  },
  {
    id: 'op-queens-gambit',
    name: 'Gambito de Dama',
    moves: ['1.d4', 'd5', '2.c4'],
    eco: 'D06',
    description: 'Blanco ofrece un peón en c4 para lograr un control abrumador del centro con d4 y e4.',
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2'
  },
  {
    id: 'op-caro-kann',
    name: 'Defensa Caro-Kann',
    moves: ['1.e4', 'c6', '2.d4', 'd5'],
    eco: 'B12',
    description: 'Una defensa extremadamente sólida para las negras, preparando c6 antes de golpear el centro con d5.',
    fen: 'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3'
  }
];

export const ENDGAMES_DATA = [
  {
    id: 'eg-kq-k',
    name: 'Mate de Rey y Dama contra Rey',
    difficulty: 'Fácil',
    description: 'Conduce al Rey enemigo hacia el borde del tablero usando la Dama como una barrera.',
    fen: '8/8/8/4k3/8/8/8/4K2Q w - - 0 1'
  },
  {
    id: 'eg-kr-k',
    name: 'Mate de Rey y Torre contra Rey',
    difficulty: 'Intermedio',
    description: 'Crea una caja reductora con la Torre y usa tu Rey para limitar las casillas del bando rival.',
    fen: '8/8/8/4k3/8/8/8/4K2R w - - 0 1'
  },
  {
    id: 'eg-pawn',
    name: 'Regla del Cuadrado (Final de Peones)',
    difficulty: 'Avanzado',
    description: 'Calcula al instante si tu Rey puede alcanzar a un peón pasado antes de que corone.',
    fen: '8/8/8/3P4/8/8/k7/4K3 w - - 0 1'
  }
];

export const AI_BOTS = [
  {
    id: 'bot-martin',
    name: 'Martin',
    elo: 200,
    avatar: '👨‍🌾',
    personality: 'Principiante entusiasta. Suele cometer errores amigables.',
    quote: '¡Me encanta jugar ajedrez mientras tomo café!'
  },
  {
    id: 'bot-elani',
    name: 'Elani',
    elo: 600,
    avatar: '👩‍🎨',
    personality: 'Jugadora táctica en formación. Le gusta atacar rápido.',
    quote: '¡Cuidado con tus piezas sin defender!'
  },
  {
    id: 'bot-nelson',
    name: 'Nelson',
    elo: 1300,
    avatar: '🧔‍♂️',
    personality: 'Amante de la Dama temprana. Le encanta sacar su Dama en la jugada 2.',
    quote: '¡Mi Dama y yo conquistaremos el tablero!'
  },
  {
    id: 'bot-isabel',
    name: 'Isabel (Maestra)',
    elo: 1800,
    avatar: '👩‍🔬',
    personality: 'Estratega posicional. Castiga despiadadamente cualquier imprecisión.',
    quote: 'Cada peón cuenta una historia en el tablero.'
  },
  {
    id: 'bot-magnus',
    name: 'Magnus Bot',
    elo: 2800,
    avatar: '👑',
    personality: 'Nivel Gran Maestro Mundial. Precisión casi perfecta.',
    quote: 'Incluso en posiciones igualadas, encontraré una ventaja.'
  }
];
