import React, { useState, useRef, useCallback, useEffect } from 'react';
import './Canvas.css';
import { Sparkles, Package, Settings, Upload, Plus, Minus, Menu } from 'lucide-react';
import ComponentModal from './ComponentModal';
import GeneratedComponent from './GeneratedComponent';
import DesignSystemPopover from './DesignSystemPopover';
import SettingsModal from './SettingsModal';
import InspectorPanel from './InspectorPanel';
import { aiService } from '../services/aiService';
import { userService } from '../services/userService';
import { ErrorHandler } from '../utils/errorHandler';

interface CanvasProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const [zoom, setZoom] = useState(80);
  const [canvasPosition, setCanvasPosition] = useState({ x: -100, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [canvasColor, setCanvasColor] = useState('#2B2B2B');
  const [showDots, setShowDots] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [showComponentDropdown, setShowComponentDropdown] = useState(false);
  const [showDesignSystemPopover, setShowDesignSystemPopover] = useState(false);
  const [selectedDesignSystem, setSelectedDesignSystem] = useState('None');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInspectorPanel, setShowInspectorPanel] = useState(false);
  const [components, setComponents] = useState<Array<{
    id: string;
    code: string;
    name?: string;
    prompt: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    autoResize?: boolean;
  }>>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [editModeComponentId, setEditModeComponentId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [designSystem, setDesignSystem] = useState('No design system');
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 10));
  };

  const toggleColorPicker = () => {
    setShowColorPicker(prev => !prev);
  };

  const toggleDots = () => {
    setShowDots(prev => !prev);
  };

  const handleAddComponent = () => {
    setShowComponentModal(true);
  };

  // Handle edit mode toggle
  const handleEditMode = (componentId: string, isEditMode: boolean) => {
    if (isEditMode) {
      setEditModeComponentId(componentId);
      setShowInspectorPanel(true);
      setSelectedElement(null);
    } else {
      setEditModeComponentId(null);
      setShowInspectorPanel(false);
      setSelectedElement(null);
    }
  };

  // Handle element selection in edit mode
  const handleElementSelect = (elementInfo: any) => {
    setSelectedElement(elementInfo);
  };

  // Handle element updates from inspector
  const handleElementUpdate = (updates: any) => {
    if (!editModeComponentId || !selectedElement) return;

    // Find the component being edited
    const component = components.find(comp => comp.id === editModeComponentId);
    if (!component) return;

    // Create a temporary DOM element to manipulate the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = component.code;

    // Find the selected element in the temporary DOM
    const elements = tempDiv.querySelectorAll('*');
    let targetElement: HTMLElement | null = null;

    // Find matching element by comparing properties
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i] as HTMLElement;
      if (el.tagName.toLowerCase() === selectedElement.tagName &&
          el.textContent === selectedElement.textContent) {
        targetElement = el;
        break;
      }
    }

    if (targetElement) {
      // Apply updates
      if (updates.textContent !== undefined) {
        targetElement.textContent = updates.textContent;
      }
      
      if (updates.styles) {
        Object.keys(updates.styles).forEach(property => {
          const value = updates.styles[property];
          targetElement!.style.setProperty(property, value);
        });
      }

      // Update the component code
      const updatedCode = tempDiv.innerHTML;
      setComponents(prev => prev.map(comp => 
        comp.id === editModeComponentId 
          ? { ...comp, code: updatedCode }
          : comp
      ));

      // Update selected element info
      setSelectedElement({
        ...selectedElement,
        textContent: updates.textContent || selectedElement.textContent,
        styles: { ...selectedElement.styles, ...updates.styles }
      });
    }
  };

  const generateComponentCode = async (prompt: string): Promise<string> => {
    // Simulate AI generation with example components
    const exampleComponents = {
      'sign in card': `
        <div style="
          max-width: 400px;
          padding: 32px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
        ">
          <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600; color: #111827;">Welcome back</h2>
          <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px;">Sign in to your account to continue</p>
          <form>
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #374151;">Email</label>
              <input type="email" placeholder="Enter your email" style="
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 14px;
                outline: none;
                box-sizing: border-box;
              " />
            </div>
            <div style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #374151;">Password</label>
              <input type="password" placeholder="Enter your password" style="
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 14px;
                outline: none;
                box-sizing: border-box;
              " />
            </div>
            <button type="submit" style="
              width: 100%;
              padding: 12px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              margin-bottom: 16px;
            ">Sign In</button>
          </form>
          <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
            Don't have an account? <a href="#" style="color: #3b82f6; text-decoration: none;">Sign up</a>
          </p>
        </div>
      `,
      'pricing card': `
        <div style="
          max-width: 320px;
          padding: 32px 24px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border: 2px solid #e5e7eb;
          text-align: center;
        ">
          <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #111827;">Pro Plan</h3>
          <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px;">Perfect for growing teams</p>
          <div style="margin-bottom: 24px;">
            <span style="font-size: 48px; font-weight: 700; color: #111827;">$29</span>
            <span style="color: #6b7280; font-size: 16px;">/month</span>
          </div>
          <ul style="list-style: none; padding: 0; margin: 0 0 32px 0; text-align: left;">
            <li style="padding: 8px 0; color: #374151; font-size: 14px;">✓ Unlimited projects</li>
            <li style="padding: 8px 0; color: #374151; font-size: 14px;">✓ Advanced analytics</li>
            <li style="padding: 8px 0; color: #374151; font-size: 14px;">✓ Priority support</li>
            <li style="padding: 8px 0; color: #374151; font-size: 14px;">✓ Custom integrations</li>
          </ul>
          <button style="
            width: 100%;
            padding: 12px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
          ">Get Started</button>
        </div>
      `,
      'music player card': `
        <div style="
          width: 320px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 24px;
          color: white;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        ">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="
              width: 120px;
              height: 120px;
              background: rgba(255,255,255,0.2);
              border-radius: 16px;
              margin: 0 auto 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 48px;
            ">🎵</div>
            <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600;">Bohemian Rhapsody</h3>
            <p style="margin: 0; opacity: 0.8; font-size: 14px;">Queen</p>
          </div>
          <div style="margin-bottom: 20px;">
            <div style="height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; margin-bottom: 8px;">
              <div style="width: 60%; height: 100%; background: white; border-radius: 2px;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; opacity: 0.8;">
              <span>2:45</span>
              <span>5:55</span>
            </div>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; gap: 20px;">
            <button style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">⏮️</button>
            <button style="
              background: white;
              border: none;
              color: #667eea;
              width: 48px;
              height: 48px;
              border-radius: 50%;
              font-size: 16px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
            ">▶️</button>
            <button style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">⏭️</button>
          </div>
        </div>
      `
    };

    // Return example component or default
    const normalizedPrompt = prompt.toLowerCase();
    for (const [key, code] of Object.entries(exampleComponents)) {
      if (normalizedPrompt.includes(key.split(' ')[0])) {
        return code;
      }
    }

    // Default component
    return `
      <div style="
        padding: 24px;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        border: 1px solid #e5e7eb;
        max-width: 300px;
      ">
        <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 18px; font-weight: 600;">Generated Component</h3>
        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
          This component was generated from: "${prompt}"
        </p>
      </div>
    `;
  };

  // Generate a meaningful component name from prompt
  const generateComponentName = (prompt: string): string => {
    const cleanPrompt = prompt.trim();
    // Capitalize first letter and limit length
    return cleanPrompt.charAt(0).toUpperCase() + cleanPrompt.slice(1, 50) + (cleanPrompt.length > 50 ? '...' : '');
  };

  const handleGenerateComponent = async (prompt: string) => {
    // Check usage limits
    const usageCheck = userService.canGenerateComponent();
    if (!usageCheck.allowed) {
      ErrorHandler.showWarning('Usage Limit', usageCheck.reason);
      return;
    }

    try {
      // Get user settings for AI service
      const userSettings = userService.getUserSettings();
      
      // Generate component using AI service
      const generationRequest = {
        prompt,
        designSystem: designSystem !== 'No design system' ? designSystem : undefined,
        userTier: {
          type: userSettings.tier,
          apiKey: userSettings.apiKey
        }
      };

      const response = await aiService.generateComponent(generationRequest);
      
      // Combine HTML and CSS into a single code string
      const code = `${response.html}\n<style>\n${response.css}\n</style>`;
      
      // Increment usage counter
      userService.incrementUsage();
      
      if (editingComponent) {
        // Update existing component
        setComponents(prev => prev.map(comp => 
          comp.id === editingComponent 
            ? { ...comp, code, prompt, name: generateComponentName(prompt), autoResize: false }
            : comp
        ));
        setEditingComponent(null);
      } else {
        // Create new component
        const newComponent = {
          id: Date.now().toString(),
          code,
          name: generateComponentName(prompt),
          prompt,
          position: { x: 100, y: 100 },
          size: { width: 300, height: 200 },
          autoResize: true
        };
        setComponents(prev => [...prev, newComponent]);
        setSelectedComponentId(newComponent.id);
      }
    } catch (error) {
      ErrorHandler.handleError(error as Error, 'component generation');
    }
  };

  const handleEditComponent = (componentId: string) => {
    setEditingComponent(componentId);
    setSelectedComponentId(componentId);
    setShowComponentModal(true);
  };

  const handleDeleteComponent = (componentId: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== componentId));
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  };

  const handleDuplicateComponent = (componentId: string) => {
    const component = components.find(comp => comp.id === componentId);
    if (component) {
      const newComponent = {
        ...component,
        id: Date.now().toString(),
        position: { 
          x: component.position.x + 20, 
          y: component.position.y + 20 
        },
        autoResize: false // Disable auto-resize for duplicated components
      };
      setComponents(prev => [...prev, newComponent]);
      setSelectedComponentId(newComponent.id);
    }
  };

  const handleSelectComponent = (id: string) => {
    setSelectedComponentId(id);
  };

  const handleMoveComponent = (id: string, x: number, y: number) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, position: { x, y } } : comp
    ));
  };

  const handleResizeComponent = (id: string, width: number, height: number) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, size: { width, height } } : comp
    ));
  };

  const handleRenameComponent = (id: string, newName: string) => {
    // Component renamed: ${id} to ${newName}
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, name: newName } : comp
    ));
  };

  // Deselect component when clicking on canvas
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === e.currentTarget) {
      setSelectedComponentId(null);
      setShowComponentDropdown(false);
    }
  };

  // Handle double-click to open component modal
  const handleCanvasDoubleClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === e.currentTarget) {
      setShowComponentModal(true);
    }
  };

  const handleColorChange = (color: string) => {
    setCanvasColor(color);
  };

  const handleGradientClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Convert position to HSV and then to hex
    const hue = x * 360;
    const saturation = 1 - y;
    const value = 1;
    
    const hex = hsvToHex(hue, saturation, value);
    setCanvasColor(hex);
  };

  const handleHueClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const hue = x * 360;
    
    const hex = hsvToHex(hue, 1, 1);
    setCanvasColor(hex);
  };

  // Convert HSV to Hex
  const hsvToHex = (h: number, s: number, v: number): string => {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showColorPicker]);

  // Handle space key for dragging
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        setIsDragging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpacePressed]);

  // Handle mouse events for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isSpacePressed) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - canvasPosition.x, y: e.clientY - canvasPosition.y };
    }
  }, [isSpacePressed, canvasPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && isSpacePressed) {
      setCanvasPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  }, [isDragging, isSpacePressed]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div 
      className={`canvas ${isSpacePressed ? 'space-pressed' : ''}`}
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
      onDoubleClick={handleCanvasDoubleClick}
      style={{ 
        backgroundColor: canvasColor,
        backgroundImage: showDots ? `
          radial-gradient(circle at 25% 25%, ${canvasColor === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, ${canvasColor === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} 1px, transparent 1px)
        ` : 'none',
        backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
        backgroundPosition: `${canvasPosition.x % (20 * (zoom / 100))}px ${canvasPosition.y % (20 * (zoom / 100))}px, ${(canvasPosition.x + 10 * (zoom / 100)) % (20 * (zoom / 100))}px ${(canvasPosition.y + 10 * (zoom / 100)) % (20 * (zoom / 100))}px`,
        marginRight: showInspectorPanel ? '350px' : '0',
        transition: 'margin-right 0.3s ease'
      }}
    >
      <div 
        className="canvas-content"
        style={{
          transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${zoom / 100})`
        }}
      >
        {components.length === 0 && (
          <div className="placeholder-message">
            <Sparkles className="sparkle-icon" size={16} />
            <span>Double-click anywhere to create a new component or click the + button</span>
          </div>
        )}

        {/* Render Generated Components within the transformed space */}
        {components.map(component => (
          <GeneratedComponent
            key={component.id}
            id={component.id}
            code={component.code}
            name={component.name}
            prompt={component.prompt}
            position={component.position}
            size={component.size}
            isSelected={selectedComponentId === component.id}
            isEditMode={component.id === editModeComponentId}
            onSelect={handleSelectComponent}
            onMove={handleMoveComponent}
            onResize={handleResizeComponent}
            onEdit={handleEditComponent}
            onDelete={handleDeleteComponent}
            onDuplicate={handleDuplicateComponent}
            onEditMode={handleEditMode}
            onElementSelect={handleElementSelect}
            onRename={handleRenameComponent}
            autoResize={component.autoResize}
          />
        ))}
      </div>

      {/* Top Left Controls */}
      <div className="control-group top-left">
        <button 
          className="sidebar-toggle-btn" 
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
        >
          <Menu size={16} />
        </button>
        <div className="components-dropdown" onClick={() => setShowComponentDropdown(!showComponentDropdown)}>
          <Package size={16} />
          <span>{selectedComponentId ? components.find(c => c.id === selectedComponentId)?.name || `Component ${components.findIndex(c => c.id === selectedComponentId) + 1}` : 'Components'}</span>
          <span className="dropdown-arrow">▼</span>
          
          {showComponentDropdown && (
            <div className="dropdown-menu">
              {components.length === 0 ? (
                <div className="dropdown-item disabled">No components</div>
              ) : (
                components.map((component, index) => (
                  <div 
                    key={component.id}
                    className={`dropdown-item ${selectedComponentId === component.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectComponent(component.id);
                      setShowComponentDropdown(false);
                    }}
                  >
                    {component.name || `Component ${index + 1}`}
                  </div>
                ))
              )}
              <div className="dropdown-divider" />
              <div 
                className="dropdown-item" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComponentModal(true);
                  setShowComponentDropdown(false);
                }}
              >
                + Add Component
              </div>
            </div>
          )}
        </div>
        <button className="design-system-btn" onClick={() => setShowDesignSystemPopover(true)}>
          <Settings size={16} />
          <span>Design System</span>
        </button>
      </div>

      {/* Top Right Controls */}
      <div className="control-group top-right">
        <button className="share-btn">
          <Upload size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* Bottom Left Controls */}
      <div className="control-group bottom-left">
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={handleZoomOut}>
            <Minus size={16} />
          </button>
          <span className="zoom-level">{zoom}%</span>
          <button className="zoom-btn" onClick={handleZoomIn}>
            <Plus size={16} />
          </button>
        </div>
        <div className="color-picker-container" ref={colorPickerRef}>
          <button 
            className="canvas-color-btn" 
            onClick={toggleColorPicker} 
            title="Canvas Settings" 
            style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: `conic-gradient(from 0deg, ${canvasColor} 0%, ${canvasColor} 100%)`,
              border: '2px solid #fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '200%',
              background: canvasColor,
              border: '2px solid rgb(40, 40, 40)',
              boxSizing: 'border-box'
            }} />
          </button>
          {showColorPicker && (
            <div className="color-picker-panel">
              <div className="color-gradient" onClick={handleGradientClick}>
                <div className="gradient-overlay"></div>
                <div className="color-selector" style={{ 
                  left: '20px', 
                  top: '20px',
                  borderColor: canvasColor === '#ffffff' ? '#000' : '#fff'
                }}></div>
              </div>
              <div className="color-bar" onClick={handleHueClick}>
                <div className="hue-slider"></div>
              </div>
              <div className="hex-input-container">
                <div className="color-preview" style={{ backgroundColor: canvasColor }}></div>
                <input 
                  type="text" 
                  className="hex-input" 
                  value={canvasColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="#2B2B2B"
                />
              </div>
              <div className="dotted-texture-control">
                <span>Dotted Texture</span>
                <button 
                  className={`toggle-switch ${showDots ? 'active' : ''}`}
                  onClick={toggleDots}
                >
                  <div className="toggle-slider"></div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Right Controls */}
      <div className="control-group bottom-right">
        <button className="add-component-btn" onClick={handleAddComponent} title="Generate Component">
          <Plus size={20} />
        </button>
      </div>

      {/* Component Generation Modal */}
            <ComponentModal
        isOpen={showComponentModal}
        onClose={() => {
          setShowComponentModal(false);
          setEditingComponent(null);
        }}
        onGenerate={handleGenerateComponent}
        editingComponent={editingComponent ? {
          id: editingComponent,
          prompt: components.find(c => c.id === editingComponent)?.prompt || ''
        } : null}
        selectedDesignSystem={selectedDesignSystem}
        onDesignSystemChange={setSelectedDesignSystem}
      />

      {/* Design System Popover */}
      <DesignSystemPopover
        isOpen={showDesignSystemPopover}
        onClose={() => setShowDesignSystemPopover(false)}
        onSelect={setSelectedDesignSystem}
        selectedSystem={selectedDesignSystem}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Inspector Panel */}
      <InspectorPanel
        isOpen={showInspectorPanel}
        onClose={() => setShowInspectorPanel(false)}
        selectedElement={selectedElement}
        onUpdateElement={handleElementUpdate}
      />
    </div>
  );
};

export default Canvas; 