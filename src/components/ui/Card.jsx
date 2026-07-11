export default function Card({ children, className = '', hover = false, padding = true, ...props }) {
  const base = 'rounded-2xl border border-border-primary bg-bg-secondary';
  const paddingCls = padding ? 'p-6' : '';
  const hoverCls = hover ? 'transition-all duration-200 hover:border-text-tertiary/40 hover:shadow-md cursor-pointer' : '';
  return (
    <div className={`${base} ${paddingCls} ${hoverCls} ${className}`} {...props}>
      {children}
    </div>
  );
}
