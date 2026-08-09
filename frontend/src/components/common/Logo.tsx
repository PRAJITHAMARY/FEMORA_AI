import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none cursor-pointer group">
      <div className={`${iconSizes[size]} rounded-2xl bg-gradient-to-tr from-[#E8B4B8] via-[#C9B8D9] to-[#F3C6B5] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
        <span role="img" aria-label="Femora Flower" className="transform group-hover:rotate-12 transition-transform">
          🌸
        </span>
      </div>
      {showText && (
        <span className={`font-serif-heading font-semibold ${textSizes[size]} tracking-tight text-[#403A3D]`}>
          Femora
        </span>
      )}
    </div>
  );
};
