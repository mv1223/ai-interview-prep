const STYLES = {
  blue:   'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30',
  purple: 'bg-purple-50 text-purple-700 border-purple-200/50 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800/30',
  green:  'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30',
  red:    'bg-red-50 text-red-700 border-red-200/50 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/30',
  amber:  'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/30',
  gray:   'bg-surface text-text-secondary border-border-primary dark:bg-surface dark:text-text-secondary',
  cyan:   'bg-cyan-50 text-cyan-700 border-cyan-200/50 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-800/30',
};

export default function Badge({ children, color = 'gray', dot = false, className = '' }) {
  const dotColors = {
    blue: 'bg-blue-500', purple: 'bg-purple-500', green: 'bg-emerald-500',
    red: 'bg-red-500', amber: 'bg-amber-500', gray: 'bg-text-tertiary', cyan: 'bg-cyan-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STYLES[color] || STYLES.gray} ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColors[color] || dotColors.gray}`} />}
      {children}
    </span>
  );
}
