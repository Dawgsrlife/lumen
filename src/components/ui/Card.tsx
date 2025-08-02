import React from 'react';
import type { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  onClick,
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md border border-gray-100 transition-all duration-200';
  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-lg hover:border-lumen-primary/20' : '';
  const classes = `${baseClasses} ${interactiveClasses} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      {(title || subtitle) && (
        <div className="p-6 pb-0">
          {title && (
            <h3 className="text-xl font-semibold text-lumen-dark mb-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-gray-600 text-sm">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={title || subtitle ? 'p-6 pt-4' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card; 