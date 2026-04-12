import React from 'react';

const Select = ({
  label,
  error,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  ...props
}) => {
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
        <select
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-xl border appearance-none
            ${error ? 'border-theme-danger' : 'border-theme-border'}
            bg-[var(--color-input-bg)]
            text-theme-text
            px-4 py-3
            text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2
            ${error ? 'focus:ring-red-500/30' : 'focus:ring-theme-primary/30'}
            ${error ? 'focus:border-theme-danger' : 'focus:border-theme-primary'}
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:border-theme-primary/50
            cursor-pointer
          `}
          {...props}
        >
          <option value="" disabled className="text-gray-400">
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-theme-card text-theme-text"
            >
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-theme-text-muted">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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
};

export default Select;
