// Component positioning constants
export const COMPONENT_DEFAULTS = {
  INITIAL_POSITION: { x: 100, y: 100 },
  INITIAL_SIZE: { width: 300, height: 200 },
  DUPLICATE_OFFSET: { x: 20, y: 20 },
  MIN_SIZE: { width: 50, height: 50 },
  MAX_SIZE: { width: 800, height: 600 }
} as const;

// Canvas constants
export const CANVAS_DEFAULTS = {
  INITIAL_ZOOM: 80,
  MIN_ZOOM: 10,
  MAX_ZOOM: 200,
  ZOOM_STEP: 10,
  INITIAL_POSITION: { x: -100, y: 0 },
  BACKGROUND_COLOR: '#2B2B2B'
} as const;

// Design system colors
export const DESIGN_SYSTEMS = {
  NONE: {
    name: 'None',
    colors: ['#333333', '#666666', '#999999', '#cccccc']
  },
  OPENAI: {
    name: 'OpenAI',
    colors: ['#10A37F', '#1A7F64', '#0D8B73', '#087F5B']
  },
  CLAUDE: {
    name: 'Claude',
    colors: ['#D2691E', '#CD853F', '#DEB887', '#8B4513']
  },
  BRUTALISM: {
    name: 'Brutalism',
    colors: ['#FF0000', '#FFFF00', '#0000FF', '#FF6B35']
  },
  AIRBNB: {
    name: 'Airbnb',
    colors: ['#FF5A5F', '#00A699', '#FC642D', '#484848']
  },
  TWITTER: {
    name: 'Twitter',
    colors: ['#1DA1F2', '#14171A', '#657786', '#AAB8C2']
  },
  RAMP: {
    name: 'Ramp',
    colors: ['#FFFF00', '#00FF00', '#FF0000', '#0000FF']
  },
  MATERIAL: {
    name: 'Material',
    colors: ['#6200EE', '#03DAC6', '#CF6679', '#018786']
  },
  DEFAULT: {
    name: 'Default',
    colors: ['#2196F3', '#4CAF50', '#FF9800', '#F44336']
  }
} as const;

// Toast durations
export const TOAST_DURATIONS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000
} as const;

// API configuration
export const API_CONFIG = {
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
  REQUEST_TIMEOUT: 30000,
  MAX_RETRIES: 3
} as const;

// Export all component constants
export * from './componentConstants'; 