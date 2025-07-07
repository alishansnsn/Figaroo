import React, { useState } from 'react';
import './DesignSystemModal.css';
import { X, Download, Upload, Plus, Trash2 } from 'lucide-react';

interface DesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DesignSystemModal: React.FC<DesignSystemModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('colors');
  const [colors, setColors] = useState([
    { name: 'Primary', value: '#3b82f6' },
    { name: 'Secondary', value: '#6b7280' },
    { name: 'Success', value: '#10b981' },
    { name: 'Warning', value: '#f59e0b' },
    { name: 'Error', value: '#ef4444' }
  ]);

  const [typography, setTypography] = useState([
    { name: 'Heading 1', size: '32px', weight: '700' },
    { name: 'Heading 2', size: '24px', weight: '600' },
    { name: 'Body', size: '16px', weight: '400' },
    { name: 'Caption', size: '14px', weight: '400' }
  ]);

  const addColor = () => {
    setColors([...colors, { name: 'New Color', value: '#000000' }]);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, field: 'name' | 'value', value: string) => {
    setColors(colors.map((color, i) => 
      i === index ? { ...color, [field]: value } : color
    ));
  };

  const exportDesignSystem = () => {
    const designSystem = {
      colors,
      typography,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(designSystem, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-system.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="design-system-overlay">
      <div className="design-system-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Design System</h2>
          <div className="header-actions">
            <button className="export-btn" onClick={exportDesignSystem}>
              <Download size={16} />
              Export
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'colors' ? 'active' : ''}`}
            onClick={() => setActiveTab('colors')}
          >
            Colors
          </button>
          <button 
            className={`tab ${activeTab === 'typography' ? 'active' : ''}`}
            onClick={() => setActiveTab('typography')}
          >
            Typography
          </button>
          <button 
            className={`tab ${activeTab === 'components' ? 'active' : ''}`}
            onClick={() => setActiveTab('components')}
          >
            Components
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {activeTab === 'colors' && (
            <div className="colors-section">
              <div className="section-header">
                <h3>Color Palette</h3>
                <button className="add-btn" onClick={addColor}>
                  <Plus size={16} />
                  Add Color
                </button>
              </div>
              
              <div className="colors-grid">
                {colors.map((color, index) => (
                  <div key={index} className="color-item">
                    <div className="color-preview" style={{ backgroundColor: color.value }}></div>
                    <div className="color-details">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => updateColor(index, 'name', e.target.value)}
                        className="color-name"
                      />
                      <input
                        type="text"
                        value={color.value}
                        onChange={(e) => updateColor(index, 'value', e.target.value)}
                        className="color-value"
                      />
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeColor(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="typography-section">
              <div className="section-header">
                <h3>Typography Scale</h3>
              </div>
              
              <div className="typography-list">
                {typography.map((typo, index) => (
                  <div key={index} className="typography-item">
                    <div className="typography-preview" style={{ 
                      fontSize: typo.size, 
                      fontWeight: typo.weight 
                    }}>
                      {typo.name}
                    </div>
                    <div className="typography-details">
                      <span>{typo.size}</span>
                      <span>Weight: {typo.weight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div className="components-section">
              <div className="section-header">
                <h3>Component Styles</h3>
              </div>
              
              <div className="component-styles">
                <div className="style-category">
                  <h4>Buttons</h4>
                  <div className="style-options">
                    <div className="style-option">
                      <div className="style-preview">
                        <button className="preview-btn primary">Primary</button>
                      </div>
                      <span>Primary Button</span>
                    </div>
                    <div className="style-option">
                      <div className="style-preview">
                        <button className="preview-btn secondary">Secondary</button>
                      </div>
                      <span>Secondary Button</span>
                    </div>
                  </div>
                </div>

                <div className="style-category">
                  <h4>Inputs</h4>
                  <div className="style-options">
                    <div className="style-option">
                      <div className="style-preview">
                        <input className="preview-input" placeholder="Input field" />
                      </div>
                      <span>Text Input</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignSystemModal;