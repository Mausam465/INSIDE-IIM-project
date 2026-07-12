import React from 'react';

/**
 * Custom SVG Financial Charts in Warm Cream-Beige Theme
 */

export function RevenueTrendChart({ baseRevenue, ticker }) {
  const rev = baseRevenue || 120000000000;
  const data = [
    { year: '2022', val: rev * 0.78 },
    { year: '2023', val: rev * 0.84 },
    { year: '2024', val: rev * 0.91 },
    { year: '2025', val: rev * 0.95 },
    { year: '2026', val: rev }
  ];

  const width = 500;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 30, left: 60 };

  const minVal = Math.min(...data.map(d => d.val)) * 0.9;
  const maxVal = Math.max(...data.map(d => d.val)) * 1.1;

  const getX = (index) => padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
  const getY = (value) => height - padding.bottom - ((value - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);

  const points = data.map((d, i) => `${getX(i)},${getY(d.val)}`).join(' ');
  const areaPoints = `${getX(0)},${height - padding.bottom} ${points} ${getX(data.length - 1)},${height - padding.bottom}`;

  const formatYLabel = (val) => {
    if (val >= 1e12) return `$${(val / 1e12).toFixed(1)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(0)}B`;
    return `$${(val / 1e6).toFixed(0)}M`;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Revenue Trend (5-Year)</h5>
        <span className="text-[10px] text-orange-600 font-mono font-bold">Scale: USD</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const yVal = minVal + ratio * (maxVal - minVal);
          const y = getY(yVal);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#f1f5f9"
                strokeWidth="1.2"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 10}
                y={y + 3}
                fill="#64748b"
                fontSize="9"
                fontWeight="bold"
                textAnchor="end"
              >
                {formatYLabel(yVal)}
              </text>
            </g>
          );
        })}

        {/* Area Fill */}
        <polygon points={areaPoints} fill="url(#areaGradient)" />

        {/* Trend Line */}
        <polyline
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="drop-shadow-[0_2px_4px_rgba(245,158,11,0.15)]"
        />

        {/* X Axis Labels */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.val);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#ffffff"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
              <text
                x={x}
                y={height - 8}
                fill="#64748b"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {d.year}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function IncomeComparisonChart({ baseIncome }) {
  const income = baseIncome || 15000000000;
  const data = [
    { label: 'Q1', val: income * 0.22 },
    { label: 'Q2', val: income * 0.24 },
    { label: 'Q3', val: income * 0.26 },
    { label: 'Q4', val: income * 0.28 }
  ];

  const width = 500;
  const height = 180;
  const padding = { top: 25, right: 30, bottom: 30, left: 60 };

  const maxVal = Math.max(...data.map(d => d.val)) * 1.2;

  const getX = (index) => padding.left + (index / data.length) * (width - padding.left - padding.right) + 20;
  const getY = (value) => height - padding.bottom - (value / maxVal) * (height - padding.top - padding.bottom);
  const barWidth = 45;

  const formatYLabel = (val) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
    return `$${(val / 1e6).toFixed(0)}M`;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Quarterly Net Income</h5>
        <span className="text-[10px] text-orange-600 font-mono font-bold">Scale: USD</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const yVal = ratio * maxVal;
          const y = getY(yVal);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#f1f5f9"
                strokeWidth="1.2"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 10}
                y={y + 3}
                fill="#64748b"
                fontSize="9"
                fontWeight="bold"
                textAnchor="end"
              >
                {formatYLabel(yVal)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.val);
          const barHeight = height - padding.bottom - y;

          return (
            <g key={i}>
              <rect
                x={x - barWidth / 2}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill="url(#barGradient)"
                className="transition-all duration-300 hover:opacity-90"
              />
              <text
                x={x}
                y={y - 6}
                fill="#d97706"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                {formatYLabel(d.val)}
              </text>
              <text
                x={x}
                y={height - 8}
                fill="#64748b"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
