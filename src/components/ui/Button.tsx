import React from 'react';
import type { ButtonProps } from '../../types';

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-lumen-primary text-white hover:bg-lumen-primary/90 focus:ring-lumen-primary/50',
    secondary: 'bg-lumen-secondary text-white hover:bg-lumen-secondary/90 focus:ring-lumen-secondary/50',
    outline: 'border-2 border-lumen-secondary text-lumen-secondary hover:bg-lumen-secondary hover:text-white focus:ring-lumen-secondary/50',
    ghost: 'text-lumen-secondary hover:bg-lumen-secondary/10 focus:ring-lumen-secondary/50',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      )}
      {children}
    </button>
  );
};

export default Button; 