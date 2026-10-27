import React from 'react';

/**
 * Renders chemical formulas and mathematical equations cleanly
 * using semantic HTML sub/sup tags and unicode symbols.
 */
export function FormulaRenderer({ formula, description, className = '' }) {
  return (
    <div className={`formula-box ${className}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="formula-symbol">∑</span>
        <span>{formula}</span>
      </div>
      {description && (
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>
          {description}
        </span>
      )}
    </div>
  );
}

export function ChemicalName({ formula, name }) {
  return (
    <span>
      <strong>{name}</strong>{' '}
      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9em' }}>
        ({formula})
      </span>
    </span>
  );
}

export default FormulaRenderer;

