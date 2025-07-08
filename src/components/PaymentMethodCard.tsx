import React, { useState } from 'react';
import { CreditCard, Apple } from 'lucide-react';

// Payment method options (Paypal uses CreditCard icon as placeholder)
const paymentMethods = [
  { key: 'card', label: 'Card', icon: <CreditCard size={28} /> },
  { key: 'paypal', label: 'Paypal', icon: <CreditCard size={28} /> }, // No Paypal icon in lucide-react
  { key: 'apple', label: 'Apple', icon: <Apple size={28} /> },
];

/**
 * PaymentMethodCard - A payment method form that follows the design system tokens.
 * All colors, spacing, borders, and fonts use CSS variables set by the active theme.
 * This is a demo component - interactions are simulated, not functional.
 */
export const PaymentMethodCard: React.FC = () => {
  const [selected, setSelected] = useState('card');
  // Form state (demo only - not functional to avoid breaking showcase)
  const [form, setForm] = useState({
    name: 'First Last',
    card: '',
    month: '',
    year: '',
    cvc: '',
  });

  // Handle demo interactions (safe for showcase)
  const handleTabSelect = (key: string) => {
    setSelected(key);
  };

  // Handle input changes (demo only)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Prevent form submission in showcase
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No actual submission - just demo
  };

  return (
    <div
      className="p-8 rounded-2xl shadow-lg border max-w-xl mx-auto"
      style={{ 
        fontFamily: 'var(--font-sans, sans-serif)',
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius, 0.5rem)',
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 
          className="text-xl font-bold mb-2" 
          style={{ color: 'var(--card-foreground)' }}
        >
          Payment Method
        </h2>
        <p 
          className="text-sm" 
          style={{ color: 'var(--muted-foreground)' }}
        >
          Add a new payment method to your account.
        </p>
      </div>

      {/* Payment method tabs */}
      <div className="flex gap-4 mb-8">
        {paymentMethods.map((m) => (
          <button
            key={m.key}
            type="button"
            aria-pressed={selected === m.key}
            onClick={() => handleTabSelect(m.key)}
            className="flex flex-col items-center justify-center flex-1 p-6 border transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === m.key ? 'var(--ring)' : 'var(--border)',
              backgroundColor: selected === m.key ? 'var(--accent)' : 'var(--card)',
              color: selected === m.key ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
              boxShadow: selected === m.key ? '0 0 0 2px var(--ring)' : 'none',
              borderRadius: 'var(--radius, 0.5rem)',
              fontFamily: 'var(--font-sans, sans-serif)',
            }}
            onMouseEnter={(e) => {
              if (selected !== m.key) {
                e.currentTarget.style.borderColor = 'var(--muted-foreground)';
                e.currentTarget.style.backgroundColor = 'var(--muted)';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== m.key) {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.backgroundColor = 'var(--card)';
              }
            }}
          >
            <span className="mb-2">{m.icon}</span>
            <span className="font-medium text-base">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Card form (only show for Card) */}
      {selected === 'card' && (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex flex-col">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium mb-2" 
              style={{ color: 'var(--card-foreground)' }}
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="cc-name"
              placeholder="First Last"
              className="w-full px-3 py-2 border transition-colors duration-200"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                borderRadius: 'var(--radius, 0.5rem)',
                fontFamily: 'var(--font-sans, sans-serif)',
              }}
              value={form.name}
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--ring)';
                e.target.style.boxShadow = '0 0 0 2px var(--ring)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Card number */}
          <div className="flex flex-col">
            <label 
              htmlFor="card" 
              className="block text-sm font-medium mb-2" 
              style={{ color: 'var(--card-foreground)' }}
            >
              Card number
            </label>
            <input
              id="card"
              name="card"
              type="text"
              autoComplete="cc-number"
              placeholder=""
              className="w-full px-3 py-2 border transition-colors duration-200"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                borderRadius: 'var(--radius, 0.5rem)',
                fontFamily: 'var(--font-sans, sans-serif)',
              }}
              value={form.card}
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--ring)';
                e.target.style.boxShadow = '0 0 0 2px var(--ring)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label 
                htmlFor="month" 
                className="block text-sm font-medium mb-2" 
                style={{ color: 'var(--card-foreground)' }}
              >
                Expires
              </label>
              <select
                id="month"
                name="month"
                className="w-full px-3 py-2 border transition-colors duration-200 cursor-pointer"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  borderRadius: 'var(--radius, 0.5rem)',
                  fontFamily: 'var(--font-sans, sans-serif)',
                }}
                value={form.month}
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--ring)';
                  e.target.style.boxShadow = '0 0 0 2px var(--ring)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Month</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col">
              <label 
                htmlFor="year" 
                className="block text-sm font-medium mb-2" 
                style={{ color: 'var(--card-foreground)' }}
              >
                Year
              </label>
              <select
                id="year"
                name="year"
                className="w-full px-3 py-2 border transition-colors duration-200 cursor-pointer"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  borderRadius: 'var(--radius, 0.5rem)',
                  fontFamily: 'var(--font-sans, sans-serif)',
                }}
                value={form.year}
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--ring)';
                  e.target.style.boxShadow = '0 0 0 2px var(--ring)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Year</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year}>{year}</option>
                  );
                })}
              </select>
            </div>

            <div className="flex flex-col">
              <label 
                htmlFor="cvc" 
                className="block text-sm font-medium mb-2" 
                style={{ color: 'var(--card-foreground)' }}
              >
                CVC
              </label>
              <input
                id="cvc"
                name="cvc"
                type="text"
                autoComplete="cc-csc"
                placeholder="CVC"
                className="w-full px-3 py-2 border transition-colors duration-200"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  borderRadius: 'var(--radius, 0.5rem)',
                  fontFamily: 'var(--font-sans, sans-serif)',
                }}
                value={form.cvc}
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--ring)';
                  e.target.style.boxShadow = '0 0 0 2px var(--ring)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Continue button */}
          <button
            type="submit"
            className="w-full py-3 font-semibold transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: 'var(--foreground)',
              color: 'var(--background)',
              border: 'none',
              borderRadius: 'var(--radius, 0.5rem)',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '1rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--muted-foreground)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--foreground)';
            }}
          >
            Continue
          </button>
        </form>
      )}
    </div>
  );
};

// Usage: <PaymentMethodCard /> 