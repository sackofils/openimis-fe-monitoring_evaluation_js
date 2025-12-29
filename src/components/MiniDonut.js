import React from "react";

export default function MiniDonut({ value = 0, size = 42, stroke = 6 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.min(Math.max(value, 0), 100); // clamp 0–100
  const offset = circumference - (progress / 100) * circumference;

  // Couleurs dynamiques
  let color = "#1976d2"; // bleu
  if (progress < 0) color = "#d32f2f";        // rouge
  else if (progress < 50) color = "#f57c00";  // orange
  else if (progress >= 90) color = "#2e7d32"; // vert

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {/* Anneau de fond */}
      <svg width={size} height={size}>
        <circle
          stroke="#e0e0e0"
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>

      {/* Texte au centre */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: color,
        }}
      >
        {progress}%
      </div>
    </div>
  );
}
