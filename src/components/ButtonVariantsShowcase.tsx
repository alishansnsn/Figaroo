import * as React from 'react';
import { Button } from './Button';

/**
 * ButtonVariantsShowcase displays all button variants using the custom Button component.
 */
export const ButtonVariantsShowcase: React.FC = () => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Button Variants</h3>
    <div className="flex gap-3 mb-8 flex-wrap">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  </div>
);

// Usage: <ButtonVariantsShowcase /> 