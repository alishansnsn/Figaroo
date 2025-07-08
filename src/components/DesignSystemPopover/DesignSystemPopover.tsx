import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Check, Upload, Trash2, Download, ChevronDown, ChevronRight, Sun, Moon, Settings, BarChart3, TrendingUp, Users, Activity, DollarSign, Calendar, CreditCard, Bell, User, Plus, Eye, EyeOff, Palette, Type, Sliders } from 'lucide-react';
import { DesignSystemPopoverProps, DesignSystemTheme, DesignSystemTokens } from './types';
import './DesignSystemPopover.css';
import { getAllThemes, getUserThemes, saveTheme, deleteTheme } from './storage';
import { parseDesignSystemFile } from './parser';
import { createThemeOptions } from './themeLoader';
import { ComponentShowcase } from '../ComponentShowcase'; // Import the showcase

// Common color palette for color picker
const COLOR_PALETTE = [
  '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#6c757d', '#495057', '#343a40', '#212529',
  '#fff3cd', '#ffeeba', '#ffd93d', '#ffcd39', '#ffc107', '#ff8f00', '#ff6f00', '#e65100', '#bf360c', '#8d4e00',
  '#d1ecf1', '#bee5eb', '#85d3e0', '#4fc3d7', '#17a2b8', '#138496', '#117a8b', '#0c525d', '#062c33', '#041f24',
  '#d4edda', '#c3e6cb', '#9fdf9f', '#7dd87f', '#28a745', '#1e7e34', '#155724', '#0f4229', '#0a2e1f', '#051810',
  '#f8d7da', '#f5c6cb', '#f1b0b7', '#ed969e', '#dc3545', '#c82333', '#a71e2a', '#721c24', '#5a1b1f', '#3d1316',
  '#e2e3ff', '#d1d9ff', '#b8c5ff', '#9fa8ff', '#6f42c1', '#59359a', '#4c2a85', '#3c1f6b', '#2d1b69', '#1e1555',
  '#ffeaa7', '#fdcb6e', '#e17055', '#d63031', '#74b9ff', '#0984e3', '#00b894', '#00cec9', '#fd79a8', '#e84393'
];

// Font suggestions for typography inputs
const FONT_SUGGESTIONS = [
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Lato, sans-serif',
  'Montserrat, sans-serif',
  'Poppins, sans-serif',
  'Source Sans Pro, sans-serif',
  'Nunito, sans-serif',
  'Raleway, sans-serif',
  'Work Sans, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Merriweather, serif',
  'Playfair Display, serif',
  'Lora, serif',
  'Crimson Text, serif',
  'Fira Code, monospace',
  'Source Code Pro, monospace',
  'Monaco, monospace',
  'Consolas, monospace',
  'Ubuntu Mono, monospace',
  'Menlo, monospace'
];

// Helper function to convert between color formats
const convertColor = (color: string, format: 'hex' | 'rgb' | 'hsl' | 'oklch' = 'hex'): string => {
  // Basic color format detection and conversion
  if (format === 'hex' && color.startsWith('#')) return color;
  if (format === 'rgb' && color.startsWith('rgb')) return color;
  if (format === 'hsl' && color.startsWith('hsl')) return color;
  if (format === 'oklch' && color.startsWith('oklch')) return color;
  return color; // Return as-is if no conversion needed
};

// Helper function to parse shadow opacity
const parseShadowOpacity = (shadowValue: string): { shadow: string; opacity: number } => {
  const match = shadowValue.match(/hsl\(\s*\d+\s+\d+%\s+\d+%\s*\/\s*([\d.]+)\s*\)/);
  if (match) {
    const opacity = parseFloat(match[1]);
    return { shadow: shadowValue, opacity };
  }
  
  // Try rgba format
  const rgbaMatch = shadowValue.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
  if (rgbaMatch) {
    const opacity = parseFloat(rgbaMatch[1]);
    return { shadow: shadowValue, opacity };
  }
  
  return { shadow: shadowValue, opacity: 1 };
};

