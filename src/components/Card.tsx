import * as React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Card component for grouping content visually.
 * - Adds padding, background, border, and rounded corners using Tailwind CSS.
 */
export const Card: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div
    className={`bg-muted border border-border rounded-xl p-6 shadow-sm ${className}`}
    {...props}
  />
);

// Usage: <Card>...</Card> 