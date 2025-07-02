import React, { useState, useEffect } from 'react';
import './InspectorPanel.css';
import { X, Type, Palette, Layout, Box, Move3D, Settings } from 'lucide-react';

interface ElementInfo {
  tagName: string;
  textContent: string;
  className: string;
  id: string;
  styles: {
    color: string;
    backgroundColor: string;
    fontSize: string;
    fontWeight: string;
    margin: string;
    padding: string;
    borderRadius: string;
    width: string;
    height: string;
  };
  innerHTML: string;
}

interface InspectorPanelProps {
  isOpen: boolean;
  selectedElement: ElementInfo | null;
  onClose: () => void;
  onUpdateElement?: (updates: any) => void;
}

const InspectorPanel: React.FC<InspectorPanelProps> = ({
  isOpen,
  selectedElement,
  onClose,
  onUpdateElement
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [editedContent, setEditedContent] = useState('');
  const [editedStyles, setEditedStyles] = useState<any>({});

  // Update local state when selectedElement changes
  useEffect(() => {
    if (selectedElement) {
      setEditedContent(selectedElement.textContent || '');
      setEditedStyles({
        color: selectedElement.styles.color,
        backgroundColor: selectedElement.styles.backgroundColor,
        fontSize: selectedElement.styles.fontSize,
        fontWeight: selectedElement.styles.fontWeight,
        margin: selectedElement.styles.margin,
        padding: selectedElement.styles.padding,
        borderRadius: selectedElement.styles.borderRadius,
        width: selectedElement.styles.width,
        height: selectedElement.styles.height,
      });
    }
  }, [selectedElement]);

  const handleContentChange = (value: string) => {
    setEditedContent(value);
    onUpdateElement && onUpdateElement({ textContent: value });
  };

  const handleStyleChange = (property: string, value: string) => {
    const newStyles = { ...editedStyles, [property]: value };
    setEditedStyles(newStyles);
    onUpdateElement && onUpdateElement({ styles: { [property]: value } });
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (rgb: string) => {
    const match = rgb.match(/\d+/g);
    if (!match) return '#000000';
    return '#' + ((1 << 24) + (parseInt(match[0]) << 16) + (parseInt(match[1]) << 8) + parseInt(match[2])).toString(16).slice(1);
  };

  if (!isOpen) return null;

  return (
    <div className="inspector-panel">
      {/* Header */}
      <div className="inspector-header">
        <div className="inspector-title">
          <Settings size={18} />
          <span>Inspector</span>
        </div>
        <button className="close-inspector" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="inspector-content">
        {selectedElement ? (
          <>
            {/* Element Info */}
            <div className="element-info">
              <div className="element-tag">
                <span className="tag-name">&lt;{selectedElement.tagName}&gt;</span>
                {selectedElement.className && (
                  <span className="class-name">.{selectedElement.className}</span>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="inspector-tabs">
              <button 
                className={`tab ${activeTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveTab('content')}
              >
                <Type size={16} />
                Content
              </button>
              <button 
                className={`tab ${activeTab === 'style' ? 'active' : ''}`}
                onClick={() => setActiveTab('style')}
              >
                <Palette size={16} />
                Style
              </button>
              <button 
                className={`tab ${activeTab === 'layout' ? 'active' : ''}`}
                onClick={() => setActiveTab('layout')}
              >
                <Layout size={16} />
                Layout
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'content' && (
                <div className="content-panel">
                  <div className="property-group">
                    <label>Text Content</label>
                    <textarea
                      value={editedContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="Enter text content..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="property-group">
                    <label>Element ID</label>
                    <input
                      type="text"
                      value={selectedElement.id}
                      placeholder="No ID set"
                      disabled
                    />
                  </div>

                  <div className="property-group">
                    <label>CSS Classes</label>
                    <input
                      type="text"
                      value={selectedElement.className}
                      placeholder="No classes"
                      disabled
                    />
                  </div>
                </div>
              )}

              {activeTab === 'style' && (
                <div className="style-panel">
                  <div className="property-group">
                    <label>Text Color</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={rgbToHex(editedStyles.color)}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                      />
                      <input
                        type="text"
                        value={editedStyles.color}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        placeholder="rgb(0, 0, 0)"
                      />
                    </div>
                  </div>

                  <div className="property-group">
                    <label>Background Color</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={rgbToHex(editedStyles.backgroundColor)}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      />
                      <input
                        type="text"
                        value={editedStyles.backgroundColor}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        placeholder="transparent"
                      />
                    </div>
                  </div>

                  <div className="property-group">
                    <label>Font Size</label>
                    <div className="input-with-unit">
                      <input
                        type="text"
                        value={editedStyles.fontSize}
                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                        placeholder="16px"
                      />
                    </div>
                  </div>

                  <div className="property-group">
                    <label>Font Weight</label>
                    <select
                      value={editedStyles.fontWeight}
                      onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                    >
                      <option value="100">Thin (100)</option>
                      <option value="200">Extra Light (200)</option>
                      <option value="300">Light (300)</option>
                      <option value="400">Normal (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semi Bold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">Extra Bold (800)</option>
                      <option value="900">Black (900)</option>
                    </select>
                  </div>

                  <div className="property-group">
                    <label>Border Radius</label>
                    <input
                      type="text"
                      value={editedStyles.borderRadius}
                      onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                      placeholder="0px"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'layout' && (
                <div className="layout-panel">
                  <div className="spacing-section">
                    <h4><Box size={16} /> Spacing</h4>
                    
                    <div className="property-group">
                      <label>Margin</label>
                      <input
                        type="text"
                        value={editedStyles.margin}
                        onChange={(e) => handleStyleChange('margin', e.target.value)}
                        placeholder="0px"
                      />
                    </div>

                    <div className="property-group">
                      <label>Padding</label>
                      <input
                        type="text"
                        value={editedStyles.padding}
                        onChange={(e) => handleStyleChange('padding', e.target.value)}
                        placeholder="0px"
                      />
                    </div>
                  </div>

                  <div className="size-section">
                    <h4><Move3D size={16} /> Dimensions</h4>
                    
                    <div className="property-group">
                      <label>Width</label>
                      <input
                        type="text"
                        value={editedStyles.width}
                        onChange={(e) => handleStyleChange('width', e.target.value)}
                        placeholder="auto"
                      />
                    </div>

                    <div className="property-group">
                      <label>Height</label>
                      <input
                        type="text"
                        value={editedStyles.height}
                        onChange={(e) => handleStyleChange('height', e.target.value)}
                        placeholder="auto"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="no-selection">
            <div className="no-selection-icon">🎯</div>
            <h3>No Element Selected</h3>
            <p>Click on an element in edit mode to see its properties and make changes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectorPanel; 