import * as React from 'react';

/**
 * SubscriptionsCard displays subscriptions, percent change, a 'View More' link, and a line chart.
 * Uses Tailwind CSS and design tokens for styling.
 */
export const SubscriptionsCard: React.FC = () => {
  // Example chart data (normalized to 0-100 for SVG)
  const points = [10, 80, 30, 90, 20, 70, 10, 15, 10, 20, 15, 10];
  const width = 260;
  const height = 60;
  const paddingX = 12; // horizontal padding for the chart
  const paddingY = 8;  // vertical padding for the chart
  const step = (width - 2 * paddingX) / (points.length - 1);
  const chartPoints = points
    .map((p, i) => `${paddingX + i * step},${height - paddingY - (p / 100) * (height - 2 * paddingY)}`)
    .join(' ');

  return (
    <div className="bg-card text-foreground rounded-2xl border border-border p-6 w-full max-w-md mx-auto shadow-md flex flex-col justify-between min-h-[220px]">
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-base mb-1">Subscriptions</div>
        <button className="text-primary font-semibold text-base hover:underline hover:text-primary/90 transition-colors">
          View More
        </button>
      </div>
      <div className="text-4xl font-extrabold mb-1">+2,350</div>
      <div className="text-muted-foreground text-sm mb-2">+180.1% from last month</div>
      <svg width={width} height={height} className="mt-2" viewBox={`0 0 ${width} ${height}`} fill="none">
        <polyline
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={chartPoints}
        />
      </svg>
    </div>
  );
};

// Usage: <SubscriptionsCard /> 