// Helper function to update shadow opacity
const updateShadowOpacity = (shadowValue: string, newOpacity: number): string => {
  // Update HSL format
  if (shadowValue.includes('hsl(')) {
    return shadowValue.replace(/hsl\(\s*(\d+)\s+(\d+%)\s+(\d+%)\s*\/\s*[\d.]+\s*\)/g, 
      `hsl($1 $2 $3 / ${newOpacity})`);
  }
  
  // Update RGBA format  
  if (shadowValue.includes('rgba(')) {
    return shadowValue.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/g, 
      `rgba($1,$2,$3,${newOpacity})`);
  }
  
  // If no opacity found, add it
  if (shadowValue.includes('rgb(')) {
    return shadowValue.replace('rgb(', `rgba(`).replace(')', `,${newOpacity})`);
  }
  
  return shadowValue;
};

// Create a comprehensive default theme based on the example
const createDefaultTheme = (): DesignSystemTheme => ({
  name: 'Default',
  tokens: {
    colors: {
      background: 'oklch(0.9856 0.0084 56.3169)',
      foreground: 'oklch(0.3353 0.0132 2.7676)',
      card: 'oklch(1.0000 0 0)',
      'card-foreground': 'oklch(0.3353 0.0132 2.7676)',
      popover: 'oklch(1.0000 0 0)',
      'popover-foreground': 'oklch(0.3353 0.0132 2.7676)',
      primary: 'oklch(0.7357 0.1641 34.7091)',
      'primary-foreground': 'oklch(1.0000 0 0)',
      secondary: 'oklch(0.9596 0.0200 28.9029)',
      'secondary-foreground': 'oklch(0.5587 0.1294 32.7364)',
      muted: 'oklch(0.9656 0.0176 39.4009)',
      'muted-foreground': 'oklch(0.5534 0.0116 58.0708)',
      accent: 'oklch(0.8278 0.1131 57.9984)',
      'accent-foreground': 'oklch(0.3353 0.0132 2.7676)',
      destructive: 'oklch(0.6122 0.2082 22.2410)',
      'destructive-foreground': 'oklch(1.0000 0 0)',
      border: 'oklch(0.9296 0.0370 38.6868)',
      input: 'oklch(0.9296 0.0370 38.6868)',
      ring: 'oklch(0.7357 0.1641 34.7091)',
      'chart-1': 'oklch(0.7357 0.1641 34.7091)',
      'chart-2': 'oklch(0.8278 0.1131 57.9984)',
      'chart-3': 'oklch(0.8773 0.0763 54.9314)',
      'chart-4': 'oklch(0.8200 0.1054 40.8859)',
      'chart-5': 'oklch(0.6368 0.1306 32.0721)'
    },
    typography: {
      'font-sans': 'Inter, sans-serif',
      'font-serif': 'Merriweather, serif',
      'font-mono': 'Fira Code, monospace'
    },
    spacing: {
      radius: '0.625rem',
      spacing: '0.25rem'
    },
    shadows: {
      'shadow-2xs': '0px 6px 12px -3px hsl(0 0% 0% / 0.04)',
      'shadow-xs': '0px 6px 12px -3px hsl(0 0% 0% / 0.04)',
      'shadow-sm': '0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 1px 2px -4px hsl(0 0% 0% / 0.09)',
      shadow: '0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 1px 2px -4px hsl(0 0% 0% / 0.09)',
      'shadow-md': '0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 2px 4px -4px hsl(0 0% 0% / 0.09)',
      'shadow-lg': '0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 4px 6px -4px hsl(0 0% 0% / 0.09)',
      'shadow-xl': '0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 8px 10px -4px hsl(0 0% 0% / 0.09)',
      'shadow-2xl': '0px 6px 12px -3px hsl(0 0% 0% / 0.22)'
    },
    borders: {
      'radius-sm': 'calc(var(--radius) - 4px)',
      'radius-md': 'calc(var(--radius) - 2px)',
      'radius-lg': 'var(--radius)',
      'radius-xl': 'calc(var(--radius) + 4px)'
    }
  },
  raw: {}
});

