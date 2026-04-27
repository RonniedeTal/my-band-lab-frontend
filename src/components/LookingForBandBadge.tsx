import React, { useState } from 'react';
import { Music, Users, Guitar } from 'lucide-react';

interface LookingForBandBadgeProps {
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LookingForBandBadge: React.FC<LookingForBandBadgeProps> = ({
  showTooltip = true,
  size = 'md',
}) => {
  const [showTooltipText, setShowTooltipText] = useState(false);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltipText(true)}
      onMouseLeave={() => setShowTooltipText(false)}
    >
      <div
        className={`
        bg-gradient-to-r from-green-500/20 to-emerald-500/20 
        border border-green-500/40 rounded-full 
        flex items-center 
        ${sizeClasses[size]}
      `}
      >
        <Guitar className={`${iconSizes[size]} text-green-400`} />
        <span className="text -green-400 font-medium">Busca proyecto</span>
      </div>

      {showTooltip && showTooltipText && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10 shadow-lg border border-gray-700">
          Este músico busca formar una banda
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};
