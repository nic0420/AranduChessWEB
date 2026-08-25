import React from 'react';
import { getEvaluationDisplay } from '../services/chessEngine';

/**
 * EvaluationBar - Live engine advantage gauge (+2.5, -1.0, M1, etc.)
 */
export default function EvaluationBar({ scoreCentipawns = 0, isFlipped = false }) {
  // Convert centipawns to percentage between 5% and 95%
  // 0 -> 50%
  // +500 (+5.0) -> 85%
  // -500 (-5.0) -> 15%
  const clampScore = Math.max(-1000, Math.min(1000, scoreCentipawns));
  const whitePercent = Math.min(95, Math.max(5, 50 + (clampScore / 1000) * 45));
  const evalText = getEvaluationDisplay(scoreCentipawns);

  return (
    <div
      style={{
        width: '24px',
        height: '100%',
        maxHeight: '580px',
        backgroundColor: '#191715',
        borderRadius: '6px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: isFlipped ? 'column-reverse' : 'column',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.8)'
      }}
      title={`Evaluación: ${evalText}`}
    >
      {/* Black evaluation region */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#262421',
          transition: 'height 0.3s ease'
        }}
      />
      {/* White evaluation region */}
      <div
        style={{
          height: `${whitePercent}%`,
          backgroundColor: '#e8e8e8',
          transition: 'height 0.3s ease'
        }}
      />
      {/* Evaluation text badge */}
      <div
        style={{
          position: 'absolute',
          top: scoreCentipawns >= 0 ? 'auto' : '6px',
          bottom: scoreCentipawns >= 0 ? '6px' : 'auto',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.65rem',
          fontWeight: '800',
          color: scoreCentipawns >= 0 ? '#111' : '#fff',
          backgroundColor: scoreCentipawns >= 0 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
          padding: '2px 4px',
          borderRadius: '3px'
        }}
      >
        {evalText}
      </div>
    </div>
  );
}
