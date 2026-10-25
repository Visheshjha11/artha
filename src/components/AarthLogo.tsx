import React from 'react';

// Stylized chunky geometric logo matching the aesthetic of sure.am
export const ArthaWordmark: React.FC<{ className?: string; height?: number }> = ({ 
  className = "h-7", 
}) => {
  return (
    <div className={`flex items-center gap-1 select-none font-black tracking-tighter text-2xl md:text-[26px] text-gray-950 uppercase ${className}`}>
      <span className="relative flex items-center font-extrabold tracking-[-0.07em] lowercase text-[28px] text-gray-900 hover:text-black transition-colors">
        artha
        <span className="w-1.5 h-1.5 rounded-full bg-[#5b9347] inline-block ml-0.5 mb-1 animate-pulse"></span>
      </span>
    </div>
  );
};

// Distinctive stacked geometric emblem mark for Artha matching Image 1
export const ArthaEmblem: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-28 h-28", 
}) => {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Top AR stylized block in slate-gray & forest green */}
        <g>
          {/* 'A' */}
          <path 
            d="M 15 62 L 42 10 L 68 62 L 50 62 L 42 44 L 32 62 Z" 
            fill="#525866" 
          />
          {/* 'R' in top row */}
          <path 
            d="M 78 10 H 122 C 136 10 144 18 144 28 C 144 38 136 44 124 46 L 144 62 H 122 L 108 48 H 98 V 62 H 78 V 10 Z M 98 22 V 34 H 120 C 124 34 126 32 126 28 C 126 24 124 22 120 22 H 98 Z" 
            fill="#525866" 
          />
        </g>

        {/* Bottom THA bold green sliced characters */}
        <g>
          {/* 'T' */}
          <path 
            d="M 15 74 H 56 V 88 H 44 V 130 H 27 V 88 H 15 V 74 Z" 
            fill="#5b9347" 
          />
          {/* 'H' */}
          <path 
            d="M 62 74 H 78 V 95 H 94 V 74 H 110 V 130 H 94 V 108 H 78 V 130 H 62 V 74 Z" 
            fill="#5b9347" 
          />
          {/* 'A' */}
          <path 
            d="M 116 130 L 136 74 L 156 130 H 142 L 136 112 L 128 130 H 116 Z" 
            fill="#5b9347" 
          />
          {/* Signature round cutout element inside the letter shape */}
          <ellipse cx="106" cy="28" rx="4" ry="2.5" fill="#F9F9F9" />
          <line x1="15" y1="102" x2="68" y2="102" stroke="#F9F9F9" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};

// Compact Artha icon for sidebar and badges
export const ArthaIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="32" height="32" rx="8" fill="#5b9347" />
      <path d="M 8 23 L 14 9 L 20 23 H 16.5 L 14 17 H 11.5 L 9.8 23 H 8 Z" fill="white" />
      <path d="M 17 23 L 21 14 L 25 23 H 22.8 L 21 19 H 19 L 18 23 H 17 Z" fill="white" opacity="0.85" />
      <circle cx="21" cy="9" r="2" fill="#dcfce7" />
    </svg>
  );
};

export const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
};

// Backward-compatible aliases
export const AarthWordmark = ArthaWordmark;
export const AarthEmblem = ArthaEmblem;
export const AarthIcon = ArthaIcon;
