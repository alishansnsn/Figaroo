import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  asChild?: boolean; // For Radix Slot support
}

/**
 * Input component using Radix UI Slot and Tailwind CSS.
 * - Use 'asChild' to render as a different element (advanced).
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ asChild = false, className = '', ...props }, ref) => {
    const Comp = asChild ? Slot : 'input';
    return (
      <Comp
        ref={ref}
        className={`w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

// Usage: <Input placeholder="Email" /> 