const darkThemeOverrides = {
  background: 'oklch(0.2569 0.0169 352.4042)',
  foreground: 'oklch(0.9397 0.0119 51.3156)',
  card: 'oklch(0.3184 0.0176 341.4465)',
  'card-foreground': 'oklch(0.9397 0.0119 51.3156)',
  popover: 'oklch(0.3184 0.0176 341.4465)',
  'popover-foreground': 'oklch(0.9397 0.0119 51.3156)',
  primary: 'oklch(0.7640 0.0973 49.6418)',
  secondary: 'oklch(0.3637 0.0203 342.2664)',
  muted: 'oklch(0.3184 0.0176 341.4465)',
  'muted-foreground': 'oklch(0.8378 0.0237 52.6346)',
  border: 'oklch(0.3637 0.0203 342.2664)',
  input: 'oklch(0.3637 0.0203 342.2664)'
};

// Apply theme tokens to CSS variables with enhanced real-time updates
function applyThemeTokens(tokens: DesignSystemTokens, isDark: boolean = false) {
  if (!tokens) return;
  
  const root = document.documentElement;
  
  // Apply color tokens
  Object.entries(tokens.colors).forEach(([key, value]) => {
    const finalValue = isDark && key in darkThemeOverrides ? darkThemeOverrides[key as keyof typeof darkThemeOverrides] : value;
    root.style.setProperty(`--${key}`, finalValue);
  });
  
  // Apply typography tokens
  Object.entries(tokens.typography).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  // Apply spacing tokens
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  // Apply shadow tokens
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  // Apply border tokens
  Object.entries(tokens.borders).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  // Force a style recalculation for immediate visual updates
  requestAnimationFrame(() => {
    // Trigger a reflow to ensure all CSS variable changes are applied immediately
    const preview = document.querySelector('.design-system-popover-enhanced');
    if (preview) {
      const computedStyle = window.getComputedStyle(preview);
      computedStyle.getPropertyValue('opacity'); // Triggers reflow
    }
  });
}

