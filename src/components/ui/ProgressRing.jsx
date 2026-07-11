export default function ProgressRing({ value = 0, size = 120, strokeWidth = 8, color = '#3b82f6', trackColor, label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  const defaultTrack = 'var(--border-primary)';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor || defaultTrack}
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label !== undefined && (
          <span className="text-2xl font-extrabold font-heading text-text-primary leading-none">{label}</span>
        )}
        {sublabel && (
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mt-1">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
