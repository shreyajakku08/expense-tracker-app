import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="text-sm font-medium text-theme-text-secondary"
        >
          {label}
          {required && <span className="text-theme-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-muted text-lg">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id || name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-xl border
            ${error ? 'border-theme-danger' : 'border-theme-border'}
            bg-[var(--color-input-bg)]
            text-theme-text
            placeholder:text-theme-text-muted
            px-4 py-3
            ${icon ? 'pl-10' : ''}
            text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2
            ${error ? 'focus:ring-red-500/30' : 'focus:ring-theme-primary/30'}
            ${error ? 'focus:border-theme-danger' : 'focus:border-theme-primary'}
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:border-theme-primary/50
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-theme-danger flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
