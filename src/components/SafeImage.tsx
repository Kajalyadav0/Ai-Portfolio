import React, { useState } from 'react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle: string;
  fallbackSubtitle?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  fallbackSubtitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || !src.trim() || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F2F0EB] border border-[#E5E2DC] text-center p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-10 h-10 mb-3 rounded-lg bg-[#E5E2DC]/80 flex items-center justify-center text-[#1E3A5F]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[#27272A] max-w-xs">{fallbackTitle}</p>
        {fallbackSubtitle && (
          <p className="mt-1 text-xs text-[#71717A] max-w-xs">{fallbackSubtitle}</p>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
