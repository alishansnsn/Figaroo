import * as React from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';

/**
 * ComponentExampleCard displays a sample 'Create an account' form using Card, Input, and Button components.
 */
export const ComponentExampleCard: React.FC = () => (
  <Card className="max-w-md mx-auto">
    <h4 className="text-foreground text-lg font-bold mb-2">Create an account</h4>
    <p className="text-secondary mb-4">Enter your email below to create your account</p>
    <Input type="email" placeholder="Email" className="mb-4" />
    <div className="flex gap-2">
      <Button className="flex-1" variant="primary">Github</Button>
      <Button className="flex-1" variant="outline">Google</Button>
    </div>
  </Card>
);

// Usage: <ComponentExampleCard /> 