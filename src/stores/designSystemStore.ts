import { create } from 'zustand';
import { DesignSystemTheme, DesignSystemTokens } from '../components/DesignSystemPopover/types';
import { getAllThemes, saveTheme, deleteTheme } from '../components/DesignSystemPopover/storage';

// Design system state interface
interface DesignSystemState {
  // Current design system selection
  selectedDesignSystem: string;
  currentTheme: DesignSystemTheme | null;
  
  // Theme management
  themes: DesignSystemTheme[];
  themeOptions: Array<{
    label: string;
    options: Array<{ value: string; label: string; description?: string }>;
  }>;
  
  // UI state for design system components
  isDarkMode: boolean;
  activePanel: 'colors' | 'typography' | 'effects';
  collapsedSections: Set<string>;
  openColorPickers: Set<string>;
  fontSuggestions: Record<string, boolean>;
  
  // Actions
  // Selection actions
  setSelectedDesignSystem: (system: string) => void;
  setCurrentTheme: (theme: DesignSystemTheme | null) => void;
  
  // Theme management actions
  loadThemes: () => Promise<void>;
  saveCurrentTheme: () => void;
  deleteTheme: (name: string) => void;
  createTheme: (theme: DesignSystemTheme) => void;
  
  // UI actions
  setIsDarkMode: (isDark: boolean) => void;
  setActivePanel: (panel: 'colors' | 'typography' | 'effects') => void;
  toggleSection: (section: string) => void;
  toggleColorPicker: (tokenKey: string) => void;
  setFontSuggestions: (suggestions: Record<string, boolean>) => void;
  
  // Token update actions
  updateToken: (category: keyof DesignSystemTokens, token: string, value: string) => void;
  applyThemeTokens: (tokens: DesignSystemTokens, isDark?: boolean) => void;
  
  // Utility actions
  resetToDefault: () => void;
  exportCurrentTheme: () => void;
  importTheme: (themeData: any) => void;
}

