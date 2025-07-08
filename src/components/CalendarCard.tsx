import * as React from 'react';

/**
 * CalendarCard displays a styled calendar for June 2025 with interactive range selection.
 * Days have hover, click, select, and unselect styles.
 * Uses Tailwind CSS and design tokens for styling.
 */
export const CalendarCard: React.FC = () => {
  // Calendar grid for June 2025
  const days = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, '', '', '', '', '']
  ];

  // State for selected range (start and end day as {row, col})
  const [range, setRange] = React.useState<{ start: [number, number] | null; end: [number, number] | null }>({ start: null, end: null });

  // Helper to flatten day position to a single index for easy comparison
  const dayIndex = (row: number, col: number) => row * 7 + col;

  // Handle day click for range selection
  const handleDayClick = (row: number, col: number, day: number | string) => {
    if (day === '') return;
    if (!range.start || (range.start && range.end)) {
      setRange({ start: [row, col], end: null });
    } else {
      // If already have a start, set end (or reset if clicked before start)
      const startIdx = dayIndex(...range.start);
      const endIdx = dayIndex(row, col);
      if (endIdx < startIdx) {
        setRange({ start: [row, col], end: range.start });
      } else if (endIdx === startIdx) {
        setRange({ start: null, end: null }); // Unselect if same day
      } else {
        setRange({ start: range.start, end: [row, col] });
      }
    }
  };

  // Check if a day is in the selected range
  const isSelected = (row: number, col: number) => {
    if (!range.start) return false;
    const startIdx = dayIndex(...range.start);
    const endIdx = range.end ? dayIndex(...range.end) : startIdx;
    const idx = dayIndex(row, col);
    return idx >= Math.min(startIdx, endIdx) && idx <= Math.max(startIdx, endIdx);
  };

  // Check if a day is the start or end of the range
  const isRangeEdge = (row: number, col: number) => {
    if (!range.start) return false;
    const startIdx = dayIndex(...range.start);
    const endIdx = range.end ? dayIndex(...range.end) : startIdx;
    const idx = dayIndex(row, col);
    return idx === startIdx || idx === endIdx;
  };

  // Track hovered day for hover effect
  const [hovered, setHovered] = React.useState<[number, number] | null>(null);

  return (
    <div className="bg-card text-foreground rounded-2xl border border-border p-6 w-full max-w-md mx-auto shadow-md">
      <div className="flex items-center justify-between mb-4">
        <button className="text-2xl px-2 text-muted-foreground">&#60;</button>
        <span className="text-lg font-semibold">June 2025</span>
        <button className="text-2xl px-2 text-muted-foreground">&#62;</button>
      </div>
      <div className="grid grid-cols-7 text-center text-muted-foreground mb-2">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <span key={d} className="font-medium text-sm">{d}</span>
        ))}
      </div>
      <div className="grid grid-rows-5 gap-1">
        {days.map((week, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-7 gap-1">
            {week.map((day, colIdx) => {
              const selected = isSelected(rowIdx, colIdx);
              const edge = isRangeEdge(rowIdx, colIdx);
              const isHovered = hovered && hovered[0] === rowIdx && hovered[1] === colIdx;
              return (
                <button
                  key={colIdx}
                  type="button"
                  disabled={day === ''}
                  className={
                    `h-9 w-9 flex items-center justify-center rounded-lg text-base font-medium transition-colors outline-none ` +
                    (day === '' ? 'cursor-default' : 'cursor-pointer') +
                    (selected
                      ? ` bg-muted text-foreground ${edge ? 'ring-2 ring-primary ring-offset-2' : ''}`
                      :
                        isHovered
                          ? ' bg-muted-foreground/20 text-foreground'
                          : ' hover:bg-muted-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary')
                  }
                  onClick={() => handleDayClick(rowIdx, colIdx, day)}
                  onMouseEnter={() => setHovered([rowIdx, colIdx])}
                  onMouseLeave={() => setHovered(null)}
                  aria-pressed={selected}
                >
                  {day}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// Usage: <CalendarCard /> 