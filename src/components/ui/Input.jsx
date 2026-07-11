import { forwardRef, useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    type = 'text',
    required,
    className = '',
    containerClassName = '',
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const baseCls = `w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:ring-2 focus:bg-bg-secondary`;
  const borderCls = error
    ? 'border-danger focus:border-danger focus:ring-danger/15'
    : 'border-border-primary focus:border-brand-blue focus:ring-brand-blue/12';
  const paddingLeft = leftIcon ? 'pl-10' : '';
  const paddingRight = isPassword || rightIcon ? 'pr-10' : '';

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-text-secondary">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`${baseCls} ${borderCls} ${paddingLeft} ${paddingRight} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <IoEyeOffOutline size={17} /> : <IoEyeOutline size={17} />}
          </button>
        )}
        {!isPassword && rightIcon && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-danger flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-text-tertiary">{hint}</p>}
    </div>
  );
});

export default Input;
