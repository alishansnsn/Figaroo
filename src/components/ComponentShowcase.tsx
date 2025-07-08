import * as React from 'react';
import { ColorPaletteShowcase } from './ColorPaletteShowcase';
import { ButtonVariantsShowcase } from './ButtonVariantsShowcase';
import { ComponentExampleCard } from './ComponentExampleCard';
import { CalendarCard } from './CalendarCard';
import { MoveGoalCard } from './MoveGoalCard';
import { RevenueCard } from './RevenueCard';
import { SubscriptionsCard } from './SubscriptionsCard';
import { PaymentMethodCard } from './PaymentMethodCard'; // Import the new component
import { CookieSettingsCard } from './CookieSettingsCard'; // Import the cookie settings component

/**
 * ComponentShowcase integrates all showcase sections for display.
 */
export const ComponentShowcase: React.FC = () => (
  <div className="bg-background text-foreground p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
    <ColorPaletteShowcase />
    <ButtonVariantsShowcase />
    <h3 className="text-lg font-semibold mb-2">Component Examples</h3>
    <ComponentExampleCard />
    {/* New cards section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <CalendarCard />
      <MoveGoalCard />
    </div>
    {/* Stat cards section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <RevenueCard />
      <SubscriptionsCard />
    </div>
    {/* Payment Method Form section */}
    <div className="mt-12">
      <h3 className="text-lg font-semibold mb-4">Payment Method Form</h3>
      <PaymentMethodCard />
    </div>
    {/* Cookie Settings section */}
    <div className="mt-12">
      <h3 className="text-lg font-semibold mb-4">Cookie Settings</h3>
      <CookieSettingsCard />
    </div>
  </div>
);

// Usage: <ComponentShowcase /> 