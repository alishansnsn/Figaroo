import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

// Button variants for styling
const VARIANT_CLASSES: Record<string, string> = {
  primary: 'bg-primary text-foreground border border-transparent hover:bg-primary/90',
  secondary: 'bg-secondary text-foreground border border-transparent hover:bg-secondary/80',
  outline: 'bg-transparent text-foreground border border-border hover:bg-muted',
  ghost: 'bg-transparent text-foreground border border-transparent hover:bg-muted',
  destructive: 'bg-destructive text-foreground border border-transparent hover:bg-destructive/80',
};

// Button props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  asChild?: boolean; // For Radix Slot support
}

/**
 * Button component using Radix UI Slot and Tailwind CSS.
 * - Use the 'variant' prop to select style.
 * - Use 'asChild' to render as a different element (advanced).
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', asChild = false, className = '', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={`px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
          VARIANT_CLASSES[variant]
        } ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

// Usage: <Button variant="primary">Primary</Button> 