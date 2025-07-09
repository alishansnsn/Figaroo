import React, { useState } from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

/**
 * Custom Toggle Switch component that follows design system tokens.
 * All colors and styles use CSS variables set by the active theme.
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  enabled, 
  onChange, 
  disabled = false, 
  'aria-label': ariaLabel 
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      disabled={disabled}
      className="relative inline-flex items-center transition-all duration-200 cursor-pointer"
      style={{
        width: '48px',
        height: '24px',
        backgroundColor: enabled 
          ? (disabled ? 'var(--primary)' : 'var(--primary)') 
          : 'var(--muted)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        opacity: disabled ? 0.8 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onClick={() => !disabled && onChange(!enabled)}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = enabled 
            ? 'var(--primary)' 
            : 'var(--muted-foreground)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = enabled 
          ? 'var(--primary)' 
          : 'var(--muted)';
      }}
    >
      <div
        className="absolute rounded-full transition-transform duration-200 shadow-sm"
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: 'var(--background)',
          border: '1px solid var(--border)',
          transform: enabled ? 'translateX(24px)' : 'translateX(2px)',
          top: '1px',
        }}
      />
    </button>
  );
};

/**
 * CookieSettingsCard - A cookie preferences interface that follows the design system tokens.
 * All colors, spacing, borders, and fonts use CSS variables set by the active theme.
 * This is a demo component - toggles are functional but no actual cookie management occurs.
 */
export const CookieSettingsCard: React.FC = () => {
  // State for cookie preferences (demo only - not actually managing cookies)
  const [functionalCookies, setFunctionalCookies] = useState(false);
  const strictlyNecessary = true; // Always enabled, as shown in screenshot

  // Handle save action (demo only)
  const handleSave = () => {
    // In a real app, this would save cookie preferences
    // Cookie preferences saved: { strictlyNecessary, functionalCookies }
  };

  return (
    <div
      className="p-8 border max-w-lg mx-auto"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius, 0.5rem)',
        fontFamily: 'var(--font-sans, sans-serif)',
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <h2 
          className="text-xl font-bold mb-3" 
          style={{ color: 'var(--card-foreground)' }}
        >
          Cookie Settings
        </h2>
        <p 
          className="text-sm leading-relaxed" 
          style={{ color: 'var(--muted-foreground)' }}
        >
          Manage your cookie settings here.
        </p>
      </div>

      {/* Cookie Categories */}
      <div className="space-y-8 mb-8">
        {/* Strictly Necessary */}
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-4">
            <h3 
              className="text-base font-semibold mb-2" 
              style={{ color: 'var(--card-foreground)' }}
            >
              Strictly Necessary
            </h3>
            <p 
              className="text-sm leading-relaxed" 
              style={{ color: 'var(--muted-foreground)' }}
            >
              These cookies are essential in order to use the website and use its features.
            </p>
          </div>
          <div className="flex-shrink-0">
            <ToggleSwitch
              enabled={strictlyNecessary}
              onChange={() => {}} // No-op since it's always enabled
              disabled={true}
              aria-label="Strictly necessary cookies (always enabled)"
            />
          </div>
        </div>

        {/* Functional Cookies */}
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-4">
            <h3 
              className="text-base font-semibold mb-2" 
              style={{ color: 'var(--card-foreground)' }}
            >
              Functional Cookies
            </h3>
            <p 
              className="text-sm leading-relaxed" 
              style={{ color: 'var(--muted-foreground)' }}
            >
              These cookies allow the website to provide personalized functionality.
            </p>
          </div>
          <div className="flex-shrink-0">
            <ToggleSwitch
              enabled={functionalCookies}
              onChange={setFunctionalCookies}
              aria-label="Functional cookies toggle"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full py-3 px-4 font-medium transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius, 0.5rem)',
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: '1rem',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--muted)';
          e.currentTarget.style.borderColor = 'var(--muted-foreground)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--card)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        Save preferences
      </button>
    </div>
  );
};

// Usage: <CookieSettingsCard /> 