import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import './DesignSystemPanel.css';

interface DesignSystemPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (designSystem: string) => void;
  selectedSystem: string;
}

// Design system data matching the image
const designSystems = [
  {
    name: 'None',
    colors: ['#333333', '#666666', '#999999', '#cccccc']
  },
  {
    name: 'OpenAI',
    colors: ['#10A37F', '#1A7F64', '#0D8B73', '#087F5B']
  },
  {
    name: 'Claude',
    colors: ['#D2691E', '#CD853F', '#DEB887', '#8B4513']
  },
  {
    name: 'Brutalism',
    colors: ['#FF0000', '#FFFF00', '#0000FF', '#FF6B35']
  },
  {
    name: 'Airbnb',
    colors: ['#FF5A5F', '#00A699', '#FC642D', '#484848']
  },
  {
    name: 'Twitter',
    colors: ['#1DA1F2', '#14171A', '#657786', '#AAB8C2']
  },
  {
    name: 'Ramp',
    colors: ['#FFFF00', '#00FF00', '#FF0000', '#0000FF']
  },
  {
    name: 'Material',
    colors: ['#6200EE', '#03DAC6', '#CF6679', '#018786']
  },
  {
    name: 'Default',
    colors: ['#2196F3', '#4CAF50', '#FF9800', '#F44336']
  }
];

const DesignSystemPanel: React.FC<DesignSystemPanelProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedSystem 
}) => {
  const [hoveredSystem, setHoveredSystem] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="design-system-panel-overlay">
      <div className="design-system-panel">
        {/* Header */}
        <div className="panel-header">
          <h3>Design Systems</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Systems List */}
        <div className="systems-container">
          {designSystems.map((system, index) => (
            <div
              key={system.name}
              className={`system-item ${selectedSystem === system.name ? 'selected' : ''}`}
              onClick={() => onSelect(system.name)}
              onMouseEnter={() => setHoveredSystem(system.name)}
              onMouseLeave={() => setHoveredSystem(null)}
            >
              <div className="system-info">
                <span className="system-name">{system.name}</span>
                {system.name === 'None' && (
                  <span className="system-subtitle">Public Design Systems</span>
                )}
              </div>
              <div className="color-palette">
                {system.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="color-dot"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="panel-footer">
          <div className="manage-systems">
            <Settings size={16} />
            <span>Manage design systems</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemPanel; 