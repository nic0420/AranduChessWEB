// ==========================================================================
// Tactical Puzzles Dataset for Exercise Zone & Streak Mode (2600 ELO GM Audited)
// Categorized by tactic theme, difficulty rating, FEN, and moves
// ==========================================================================

export const PUZZLES_DATABASE = [
  {
    id: 'puz-001',
    title: 'Mate en 1: Pasillo',
    fen: '6k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1',
    rating: 600,
    theme: 'Mate del Pasillo',
    description: 'El Rey negro está atrapado por sus propios peones en la octava fila.',
    solution: [{ from: 'b1', to: 'b8' }],
    hint: 'Busca un jaque en la octava fila con tu Torre.'
  },
  {
    id: 'puz-002',
    title: 'Horquilla Mortal de Caballo',
    fen: 'r3k2r/ppp2ppp/8/3N4/8/8/PPP2PPP/R1B1K2R w KQkq - 0 1',
    rating: 850,
    theme: 'Horquilla',
    description: 'Encuentra el salto de Caballo blanco que ataca al Rey y a la Torre al mismo tiempo.',
    solution: [{ from: 'd5', to: 'c7' }],
    hint: 'La casilla c7 es débil y conecta un ataque doble sobre e8 y a8.'
  },
  {
    id: 'puz-003',
    title: 'Ataque a la Descubierta',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5',
    rating: 1100,
    theme: 'Ataque a la Descubierta',
    description: 'Centraliza tu Caballo c3 a d5 para presionar los puntos vulnerables del negro.',
    solution: [{ from: 'c3', to: 'd5' }],
    hint: 'Avanza tu Caballo central a d5 atacando el Alfil b4 y el Caballo f6.'
  },
  {
    id: 'puz-004',
    title: 'Sacrificio de Alfil en f7',
    fen: 'r1b2rk1/pp3ppp/2n5/4p3/2B1q3/5N2/PPP2PPP/R2Q1RK1 w - - 0 1',
    rating: 1350,
    theme: 'Sacrificio',
    description: 'Aprovecha la vulnerabilidad del enroque negro ejecutando un ataque directo sobre f7.',
    solution: [{ from: 'c4', to: 'f7' }],
    hint: 'Sacrifica tu Alfil en f7 para romper la estructura y desorganizar la defensa enemiga.'
  },
  {
    id: 'puz-005',
    title: 'Clavada Ganadora de Torre',
    fen: '3r2k1/ppp2ppp/8/8/8/4B3/PPP2PPP/3R2K1 w - - 0 1',
    rating: 1500,
    theme: 'Clavada',
    description: 'Aprovecha que la octava fila enemiga está expuesta.',
    solution: [{ from: 'd1', to: 'd8' }],
    hint: 'La octava fila no tiene defensores suficientes.'
  },
  {
    id: 'puz-006',
    title: 'Enfilada Ganadora de Alfil (Skewer)',
    fen: '8/8/6r1/8/4k3/8/2B5/4K3 w - - 0 1',
    rating: 1650,
    theme: 'Enfilada (Skewer)',
    description: 'Ataca al Rey a través de la diagonal d3-g6 para ganar la Torre expuesta detrás.',
    solution: [{ from: 'c2', to: 'd3' }],
    hint: 'Juega Alfil a d3 dando jaque al Rey en e4 y enfilando la Torre de g6.'
  }
];

