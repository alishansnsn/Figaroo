import React from 'react';
import { COMPONENT_CONSTRAINTS } from '../../constants';

interface ComponentResizeHandlesProps {
  isSelected: boolean;
  isEditMode: boolean;
  size: { width: number; height: number };
  onResizeStart: (direction: string, e: React.MouseEvent) => void;
}

export const ComponentResizeHandles: React.FC<ComponentResizeHandlesProps> = ({
  isSelected,
  isEditMode,
  size,
  onResizeStart,
}) => {
  if (!isSelected || isEditMode) return null;

  const handleSize = 8;
  const handleOffset = handleSize / 2;

  return (
    <>
      {/* Corner resize handles */}
      <div
        className="resize-handle resize-handle-nw"
        style={{
          position: 'absolute',
          top: -handleOffset,
          left: -handleOffset,
          width: handleSize,
          height: handleSize,
          cursor: 'nw-resize',
          backgroundColor: 'var(--primary)',
          border: '1px solid var(--background)',
          borderRadius: '50%',
          zIndex: 1000,
        }}
        onMouseDown={(e) => onResizeStart('nw', e)}
      />
      <div
        className="resize-handle resize-handle-ne"
        style={{
          position: 'absolute',
          top: -handleOffset,
          right: -handleOffset,
          width: handleSize,
          height: handleSize,
          cursor: 'ne-resize',
          backgroundColor: 'var(--primary)',
          border: '1px solid var(--background)',
          borderRadius: '50%',
          zIndex: 1000,
        }}
        onMouseDown={(e) => onResizeStart('ne', e)}
      />
      <div
        className="resize-handle resize-handle-sw"
        style={{
          position: 'absolute',
          bottom: -handleOffset,
          left: -handleOffset,
          width: handleSize,
          height: handleSize,
          cursor: 'sw-resize',
          backgroundColor: 'var(--primary)',
          border: '1px solid var(--background)',
          borderRadius: '50%',
          zIndex: 1000,
        }}
        onMouseDown={(e) => onResizeStart('sw', e)}
      />
      <div
        className="resize-handle resize-handle-se"
        style={{
          position: 'absolute',
          bottom: -handleOffset,
          right: -handleOffset,
          width: handleSize,
          height: handleSize,
          cursor: 'se-resize',
          backgroundColor: 'var(--primary)',
          border: '1px solid var(--background)',
          borderRadius: '50%',
          zIndex: 1000,
        }}
        onMouseDown={(e) => onResizeStart('se', e)}
      />

      {/* Edge resize handles */}
      <div
        className="resize-handle resize-handle-n"
        style={{
          position: 'absolute',
          top: -handleOffset,
          left: '50%',
          transform: 'translateX(-50%)',
          width: handleSize,
          height: handleSize,
          cursor: 'n-resize',
          backgroundColor: 'var(--primary)',
          border: '1px solid var(--background)',
          borderRadius: '50%',
          zIndex: 1000,
        }}
        onMouseDown={(e) => onResizeStart('n', e)}
      />
      <div
        className="resize-handle resize-handle-s"
        style={{
          position: 'absolute',
          bottom: -handleOffset,
          left: '50%',
          transform: 'translateX(-50%)',
          width: handleSize,
          height: handleSize,
          cursor: 's-resize',
          backgroundColor: 'var(--primary)',
          border: '1px solid var(--background)',
          borderRadius: '50%',
          zIndex: 1000,
        }}
        onMouseDown={(e) => onResizeStart('s', e)}
      />
      <div
        className="resize-handle resize-handle-w"
        style={{
          position: 'absolute',
          top: '50%',
          left: -handleOffset,
          transform: 'translateY(-50%)',
          width: handleSize,
          height: handleSize,
          cursor: 'w-resize',
          backgroundColor: 'var(--primary)',
          border: '1px solid var(--background)',
          borderRadius: '50%',
          zIndex: 1000,
        }}
        onMouseDown={(e) => onResizeStart('w', e)}
      />
      <div
        className="resize-handle resize-handle-e"
        style={{
          position: 'absolute',
          top: '50%',
          right: -handleOffset,
          transform: 'translateY(-50%)',
          width: handleSize,
          height: handleSize,
          cursor: 'e-resize',
          backgroundColor: 'var(--primary)',
          border: '1px solid var(--background)',
          borderRadius: '50%',
          zIndex: 1000,
        }}
        onMouseDown={(e) => onResizeStart('e', e)}
      />
    </>
  );
}; 