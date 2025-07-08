import * as React from 'react';

/**
 * MoveGoalCard displays a daily activity goal UI with a number input, bar chart, and button.
 * Uses Tailwind CSS and design tokens for styling.
 */
export const MoveGoalCard: React.FC = () => {
  const [goal, setGoal] = React.useState(350);
  // Example bar chart data
  const bars = [7, 5, 4, 6, 8, 7, 6, 5, 7, 4, 6, 8];
  return (
    <div className="bg-card text-foreground rounded-2xl border border-border p-6 w-full max-w-md mx-auto shadow-md flex flex-col items-center">
      <div className="w-full mb-4">
        <div className="text-lg font-semibold mb-1">Move Goal</div>
        <div className="text-muted-foreground mb-4 text-sm">Set your daily activity goal.</div>
      </div>
      <div className="flex items-center justify-center gap-6 mb-2">
        <button
          className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-2xl text-primary hover:bg-accent/20 transition-colors"
          onClick={() => setGoal(g => Math.max(0, g - 10))}
          aria-label="Decrease goal"
        >
          –
        </button>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-extrabold leading-none">{goal}</span>
          <span className="text-muted-foreground text-xs tracking-widest mt-1">CALORIES/DAY</span>
        </div>
        <button
          className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-2xl text-primary hover:bg-accent/20 transition-colors"
          onClick={() => setGoal(g => g + 10)}
          aria-label="Increase goal"
        >
          +
        </button>
      </div>
      {/* Bar chart */}
      <div className="flex items-end gap-2 h-24 w-full justify-center my-4">
        {bars.map((v, i) => (
          <div
            key={i}
            className="bg-primary rounded-md transition-all duration-300"
            style={{ width: 16, height: `${v * 10}px` }}
          />
        ))}
      </div>
      <button className="w-full mt-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors">
        Set Goal
      </button>
    </div>
  );
};

// Usage: <MoveGoalCard /> 