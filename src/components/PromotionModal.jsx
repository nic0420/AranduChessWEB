import React from 'react';

/**
 * PromotionModal - Popup component to select pawn promotion piece (Q, R, B, N)
 */
export default function PromotionModal({ color = 'w', onSelect }) {
  const pieces = [
    { type: 'q', name: 'Reina', char: color === 'w' ? '♕' : '♛' },
    { type: 'r', name: 'Torre', char: color === 'w' ? '♖' : '♜' },
    { type: 'b', name: 'Alfil', char: color === 'w' ? '♗' : '♝' },
    { type: 'n', name: 'Caballo', char: color === 'w' ? '♘' : '♞' }
  ];

  return (
    <div className="promotion-overlay animate-slide-up">
      <div className="promotion-box">
        <h4 style={{ position: 'absolute', top: '-35px', left: '50%', transform: 'translateX(-50%)', color: '#f0c040', whiteSpace: 'nowrap' }}>
          Elige pieza de promoción
        </h4>
        {pieces.map(p => (
          <div
            key={p.type}
            className="promotion-option"
            title={`Promocionar a ${p.name}`}
            onClick={() => onSelect(p.type)}
          >
            <span style={{ fontSize: '2.5rem' }}>{p.char}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
