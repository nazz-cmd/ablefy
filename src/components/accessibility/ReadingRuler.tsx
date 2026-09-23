import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

export const ReadingRuler: React.FC = () => {
  const { readingRuler, rulerY } = useAccessibility();

  if (!readingRuler) return null;

  return (
    <div
      className="reading-guide-line"
      style={{ top: `${rulerY - 14}px` }}
      aria-hidden="true"
    />
  );
};
