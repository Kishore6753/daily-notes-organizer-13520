import React from "react";

/** Circular progress ring with accessible role */
export default function ProgressRing({ size = 68, stroke = 8, value = 0, color = "var(--progress-inprogress)", label = "" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * circumference;

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 8 }}>
      <svg width={size} height={size} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--text-primary)">
          {clamped}%
        </text>
      </svg>
      <div className="meta" style={{ textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
    </div>
  );
}
