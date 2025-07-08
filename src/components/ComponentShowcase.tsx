import * as React from 'react';
import { ColorPaletteShowcase } from './ColorPaletteShowcase';
import { ButtonVariantsShowcase } from './ButtonVariantsShowcase';
import { ComponentExampleCard } from './ComponentExampleCard';

/**
 * ComponentShowcase integrates all showcase sections for display.
 */
export const ComponentShowcase: React.FC = () => (
  <div className="bg-background text-foreground p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
    <ColorPaletteShowcase />
    <ButtonVariantsShowcase />
    <h3 className="text-lg font-semibold mb-2">Component Examples</h3>
    <ComponentExampleCard />
  </div>
);

// Usage: <ComponentShowcase /> 