const DesignSystemPopover: React.FC<DesignSystemPopoverProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedSystem
}) => {
  const [themes, setThemes] = useState<DesignSystemTheme[]>([]);
  const [themeOptions, setThemeOptions] = useState<Array<{
    label: string;
    options: Array<{ value: string; label: string; description?: string }>;
  }>>([]);
  const [currentTheme, setCurrentTheme] = useState<DesignSystemTheme | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activePanel, setActivePanel] = useState<'colors' | 'typography' | 'effects'>('colors');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [importError, setImportError] = useState<string | null>(null);
  const [editingTokens, setEditingTokens] = useState<DesignSystemTokens | null>(null);
  const [openColorPickers, setOpenColorPickers] = useState<Set<string>>(new Set());
  const [fontSuggestions, setFontSuggestions] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Load themes and initialize
  useEffect(() => {
    if (isOpen) {
      const loadThemes = async () => {
        try {
          const allThemes = await getAllThemes();
          setThemes(allThemes);
          
          // Create organized theme options
          const options = createThemeOptions(allThemes);
          setThemeOptions(options);
          
          const selected = allThemes.find(t => t.name === selectedSystem) || allThemes[0];
          setCurrentTheme(selected);
          setEditingTokens(selected?.tokens || null);
        } catch (error) {
          console.error('Failed to load themes:', error);
          // Fallback to default theme
          const defaultTheme = createDefaultTheme();
          setThemes([defaultTheme]);
          setThemeOptions([{
            label: 'Default',
            options: [{ value: defaultTheme.name, label: defaultTheme.name }]
          }]);
          setCurrentTheme(defaultTheme);
          setEditingTokens(defaultTheme.tokens);
        }
      };
      
      loadThemes();
    }
  }, [isOpen, selectedSystem]);

  // Apply theme changes in real-time
  useEffect(() => {
    if (editingTokens) {
      applyThemeTokens(editingTokens, isDarkMode);
    }
  }, [editingTokens, isDarkMode]);

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Update token value with immediate preview update
  const updateToken = (category: keyof DesignSystemTokens, token: string, value: string) => {
    if (!editingTokens) return;
    
    const updated = {
      ...editingTokens,
      [category]: {
        ...editingTokens[category],
        [token]: value
      }
    };
    
    setEditingTokens(updated);
    
    // Apply the change immediately to CSS variables
    document.documentElement.style.setProperty(`--${token}`, value);
    
    // Update current theme
    if (currentTheme) {
      const updatedTheme = {
        ...currentTheme,
        tokens: updated
      };
      setCurrentTheme(updatedTheme);
    }
  };

  // Handle theme selection with immediate preview update
  const handleThemeSelect = (themeName: string) => {
    const theme = themes.find(t => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
      setEditingTokens(theme.tokens);
      
      // Apply the new theme immediately
      applyThemeTokens(theme.tokens, isDarkMode);
      
      onSelect(themeName);
    }
  };

  // Toggle section collapse
  const toggleSection = (section: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(section)) {
      newCollapsed.delete(section);
    } else {
      newCollapsed.add(section);
    }
    setCollapsedSections(newCollapsed);
  };

  // Toggle color picker visibility
  const toggleColorPicker = (tokenKey: string) => {
    const newOpen = new Set(openColorPickers);
    if (newOpen.has(tokenKey)) {
      newOpen.delete(tokenKey);
    } else {
      newOpen.add(tokenKey);
    }
    setOpenColorPickers(newOpen);
  };

  // Enhanced Color Picker Component
  const ColorPicker: React.FC<{
    tokenKey: string;
    value: string;
    onChange: (value: string) => void;
  }> = ({ tokenKey, value, onChange }) => {
    const isOpen = openColorPickers.has(tokenKey);
    const [customColor, setCustomColor] = useState(value);

    return (
      <div className="color-picker-container">
        <div className="property-input-group">
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              onChange(e.target.value);
            }}
            className="property-input color-input"
            placeholder="Enter color value (hex, rgb, hsl, oklch)"
          />
          <button
            type="button"
            className="color-picker-trigger"
            onClick={() => toggleColorPicker(tokenKey)}
            style={{ backgroundColor: value }}
            title="Open color picker"
          >
            <Palette size={14} />
          </button>
        </div>
        
        {isOpen && (
          <div className="color-picker-dropdown">
            <div className="color-picker-header">
              <span>Color Palette</span>
              <button
                type="button"
                className="color-picker-close"
                onClick={() => toggleColorPicker(tokenKey)}
              >
                <X size={12} />
              </button>
            </div>
            
            <div className="color-palette-grid">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-swatch ${value === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setCustomColor(color);
                    onChange(color);
                  }}
                  title={color}
                />
              ))}
            </div>
            
            <div className="custom-color-section">
              <label className="custom-color-label">Custom Color</label>
              <div className="custom-color-inputs">
                <input
                  type="color"
                  value={value.startsWith('#') ? value : '#000000'}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    onChange(e.target.value);
                  }}
                  className="color-input-native"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    onChange(e.target.value);
                  }}
                  className="custom-color-text"
                  placeholder="Custom color value"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Enhanced Text Input Component
  const EnhancedTextInput: React.FC<{
    tokenKey: string;
    value: string;
    onChange: (value: string) => void;
    suggestions?: string[];
    icon?: React.ReactNode;
    placeholder?: string;
  }> = ({ tokenKey, value, onChange, suggestions = [], icon, placeholder }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

    useEffect(() => {
      if (suggestions.length > 0 && value) {
        const filtered = suggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 8);
        setFilteredSuggestions(filtered);
      } else {
        setFilteredSuggestions(suggestions.slice(0, 8));
      }
    }, [value, suggestions]);

    return (
      <div className="enhanced-text-input">
        <div className="enhanced-input-group">
          {icon && <span className="input-icon">{icon}</span>}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="enhanced-property-input"
            placeholder={placeholder}
          />
        </div>
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="suggestion-item"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Opacity Slider Component
  const OpacitySlider: React.FC<{
    shadowKey: string;
    shadowValue: string;
    onChange: (value: string) => void;
  }> = ({ shadowKey, shadowValue, onChange }) => {
    const { opacity } = parseShadowOpacity(shadowValue);
    
    const handleOpacityChange = (newOpacity: number) => {
      const updatedShadow = updateShadowOpacity(shadowValue, newOpacity);
      onChange(updatedShadow);
    };

    return (
      <div className="opacity-slider-container">
        <div className="opacity-slider-header">
          <span className="opacity-label">Opacity</span>
          <span className="opacity-value">{Math.round(opacity * 100)}%</span>
        </div>
        <div className="opacity-slider-input">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
            className="opacity-slider"
          />
          <Sliders size={14} className="slider-icon" />
        </div>
      </div>
    );
  };

  // Render property panel
  const renderPropertyPanel = () => {
    if (!editingTokens) return null;

    const renderColorInputs = () => (
      <div className="property-section">
        {Object.entries(editingTokens.colors).map(([key, value]) => (
          <div key={key} className="property-item">
            <label className="property-label">{key}</label>
            <ColorPicker
              tokenKey={key}
              value={value}
              onChange={(newValue) => updateToken('colors', key, newValue)}
            />
          </div>
        ))}
      </div>
    );

    const renderTypographyInputs = () => (
      <div className="property-section">
        {Object.entries(editingTokens.typography).map(([key, value]) => (
          <div key={key} className="property-item">
            <label className="property-label">{key}</label>
            <EnhancedTextInput
              tokenKey={key}
              value={value}
              onChange={(newValue) => updateToken('typography', key, newValue)}
              suggestions={FONT_SUGGESTIONS}
              icon={<Type size={14} />}
              placeholder="Enter font family"
            />
          </div>
        ))}
      </div>
    );

    const renderEffectsInputs = () => (
      <div className="effects-panel">
        {/* Spacing Section */}
        <div className="property-section">
          <div className="section-header" onClick={() => toggleSection('spacing')}>
            <h4>Spacing</h4>
            <ChevronDown 
              size={16} 
              className={`toggle-icon ${collapsedSections.has('spacing') ? 'collapsed' : ''}`}
            />
          </div>
          {!collapsedSections.has('spacing') && (
            <div className="section-content">
              {Object.entries(editingTokens.spacing).map(([key, value]) => (
                <div key={key} className="property-item">
                  <label className="property-label">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateToken('spacing', key, e.target.value)}
                    className="property-input"
                    placeholder="Enter spacing value"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shadows Section */}
        <div className="property-section">
          <div className="section-header" onClick={() => toggleSection('shadows')}>
            <h4>Shadows</h4>
            <ChevronDown 
              size={16} 
              className={`toggle-icon ${collapsedSections.has('shadows') ? 'collapsed' : ''}`}
            />
          </div>
          {!collapsedSections.has('shadows') && (
            <div className="section-content">
              {Object.entries(editingTokens.shadows).map(([key, value]) => (
                <div key={key} className="property-item shadow-property-item">
                  <label className="property-label">{key}</label>
                  <div className="shadow-input-container">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateToken('shadows', key, e.target.value)}
                      className="property-input shadow-text-input"
                      placeholder="Enter shadow value"
                    />
                    <OpacitySlider
                      shadowKey={key}
                      shadowValue={value}
                      onChange={(newValue) => updateToken('shadows', key, newValue)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Borders Section */}
        <div className="property-section">
          <div className="section-header" onClick={() => toggleSection('borders')}>
            <h4>Borders</h4>
            <ChevronDown 
              size={16} 
              className={`toggle-icon ${collapsedSections.has('borders') ? 'collapsed' : ''}`}
            />
          </div>
          {!collapsedSections.has('borders') && (
            <div className="section-content">
              {Object.entries(editingTokens.borders).map(([key, value]) => (
                <div key={key} className="property-item">
                  <label className="property-label">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateToken('borders', key, e.target.value)}
                    className="property-input"
                    placeholder="Enter border value"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div className="property-panel">
        <div className="property-panel-header">
          <h3>Design Tokens</h3>
          <div className="panel-tabs">
            <button
              className={`panel-tab ${activePanel === 'colors' ? 'active' : ''}`}
              onClick={() => setActivePanel('colors')}
            >
              Colors
            </button>
            <button
              className={`panel-tab ${activePanel === 'typography' ? 'active' : ''}`}
              onClick={() => setActivePanel('typography')}
            >
              Typography
            </button>
            <button
              className={`panel-tab ${activePanel === 'effects' ? 'active' : ''}`}
              onClick={() => setActivePanel('effects')}
            >
              Effects
            </button>
          </div>
        </div>
        
        <div className="property-panel-content">
          {activePanel === 'colors' && renderColorInputs()}
          {activePanel === 'typography' && renderTypographyInputs()}
          {activePanel === 'effects' && renderEffectsInputs()}
        </div>
      </div>
    );
  };

  // Render comprehensive preview
  const renderPreview = () => {
    return (
      <div className="preview-panel">
        <div className="preview-content" style={{ overflowY: 'auto', flex: 1 }}>
          <ComponentShowcase />
        </div>
      </div>
    );
  };

  // File import handler with immediate preview update
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const theme = await parseDesignSystemFile(file);
      // Add user category to imported themes
      theme.category = 'user';
      saveTheme(theme);
      
      // Reload all themes
      const allThemes = await getAllThemes();
      setThemes(allThemes);
      
      // Update theme options
      const options = createThemeOptions(allThemes);
      setThemeOptions(options);
      
      setCurrentTheme(theme);
      setEditingTokens(theme.tokens);
      
      // Apply the imported theme immediately
      applyThemeTokens(theme.tokens, isDarkMode);
      
      onSelect(theme.name);
    } catch (err: any) {
      setImportError(err.message || 'Failed to import theme.');
    }
    e.target.value = '';
  };

  // Export handler
  const handleExport = () => {
    if (!currentTheme) return;
    const exportData = {
      ...currentTheme,
      tokens: editingTokens
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTheme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="design-system-popover-overlay">
      <div
        ref={popoverRef}
        className="design-system-popover-enhanced"
        role="dialog"
        aria-labelledby="popover-title"
        aria-modal="true"
      >
        <div className="popover-layout-enhanced">
          {/* Left Panel - Properties */}
          <div className="popover-left-panel-enhanced">
            <div className="popover-header">
              <h2 id="popover-title" className="popover-title">Design System</h2>
              <button
                className="popover-close-btn"
                onClick={onClose}
                aria-label="Close design system editor"
              >
                <X size={18} />
              </button>
            </div>

            <div className="theme-selector-section">
              <div className="theme-selector-header">
                <span>Theme</span>
                <div className="theme-actions">
                  <button
                    className="action-btn"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Import design system"
                  >
                    <Upload size={14} />
                  </button>
                  <button
                    className="action-btn"
                    onClick={handleExport}
                    disabled={!currentTheme}
                    aria-label="Export current theme"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>

              <select 
                className="theme-dropdown"
                value={currentTheme?.name || ''}
                onChange={(e) => handleThemeSelect(e.target.value)}
              >
                {themeOptions.map(group => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map(option => (
                      <option 
                        key={option.value} 
                        value={option.value}
                        title={option.description}
                      >
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.md,.css,application/json,text/markdown,text/css"
                style={{ display: 'none' }}
                onChange={handleImport}
              />
            </div>

            {importError && <div className="import-error">{importError}</div>}

            {renderPropertyPanel()}
          </div>

          {/* Right Panel - Preview */}
          <div className="popover-right-panel-enhanced">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemPopover; 