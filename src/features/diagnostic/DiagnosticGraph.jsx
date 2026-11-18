import React, { useState } from 'react';

/**
 * Komponen Grafik Garis & Tabel Data Suhu vs Waktu
 * Didesain responsif mobile-first, sumbu x waktu (detik), sumbu y suhu (°C),
 * dan tabel yang dapat digeser secara horizontal tanpa melebarkan halaman HP.
 */
export default function DiagnosticGraph({ dataGrafik, title = 'Grafik Rekaman Suhu' }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!dataGrafik || !Array.isArray(dataGrafik.x) || !Array.isArray(dataGrafik.y)) {
    return null;
  }

  const { x, y, x_label = 'Waktu (detik)', y_label = 'Suhu (°C)' } = dataGrafik;
  const n = Math.min(x.length, y.length);
  if (n === 0) return null;

  // Tentukan batas min & max
  const minX = Math.min(...x);
  const maxX = Math.max(...x);
  const minY = Math.min(...y, 0); // Selalu sertakan 0 °C
  const maxY = Math.max(...y, 0);

  // Berikan margin ekstra pada sumbu Y
  const yPadding = Math.max(1, (maxY - minY) * 0.15);
  const domainYMin = minY - yPadding;
  const domainYMax = maxY + yPadding;

  // Ukuran viewBox SVG
  const width = 520;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 45, left: 55 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  // Skalator koordinat
  const scaleX = (val) => {
    if (maxX === minX) return padding.left + plotW / 2;
    return padding.left + ((val - minX) / (maxX - minX)) * plotW;
  };

  const scaleY = (val) => {
    if (domainYMax === domainYMin) return padding.top + plotH / 2;
    return padding.top + ((domainYMax - val) / (domainYMax - domainYMin)) * plotH;
  };

  // Garis 0 derajat Celcius
  const zeroY = scaleY(0);

  // Buat path kurva
  const points = [];
  for (let i = 0; i < n; i++) {
    points.push({
      xVal: x[i],
      yVal: y[i],
      cx: scaleX(x[i]),
      cy: scaleY(y[i]),
      index: i
    });
  }

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.cx} ${pt.cy}` : `${acc} L ${pt.cx} ${pt.cy}`;
  }, '');

  // Ticks untuk sumbu Y (misal 5 interval)
  const yTickCount = 5;
  const yTicks = [];
  for (let i = 0; i <= yTickCount; i++) {
    const val = domainYMin + (i / yTickCount) * (domainYMax - domainYMin);
    yTicks.push(Number(val.toFixed(1)));
  }

  return (
    <div style={{
      background: '#F8FAFC',
      border: '1.5px solid #CBD5E1',
      borderRadius: '14px',
      padding: '1.1rem',
      margin: '1.25rem 0',
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
    }}>
      {/* Judul & Keterangan */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📈</span> {title}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#64748B', background: '#E2E8F0', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
          Ketuk titik untuk melihat nilai
        </div>
      </div>

      {/* Kontainer SVG */}
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          role="img"
          aria-label={`${title}: grafik ${x_label} terhadap ${y_label}`}
        >
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid garis horizontal & label sumbu Y */}
          {yTicks.map((val, idx) => {
            const py = scaleY(val);
            return (
              <g key={`ytick-${idx}`}>
                <line
                  x1={padding.left}
                  y1={py}
                  x2={width - padding.right}
                  y2={py}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={py + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fill="#64748B"
                  fontFamily="sans-serif"
                >
                  {val.toLocaleString('id-ID')}°C
                </text>
              </g>
            );
          })}

          {/* Garis acuan 0 °C (garis tegas/putus-putus berwarna merah/abu) */}
          <line
            x1={padding.left}
            y1={zeroY}
            x2={width - padding.right}
            y2={zeroY}
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text
            x={width - padding.right + 4}
            y={zeroY + 3}
            fontSize="10"
            fill="#DC2626"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            0°C
          </text>

          {/* Area bayangan di bawah kurva */}
          <path
            d={`${pathD} L ${scaleX(x[n - 1])} ${scaleY(domainYMin)} L ${scaleX(x[0])} ${scaleY(domainYMin)} Z`}
            fill="url(#curveGradient)"
          />

          {/* Garis kurva utama */}
          <path
            d={pathD}
            fill="none"
            stroke="#0284C7"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Titik-titik data (interactive) */}
          {points.map((pt) => {
            const isHovered = hoveredPoint?.index === pt.index;
            return (
              <g
                key={`point-${pt.index}`}
                onClick={() => setHoveredPoint(pt)}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#0369A1' : '#0284C7'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                {/* Lingkaran deteksi sentuh lebih besar untuk HP */}
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r="14"
                  fill="transparent"
                />
              </g>
            );
          })}

          {/* Tooltip titik terpilih */}
          {hoveredPoint && (
            <g transform={`translate(${Math.min(width - 90, Math.max(padding.left, hoveredPoint.cx))}, ${Math.max(padding.top + 15, hoveredPoint.cy - 12)})`}>
              <rect
                x="-42"
                y="-28"
                width="84"
                height="24"
                rx="6"
                fill="#0F172A"
                fillOpacity="0.9"
              />
              <text
                x="0"
                y="-13"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="10.5"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {hoveredPoint.xVal}s: {hoveredPoint.yVal.toLocaleString('id-ID')}°C
              </text>
            </g>
          )}

          {/* Ticks Sumbu X */}
          {points.map((pt, idx) => {
            // Tampilkan label sumbu X selang-seling jika terlalu rapat
            const showTick = n <= 6 || idx % 2 === 0 || idx === n - 1;
            if (!showTick) return null;
            return (
              <g key={`xtick-${idx}`}>
                <line
                  x1={pt.cx}
                  y1={height - padding.bottom}
                  x2={pt.cx}
                  y2={height - padding.bottom + 5}
                  stroke="#94A3B8"
                  strokeWidth="1"
                />
                <text
                  x={pt.cx}
                  y={height - padding.bottom + 17}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748B"
                  fontFamily="sans-serif"
                >
                  {pt.xVal}
                </text>
              </g>
            );
          })}

          {/* Label Sumbu X & Y */}
          <text
            x={padding.left + plotW / 2}
            y={height - 8}
            textAnchor="middle"
            fontSize="11"
            fill="#475569"
            fontWeight="600"
            fontFamily="sans-serif"
          >
            {x_label}
          </text>

          <text
            x={-(padding.top + plotH / 2)}
            y="16"
            textAnchor="middle"
            fontSize="11"
            fill="#475569"
            fontWeight="600"
            fontFamily="sans-serif"
            transform="rotate(-90)"
          >
            {y_label}
          </text>
        </svg>
      </div>

      {/* Tabel Data (Scrollable Horizontal untuk Layar HP, tidak melebarkan halaman) */}
      <div style={{ marginTop: '0.85rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
          📋 Tabel Data Pengamatan ({x_label} vs {y_label}):
        </div>
        <div style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          maxWidth: '100%',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          background: '#FFFFFF'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.82rem',
            textAlign: 'center',
            minWidth: '380px'
          }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', color: '#1E293B' }}>
                <th style={{ padding: '0.5rem 0.6rem', fontWeight: 600, borderRight: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>
                  {x_label}
                </th>
                {x.map((xVal, idx) => (
                  <th key={`th-${idx}`} style={{ padding: '0.5rem 0.6rem', fontWeight: 600, borderRight: idx < x.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                    {xVal}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600, background: '#F8FAFC', borderRight: '1px solid #E2E8F0', color: '#0369A1', whiteSpace: 'nowrap' }}>
                  {y_label}
                </td>
                {y.map((yVal, idx) => {
                  const isZero = yVal === 0;
                  const isNegative = yVal < 0;
                  return (
                    <td
                      key={`td-${idx}`}
                      style={{
                        padding: '0.5rem 0.6rem',
                        borderRight: idx < y.length - 1 ? '1px solid #E2E8F0' : 'none',
                        color: isNegative ? '#DC2626' : (isZero ? '#2563EB' : '#1E293B'),
                        fontWeight: (isNegative || isZero) ? 600 : 400,
                        background: hoveredPoint?.index === idx ? '#EFF6FF' : 'transparent'
                      }}
                    >
                      {yVal.toLocaleString('id-ID')}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
