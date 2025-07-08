import * as React from 'react';

// List of color tokens and their display names
const COLORS = [
  { name: 'Background', className: 'bg-background' },
  { name: 'Foreground', className: 'bg-foreground text-background' },
  { name: 'Primary', className: 'bg-primary' },
  { name: 'Secondary', className: 'bg-secondary' },
  { name: 'Accent', className: 'bg-accent' },
  { name: 'Muted', className: 'bg-muted' },
  { name: 'Destructive', className: 'bg-destructive' },
  { name: 'Border', className: 'bg-border' },
];

/**
 * ColorPaletteShowcase displays a set of color swatches with labels.
 * - Uses Tailwind CSS utility classes for styling.
 */
export const ColorPaletteShowcase: React.FC = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Color Palette</h2>
    <div className="grid grid-cols-4 gap-4 mb-8">
      {COLORS.map((color) => (
        <div
          key={color.name}
          className={`rounded-lg h-20 flex items-center justify-center ${color.className} border border-border`}
        >
          <span className="font-medium">{color.name}</span>
        </div>
      ))}
    </div>
  </div>
);

// Usage: <ColorPaletteShowcase /> 