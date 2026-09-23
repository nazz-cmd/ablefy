import React from 'react';

interface AblefyLogoProps {
  className?: string;
  size?: number;
}

export const AblefyLogo: React.FC<AblefyLogoProps> = ({
  className = 'w-8 h-8',
  size = 32,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background Rounded Shield */}
      <rect width="32" height="32" rx="9" fill="#0f172a" />

      {/* Radiant Assistive Accent Halo */}
      <circle cx="16" cy="16" r="13" stroke="#2563eb" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="2 3" />

      {/* Universal Human Head Motif */}
      <circle cx="16" cy="10.5" r="3" fill="#3b82f6" />

      {/* Outstretched Inclusivity Embrace (Universal Accessibility Motif) */}
      <path
        d="M8.5 22.5C9 17.5 12 15.5 16 15.5C20 15.5 23 17.5 23.5 22.5"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Sound & Sensory Wave (Speech & Vision Dual Modality) */}
      <path
        d="M7 14C10.5 12.8 21.5 12.8 25 14"
        stroke="#60a5fa"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};
