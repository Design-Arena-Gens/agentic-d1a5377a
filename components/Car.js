export default function Car({ color = "#ff5c5c", number = 1 }) {
  // Simple cute car SVG
  return (
    <svg viewBox="0 0 240 120" width="120" height="64" role="img" aria-label={`Car ${number}`}>
      <defs>
        <linearGradient id={`g-${number}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <rect x="16" y="44" width="180" height="40" rx="14" fill={`url(#g-${number})`} stroke="#1f2a44" strokeWidth="3" />
      <path d="M70 44 C90 10, 170 10, 190 44 Z" fill={color} stroke="#1f2a44" strokeWidth="3" />
      <rect x="100" y="22" width="46" height="16" rx="3" fill="#dff1ff" stroke="#1f2a44" strokeWidth="2" />
      <circle cx="70" cy="92" r="16" fill="#2b3a67" />
      <circle cx="70" cy="92" r="10" fill="#9fb3ff" />
      <circle cx="170" cy="92" r="16" fill="#2b3a67" />
      <circle cx="170" cy="92" r="10" fill="#9fb3ff" />
      <rect x="26" y="56" width="40" height="12" rx="6" fill="#fff" opacity="0.6" />
      <text x="210" y="80" fontSize="28" fontWeight="800" textAnchor="middle" fill="#1f2a44">
        {number}
      </text>
    </svg>
  );
}

