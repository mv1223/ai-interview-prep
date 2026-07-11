import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const VARIANTS = {
  primary:   'bg-brand-blue text-white hover:bg-brand-blue-dark shadow-sm hover:shadow-glow-blue',
  secondary: 'bg-bg-secondary text-text-primary border border-border-primary hover:bg-surface-hover',
  ghost:     'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
  danger:    'bg-danger text-white hover:bg-red-600 shadow-sm',
  dark:      'bg-text-primary text-bg-secondary hover:opacity-90',
  outline:   'border border-brand-blue text-brand-blue hover:bg-brand-blue/5',
};

const SIZES = {
  xs:  'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  sm:  'px-4 py-2 text-sm gap-1.5 rounded-xl',
  md:  'px-5 py-2.5 text-sm gap-2 rounded-xl',
  lg:  'px-6 py-3 text-base gap-2 rounded-xl',
  xl:  'px-8 py-4 text-base gap-2.5 rounded-2xl',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    as: Tag = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;
  const base = `inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary select-none`;
  const variantCls = VARIANTS[variant] || VARIANTS.primary;
  const sizeCls = SIZES[size] || SIZES.md;
  const widthCls = fullWidth ? 'w-full' : '';
  const disabledCls = isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <motion.button
      ref={ref}
      whileTap={!isDisabled ? { scale: 0.97 } : undefined}
      disabled={isDisabled}
      className={`${base} ${variantCls} ${sizeCls} ${widthCls} ${disabledCls} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  );
});

export default Button;
