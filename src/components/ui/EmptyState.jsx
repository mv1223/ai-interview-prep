import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  primaryCta,
  secondaryCta,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex flex-col items-center justify-center text-center py-14 px-8 ${className}`}
    >
      {Icon && (
        <div className="h-16 w-16 rounded-2xl bg-surface flex items-center justify-center border border-border-primary mb-5 text-text-tertiary">
          <Icon size={28} />
        </div>
      )}

      <h4 className="text-base font-bold text-text-primary tracking-tight">
        {title}
      </h4>
      {description && (
        <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-sm">
          {description}
        </p>
      )}

      {(primaryCta || secondaryCta) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {primaryCta && (
            primaryCta.path
              ? <Link to={primaryCta.path}><Button size="sm">{primaryCta.label}</Button></Link>
              : <Button size="sm" onClick={primaryCta.onClick}>{primaryCta.label}</Button>
          )}
          {secondaryCta && (
            secondaryCta.path
              ? <Link to={secondaryCta.path}><Button size="sm" variant="secondary">{secondaryCta.label}</Button></Link>
              : <Button size="sm" variant="secondary" onClick={secondaryCta.onClick}>{secondaryCta.label}</Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
