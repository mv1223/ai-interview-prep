import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  primaryCta, 
  secondaryHelper 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center p-8 border border-border-primary/80 bg-bg-secondary rounded-2xl shadow-premium max-w-lg mx-auto my-6"
    >
      {/* Icon Area with premium glow border */}
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-hover/80 text-text-secondary border border-border-primary mb-5 relative group transition-all duration-300">
          <div className="absolute inset-0 rounded-full bg-brand-blue/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Icon size={26} className="text-text-secondary group-hover:text-brand-blue transition-colors duration-300 relative z-10" />
        </div>
      )}

      {/* Text Details */}
      <h4 className="text-sm font-bold font-heading text-text-primary tracking-tight">
        {title}
      </h4>
      <p className="mt-2 text-xxs sm:text-xs text-text-secondary leading-relaxed max-w-sm">
        {description}
      </p>

      {/* Primary Action Call To Action */}
      {primaryCta && (
        <div className="mt-6 w-full">
          {primaryCta.path ? (
            <Link
              to={primaryCta.path}
              className="inline-flex items-center justify-center rounded-xl bg-text-primary px-5 py-2.5 text-xxs font-bold text-bg-secondary hover:opacity-90 active:scale-[0.98] transition-all shadow-premium"
            >
              {primaryCta.label}
            </Link>
          ) : (
            <button
              onClick={primaryCta.onClick}
              className="inline-flex items-center justify-center rounded-xl bg-text-primary px-5 py-2.5 text-xxs font-bold text-bg-secondary hover:opacity-90 active:scale-[0.98] transition-all shadow-premium cursor-pointer"
            >
              {primaryCta.label}
            </button>
          )}
        </div>
      )}

      {/* Secondary Helpers */}
      {secondaryHelper && (
        <p className="mt-4 text-[10px] text-text-secondary">
          {secondaryHelper}
        </p>
      )}
    </motion.div>
  );
}