// Create the design system store
export const useDesignSystemStore = create<DesignSystemState>((set, get) => ({
  // Initial state
  selectedDesignSystem: 'None',
  currentTheme: null,
  themes: [],
  themeOptions: [],
  isDarkMode: false,
  activePanel: 'colors',
  collapsedSections: new Set(),
  openColorPickers: new Set(),
  fontSuggestions: {},
  
  // Selection actions
  setSelectedDesignSystem: (system: string) => {
    set({ selectedDesignSystem: system });
    
    // Find and set the corresponding theme
    const { themes } = get();
    const theme = themes.find(t => t.name === system);
    if (theme) {
      get().setCurrentTheme(theme);
    }
  },
  
  setCurrentTheme: (theme: DesignSystemTheme | null) => {
    set({ currentTheme: theme });
    
    // Apply theme tokens if theme exists
    if (theme) {
      get().applyThemeTokens(theme.tokens, get().isDarkMode);
    }
  },
  
  // Theme management actions
  loadThemes: async () => {
    try {
      const themes = await getAllThemes();
      set({ themes });
      
      // Create theme options for organization
      const options = createThemeOptions(themes);
      set({ themeOptions: options });
      
      // Set default theme if none selected
      const { selectedDesignSystem } = get();
      if (selectedDesignSystem === 'None' && themes.length > 0) {
        get().setSelectedDesignSystem(themes[0].name);
      }
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  },
  
  saveCurrentTheme: () => {
    const { currentTheme } = get();
    if (currentTheme) {
      saveTheme(currentTheme);
      // Reload themes to update the list
      get().loadThemes();
    }
  },
  
  deleteTheme: (name: string) => {
    deleteTheme(name);
    // Reload themes to update the list
    get().loadThemes();
    
    // If deleted theme was selected, reset to default
    const { selectedDesignSystem } = get();
    if (selectedDesignSystem === name) {
      get().setSelectedDesignSystem('None');
    }
  },
  
  createTheme: (theme: DesignSystemTheme) => {
    saveTheme(theme);
    // Reload themes to update the list
    get().loadThemes();
  },
  
  // UI actions
  setIsDarkMode: (isDark: boolean) => {
    set({ isDarkMode: isDark });
    
    // Re-apply current theme with new mode
    const { currentTheme } = get();
    if (currentTheme) {
      get().applyThemeTokens(currentTheme.tokens, isDark);
    }
  },
  
  setActivePanel: (panel: 'colors' | 'typography' | 'effects') => {
    set({ activePanel: panel });
  },
  
  toggleSection: (section: string) => {
    const { collapsedSections } = get();
    const newCollapsed = new Set(collapsedSections);
    
    if (newCollapsed.has(section)) {
      newCollapsed.delete(section);
    } else {
      newCollapsed.add(section);
    }
    
    set({ collapsedSections: newCollapsed });
  },
  
  toggleColorPicker: (tokenKey: string) => {
    const { openColorPickers } = get();
    const newOpen = new Set(openColorPickers);
    
    if (newOpen.has(tokenKey)) {
      newOpen.delete(tokenKey);
    } else {
      newOpen.add(tokenKey);
    }
    
    set({ openColorPickers: newOpen });
  },
  
  setFontSuggestions: (suggestions: Record<string, boolean>) => {
    set({ fontSuggestions: suggestions });
  },
  
  // Token update actions
  updateToken: (category: keyof DesignSystemTokens, token: string, value: string) => {
    const { currentTheme } = get();
    if (!currentTheme) return;
    
    const updatedTokens = {
      ...currentTheme.tokens,
      [category]: {
        ...currentTheme.tokens[category],
        [token]: value
      }
    };
    
    const updatedTheme = {
      ...currentTheme,
      tokens: updatedTokens
    };
    
    set({ currentTheme: updatedTheme });
    
    // Apply the change immediately to CSS variables
    document.documentElement.style.setProperty(`--${token}`, value);
  },
  
  applyThemeTokens: (tokens: DesignSystemTokens, isDark: boolean = false) => {
    // Apply color tokens to CSS variables
    Object.entries(tokens.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    
    // Apply typography tokens
    Object.entries(tokens.typography).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    
    // Apply spacing tokens
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    
    // Apply shadow tokens
    Object.entries(tokens.shadows).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    
    // Apply border tokens
    Object.entries(tokens.borders).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  },
  
  // Utility actions
  resetToDefault: () => {
    set({
      selectedDesignSystem: 'None',
      currentTheme: null,
      isDarkMode: false,
      activePanel: 'colors',
      collapsedSections: new Set(),
      openColorPickers: new Set(),
      fontSuggestions: {}
    });
  },
  
  exportCurrentTheme: () => {
    const { currentTheme } = get();
    if (!currentTheme) return;
    
    const themeData = JSON.stringify(currentTheme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTheme.name}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
  
  importTheme: (themeData: any) => {
    try {
      const theme: DesignSystemTheme = themeData;
      get().createTheme(theme);
      get().setSelectedDesignSystem(theme.name);
    } catch (error) {
      console.error('Failed to import theme:', error);
    }
  }
}));

// Helper function to create theme options (moved from themeLoader)
function createThemeOptions(themes: DesignSystemTheme[]): Array<{
  label: string;
  options: Array<{ value: string; label: string; description?: string }>;
}> {
  const builtIn = themes.filter(t => t.category !== 'user');
  const user = themes.filter(t => t.category === 'user');
  
  const options = [];
  
  if (builtIn.length > 0) {
    options.push({
      label: 'Built-in',
      options: builtIn.map(t => ({
        value: t.name,
        label: t.name,
        description: t.description
      }))
    });
  }
  
  if (user.length > 0) {
    options.push({
      label: 'Custom',
      options: user.map(t => ({
        value: t.name,
        label: t.name,
        description: t.description
      }))
    });
  }
  
  return options;
} 