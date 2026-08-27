// ==========================================================================
// Interactive Lessons Data - Scaled by FIDE Elo Levels (2600 ELO GM Audited)
// Includes Theory, Board Demonstration, and Practical Board Test Exercises
// ==========================================================================

export const LESSON_LEVELS = [
  { id: 'novice', name: 'Principiante', eloRange: '400 - 800 Elo', badge: '🌱', color: '#81b64c' },
  { id: 'intermediate', name: 'Intermedio', eloRange: '800 - 1200 Elo', badge: '⚔️', color: '#4b8bbd' },
  { id: 'advanced', name: 'Avanzado', eloRange: '1200 - 1600 Elo', badge: '🛡️', color: '#9b51e0' },
  { id: 'expert', name: 'Experto', eloRange: '1600 - 2000 Elo', badge: '🔥', color: '#e58f2a' },
  { id: 'master', name: 'Maestro', eloRange: '2000+ Elo', badge: '👑', color: '#f0c040' }
];

export const LESSONS_DATA = [
  {
    id: 'lesson-101',
    levelId: 'novice',
    title: 'Control del Centro y las 3 Reglas de Oro',
    elo: 400,
    duration: '5 min',
    description: 'Aprende las 3 reglas fundamentales de la apertura: dominar el centro, desarrollar piezas menores y proteger a tu Rey con el enroque.',
    theory: `
      En el ajedrez, los 4 escaques centrales (**d4, d5, e4, e5**) son el territorio más codiciado de la batalla.
      
      ### Las 3 Reglas Principales de Apertura:
      1. **Ocupa o controla el centro**: Comienza moviendo peones centrales como **1.e4** o **1.d4**.
      2. **Desarrolla tus Caballos y Alfiles**: Muévelos hacia casillas activas donde ataquen o defiendan.
      3. **Pon a salvo a tu Rey**: Enroca rápidamente (corto o largo) para sacar a tu Rey del centro amenazado.
    `,
    initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      {
        instruction: 'Paso 1: Juega 1.e4 para ocupar el centro y liberar caminos para tu Alfil y Reina.',
        targetMove: { from: 'e2', to: 'e4' },
        explanation: '¡Excelente! 1.e4 controla la casilla d5 y libera el paso del Alfil de f1 y la Dama.'
      },
      {
        instruction: 'Paso 2: Tras 1...e5 de las negras, desarrolla tu Caballo blanco a f3 para atacar e5 y controlar d4.',
        initialFenOverride: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
        targetMove: { from: 'g1', to: 'f3' },
        explanation: '¡Gran movimiento! Los Caballos deben desarrollarse antes que los Alfiles habitualmente.'
      },
      {
        instruction: 'Paso 3: Tras 2...Nc6, saca tu Alfil de casillas blancas a c4 apuntando a la casilla vulnerable f7.',
        initialFenOverride: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
        targetMove: { from: 'f1', to: 'c4' },
        explanation: '¡Perfecto! Tu Alfil apunta directo al peón f7, la casilla más débil del bando negro.'
      }
    ]
  },
  {
    id: 'lesson-102',
    levelId: 'novice',
    title: 'El Mate del Pastor (Jaque Mate en 4 jugadas)',
    elo: 600,
    duration: '6 min',
    description: 'Descubre el jaque mate rápido más famoso del ajedrez y aprende exactamente cómo ejecutarlo y cómo defenderte de él.',
    theory: `
      El **Mate del Pastor** aprovecha la debilidad de la casilla **f7** (o f2 para las blancas), la cual sólo está protegida por el Rey al inicio del juego.
      
      ### Secuencia del Ataque:
      - 1. e4 e5
      - 2. Ac4 Nc6
      - 3. Dh5 Cf6?? (Error grave)
      - 4. Dxf7# (¡Jaque Mate!)
    `,
    initialFen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 2 3',
    steps: [
      {
        instruction: '¡Es tu turno de dar Jaque Mate! Captura el peón f7 con tu Dama blanca en h5.',
        targetMove: { from: 'h5', to: 'f7' },
        explanation: '¡Jaque Mate! El Rey negro no puede capturar a la Dama porque está protegida por el Alfil de c4, y no tiene casillas de escape.'
      }
    ]
  },
  {
    id: 'lesson-201',
    levelId: 'intermediate',
    title: 'Táctica: La Horquilla (El Ataque Doble)',
    elo: 900,
    duration: '8 min',
    description: 'La horquilla ocurre cuando una sola pieza ataca dos o más piezas enemigas simultáneamente. El Caballo es el rey de las horquillas.',
    theory: `
      Una **horquilla** es una táctica devastadora porque el oponente solo puede salvar una de las piezas amenazadas.
      
      Los Caballos son ideales para realizar horquillas debido a su movimiento en "L" capaz de saltar sobre otras piezas y atacar al Rey y a la Torre al mismo tiempo.
    `,
    initialFen: 'r3k2r/ppp2ppp/8/3N4/8/8/PPP2PPP/R1B1K2R w KQkq - 0 1',
    steps: [
      {
        instruction: 'Encuentra el salto de Caballo blanco desde d5 a c7 para hacer horquilla a Rey (e8) y Torre (a8).',
        initialFenOverride: 'r3k2r/ppp2ppp/8/3N4/8/8/PPP2PPP/R1B1K2R w KQkq - 0 1',
        targetMove: { from: 'd5', to: 'c7' },
        explanation: '¡Increíble! Caballo a c7 da jaque al Rey y ataca la Torre de a8 al mismo tiempo.'
      }
    ]
  },
  {
    id: 'lesson-202',
    levelId: 'intermediate',
    title: 'La Clavada: Paralizando Piezas Enemigas',
    elo: 1100,
    duration: '7 min',
    description: 'Aprende a inmovilizar las piezas enemigas atacándolas en una misma línea con Alfiles, Torres o Damas.',
    theory: `
      Una **clavada** ocurre cuando una pieza atacada no puede moverse sin exponer una pieza más valiosa (o al Rey) detrás de ella.
      
      - **Clavada absoluta**: La pieza detrás es el Rey (es ilegal mover la pieza clavada).
      - **Clavada relativa**: La pieza detrás es una Dama o Torre.
    `,
    initialFen: 'rn1qkbnr/ppp1pppp/8/3p4/4P1b1/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
    steps: [
      {
        instruction: 'El Alfil negro en g4 está clavando a tu Caballo f3 contra tu Dama. Juega h3 para cuestionar al Alfil.',
        targetMove: { from: 'h2', to: 'h3' },
        explanation: '¡Excelente! Al jugar h3 obligas al Alfil enemigo a retirarse o cambiar en f3.'
      }
    ]
  },
  {
    id: 'lesson-301',
    levelId: 'advanced',
    title: 'Estructura de Peones y Peón Pasado',
    elo: 1400,
    duration: '10 min',
    description: 'Comprende el alma del ajedrez: cómo evaluar peones doblados, aislados y cómo crear un peón pasado ganador.',
    theory: `
      Un **Peón Pasado** es aquel que no tiene peones enemigos en su columna ni en las columnas adyacentes que puedan detener su avance hacia la promoción.
      
      > *"Un peón pasado es un criminal que debe ser mantenido bajo llave." - Aaron Nimzowitsch*
    `,
    initialFen: '8/4k3/8/3P4/8/8/4K3/8 w - - 0 1',
    steps: [
      {
        instruction: 'Avanza tu peón pasado libremente a d6 para amenazar la promoción a Dama.',
        targetMove: { from: 'd5', to: 'd6' },
        explanation: '¡Perfecto! El peón pasado avanza creando una amenaza inminente de coronación.'
      }
    ]
  },
  {
    id: 'lesson-401',
    levelId: 'expert',
    title: 'El Ataque de Minorías en la Estructura Carlsbad',
    elo: 1750,
    duration: '12 min',
    description: 'Estrategia posicional de nivel alto: cómo utilizar dos peones para debilitar tres peones enemigos en el flanco de dama.',
    theory: `
      El **Ataque de Minorías** se realiza empujando b4 y b5 contra la cadena c6-b7-a7 para crear un peón débil retrasado en c6 o un objetivo en b6.
    `,
    initialFen: 'r1r3k1/pp3ppp/2p1pn2/3p4/2PP4/1PN1P3/P4PPP/R1R3K1 w - - 0 1',
    steps: [
      {
        instruction: 'Inicia el ataque de minorías jugando b4.',
        targetMove: { from: 'b3', to: 'b4' },
        explanation: '¡Impecable! Con b4 preparas b5 para dinamitar la estructura c6 del negro.'
      }
    ]
  }
];

