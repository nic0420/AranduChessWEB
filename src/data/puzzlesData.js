// ==========================================================================
// Tactical Puzzles Dataset for Exercise Zone & Streak Mode
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
    fen: 'r3k2r/ppp2ppp/8/3n4/8/8/PPP2PPP/R1B1K2R w KQkq - 0 1',
    rating: 850,
    theme: 'Horquilla',
    description: 'Encuentra el salto de Caballo que ataca al Rey y a la Torre al mismo tiempo.',
    solution: [{ from: 'd5', to: 'c7' }],
    hint: 'La casilla c7 es débil y conecta con e8 y a8.'
  },
  {
    id: 'puz-003',
    title: 'Ataque a la Descubierta',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5',
    rating: 1100,
    theme: 'Ataque a la Descubierta',
    description: 'Mueve una pieza para destapar el ataque de otra pieza sobre un objetivo valioso.',
    solution: [{ from: 'c3', to: 'd5' }],
    hint: 'Si mueves tu Caballo central, tu Alfil o Torre abrirán línea.'
  },
  {
    id: 'puz-004',
    title: 'Sacrificio de Dama Deslumbrante',
    fen: 'r1b2rk1/pp3ppp/2n5/4p3/2B1q3/5N2/PPP2PPP/R2QK2R w KQ - 0 1',
    rating: 1350,
    theme: 'Sacrificio',
    description: 'Blanca juega y destruye la defensa enemiga.',
    solution: [{ from: 'c4', to: 'f7' }],
    hint: 'Apunta a f7 con la pieza menor antes de usar la Dama.'
  },
  {
    id: 'puz-005',
    title: 'Clavada Ganadora de Torre',
    fen: '3r2k1/ppp2ppp/8/8/8/4B3/PPP2PPP/3R2K1 w - - 0 1',
    rating: 1500,
    theme: 'Clavada',
    description: 'Aprovecha que la Torre enemiga está expuesta.',
    solution: [{ from: 'd1', to: 'd8' }],
    hint: 'La octava fila está desprotegida.'
  },
  {
    id: 'puz-006',
    title: 'Enfilada de Alfil',
    fen: '8/p7/1p6/1B6/8/2k5/r7/2K5 w - - 0 1',
    rating: 1650,
    theme: 'Enfilada (Skewer)',
    description: 'Ataca al Rey a través de la diagonal para ganar la pieza detrás.',
    solution: [{ from: 'b5', to: 'c4' }],
    hint: 'Jaque en c4 alinearás Rey y Torre.'
  }
];
