import React from 'react';

interface PatternDividerProps {
  className?: string;
  variant?: 'islamic' | 'geometric' | 'simple';
}

export const PatternDivider: React.FC<PatternDividerProps> = ({ 
  className = '', 
  variant = 'islamic' 
}) => {
  if (variant === 'simple') {
    return <div className={`divider-islamic ${className}`} />;
  }

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        {variant === 'islamic' ? (
          <div className="relative">
            <div className="w-6 h-6 border-2 border-accent rotate-45 bg-gradient-to-br from-accent/20 to-primary/20" />
            <div className="absolute inset-1 w-4 h-4 border border-secondary/30 rotate-45" />
          </div>
        ) : (
          <div className="flex space-x-2 rtl:space-x-reverse">
            <div className="w-2 h-2 bg-accent rounded-full" />
            <div className="w-2 h-2 bg-primary rounded-full" />
            <div className="w-2 h-2 bg-secondary rounded-full" />
          </div>
        )}
        
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
    </div>
  );
};