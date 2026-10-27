import React from 'react';

export default function Card({ children, title, subtitle, badge, className = '', action }) {
  return (
    <div className={`card ${className}`}>
      {(title || badge || action) && (
        <div className="card-header">
          <div>
            {badge && <div style={{ marginBottom: '0.4rem' }}>{badge}</div>}
            {title && <h3 style={{ margin: 0 }}>{title}</h3>}
            {subtitle && <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

