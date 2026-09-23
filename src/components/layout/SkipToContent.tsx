import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-semibold focus:rounded-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-white"
    >
      Lewati ke Konten Utama (Skip to Content)
    </a>
  );
};
