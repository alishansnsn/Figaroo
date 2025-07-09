// Component Constants - Centralized configuration for magic numbers and strings
// This file eliminates hardcoded values throughout the codebase

export const COMPONENT_CONSTRAINTS = {
  // Size constraints for generated components
  MIN_WIDTH: 100,
  MIN_HEIGHT: 80,
  MAX_WIDTH: 800,
  MAX_HEIGHT: 600,
  
  // Auto-resize timing
  MEASURE_DELAY: 100,
  
  // AI processing simulation delay
  AI_PROCESSING_DELAY: 2000,
  
  // Z-index values
  CONTEXT_MENU_Z_INDEX: 10000,
  
  // Zoom constraints
  MIN_ZOOM: 10,
  MAX_ZOOM: 200,
  ZOOM_STEP: 10,
  
  // Canvas positioning
  DEFAULT_CANVAS_X: -100,
  DEFAULT_CANVAS_Y: 0,
  
  // Component positioning
  DEFAULT_COMPONENT_X: 100,
  DEFAULT_COMPONENT_Y: 100,
  DEFAULT_COMPONENT_WIDTH: 300,
  DEFAULT_COMPONENT_HEIGHT: 200,
} as const;

export const UI_CONSTANTS = {
  // Modal and popup dimensions
  MODAL_MAX_WIDTH: 400,
  POPUP_MAX_WIDTH: 320,
  CARD_MAX_WIDTH: 300,
  
  // Spacing values
  SMALL_SPACING: 4,
  MEDIUM_SPACING: 8,
  LARGE_SPACING: 12,
  EXTRA_LARGE_SPACING: 24,
  
  // Font sizes
  SMALL_FONT: '14px',
  MEDIUM_FONT: '16px',
  LARGE_FONT: '18px',
  EXTRA_LARGE_FONT: '20px',
  HEADING_FONT: '24px',
  TITLE_FONT: '32px',
  DISPLAY_FONT: '48px',
  
  // Font weights
  LIGHT_WEIGHT: '300',
  NORMAL_WEIGHT: '400',
  MEDIUM_WEIGHT: '500',
  SEMI_BOLD_WEIGHT: '600',
  BOLD_WEIGHT: '700',
  EXTRA_BOLD_WEIGHT: '800',
  BLACK_WEIGHT: '900',
} as const;

export const COLOR_CONSTANTS = {
  // Default colors
  PRIMARY_COLOR: '#667eea',
  SECONDARY_COLOR: '#6b7280',
  SUCCESS_COLOR: '#10b981',
  ERROR_COLOR: '#ef4444',
  WARNING_COLOR: '#f59e0b',
  
  // Text colors
  PRIMARY_TEXT: '#111827',
  SECONDARY_TEXT: '#374151',
  MUTED_TEXT: '#6b7280',
  
  // Background colors
  BACKGROUND: '#ffffff',
  CARD_BACKGROUND: '#ffffff',
  MUTED_BACKGROUND: '#f5f5f5',
  
  // Border colors
  BORDER_COLOR: '#e5e7eb',
  
  // Gradient colors
  GRADIENT_START: '#667eea',
  GRADIENT_END: '#764ba2',
} as const;

export const ANIMATION_CONSTANTS = {
  // Transition durations
  FAST_TRANSITION: '150ms',
  NORMAL_TRANSITION: '200ms',
  SLOW_TRANSITION: '300ms',
  
  // Animation timing functions
  EASE_IN_OUT: 'ease-in-out',
  EASE_OUT: 'ease-out',
  EASE_IN: 'ease-in',
} as const;

export const LAYOUT_CONSTANTS = {
  // Container dimensions
  CONTAINER_WIDTH: 260,
  CONTAINER_HEIGHT: 120,
  
  // Chart dimensions
  CHART_WIDTH: 260,
  CHART_HEIGHT: 100,
  
  // Card dimensions
  CARD_MIN_HEIGHT: 220,
  
  // Border radius
  SMALL_RADIUS: '4px',
  MEDIUM_RADIUS: '8px',
  LARGE_RADIUS: '12px',
  EXTRA_LARGE_RADIUS: '16px',
} as const;

export const MESSAGES = {
  // User feedback messages
  COMPONENT_RENAMED: 'Component renamed successfully',
  COMPONENT_DELETED: 'Component deleted successfully',
  COMPONENT_DUPLICATED: 'Component duplicated successfully',
  PREFERENCES_SAVED: 'Preferences saved successfully',
  
  // Error messages
  RENDER_ERROR: 'Error rendering component',
  GENERATION_ERROR: 'Component generation failed',
  LOAD_ERROR: 'Failed to load data',
  
  // Placeholder text
  EMAIL_PLACEHOLDER: 'Enter your email',
  PASSWORD_PLACEHOLDER: 'Enter your password',
  SEARCH_PLACEHOLDER: 'Search components...',
  
  // Button text
  SAVE_BUTTON: 'Save',
  CANCEL_BUTTON: 'Cancel',
  DELETE_BUTTON: 'Delete',
  DUPLICATE_BUTTON: 'Duplicate',
  RENAME_BUTTON: 'Rename',
  REFRESH_BUTTON: 'Refresh',
  
  // Feature messages
  COMING_SOON: 'This feature is coming soon!',
  AI_PROCESSING: 'Processing with AI...',
} as const; 