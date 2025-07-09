import * as React from 'react';

/**
 * RevenueCard displays total revenue, percent change, and a line chart with dots.
 * Uses Tailwind CSS and design tokens for styling.
 */
export const RevenueCard: React.FC = () => {
  // Example chart data (normalized to 0-100 for SVG)
  const points = [20, 40, 32, 30, 40];
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
      <div>
        <div className="text-muted-foreground text-base mb-1">Total Revenue</div>
        <div className="text-4xl font-extrabold mb-1">$15,231.89</div>
        <div className="text-muted-foreground text-sm mb-2">+20.1% from last month</div>
      </div>
      <svg width={width} height={height} className="mt-2" viewBox={`0 0 ${width} ${height}`} fill="none">
        <polyline
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={chartPoints}
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={paddingX + (i * step)}
            cy={height - paddingY - (p / 100) * (height - 2 * paddingY)}
            r={4}
            fill="var(--primary)"
            stroke="var(--primary)"
            strokeWidth="1.5"
          />
        ))}
      </svg>
    </div>
  );
};

// Usage: <RevenueCard /> 