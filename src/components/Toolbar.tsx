import React, { useState } from 'react';
import './Toolbar.css';
import { Plus, Minus, Grid3x3, MoreHorizontal } from 'lucide-react';

const Toolbar: React.FC = () => {
  const [zoom, setZoom] = useState(37);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 10));
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="add-component-btn" title="Add Component">
          <Plus size={18} />
        </button>
      </div>
      
      <div className="toolbar-center">
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={handleZoomOut}>
            <Minus size={16} />
          </button>
          <span className="zoom-level">{zoom}%</span>
          <button className="zoom-btn" onClick={handleZoomIn}>
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      <div className="toolbar-right">
        <button className="tool-btn" title="Grid">
          <Grid3x3 size={16} />
        </button>
        <button className="tool-btn" title="More options">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar; 