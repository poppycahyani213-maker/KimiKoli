import React from 'react';

export default function ProgressBar({ value = 0, max = 100, label }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}>
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

