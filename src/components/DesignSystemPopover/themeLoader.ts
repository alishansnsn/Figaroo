import { DesignSystemTheme } from './types';

// Built-in theme files from the themes folder
const BUILT_IN_THEMES = [
  'default-light.json',
  'default-dark.json',
  'modern-dark.json',
  'corporate-light.json',
  'vibrant-neon.json',
  'minimal-mono.json',
  'claude.json',
  'caffeine.json'
];

/**
 * Load a single theme from the themes folder
 */
async function loadThemeFile(filename: string): Promise<DesignSystemTheme | null> {
  try {
    const response = await fetch(`/themes/${filename}`);
    if (!response.ok) {
      console.warn(`Failed to load theme: ${filename}`);
      return null;
    }
    const themeData = await response.json();
    return themeData as DesignSystemTheme;
  } catch (error) {
    console.warn(`Error loading theme ${filename}:`, error);
    return null;
  }
}

/**
 * Load all built-in themes from the themes folder
 */
export async function loadBuiltInThemes(): Promise<DesignSystemTheme[]> {
  const themes: DesignSystemTheme[] = [];
  
  // Load all built-in theme files in parallel
  const themePromises = BUILT_IN_THEMES.map(filename => loadThemeFile(filename));
  const results = await Promise.all(themePromises);
  
  // Filter out any failed loads and add to themes array
  results.forEach(theme => {
    if (theme) {
      themes.push(theme);
    }
  });
  
  return themes;
}

/**
 * Get themes organized by category
 */
export function organizeThemesByCategory(themes: DesignSystemTheme[]): {
  light: DesignSystemTheme[];
  dark: DesignSystemTheme[];
  user: DesignSystemTheme[];
} {
  const organized = {
    light: [] as DesignSystemTheme[],
    dark: [] as DesignSystemTheme[],
    user: [] as DesignSystemTheme[]
  };
  
  themes.forEach(theme => {
    // Check if it's a user theme (themes without category are considered user themes)
    if (!theme.category || theme.category === 'user') {
      organized.user.push(theme);
    } else if (theme.category === 'light') {
      organized.light.push(theme);
    } else if (theme.category === 'dark') {
      organized.dark.push(theme);
    } else {
      // Fallback to user category for unknown categories
      organized.user.push(theme);
    }
  });
  
  return organized;
}

/**
 * Create option groups for the theme dropdown
 */
export function createThemeOptions(themes: DesignSystemTheme[]): Array<{
  label: string;
  options: Array<{ value: string; label: string; description?: string }>;
}> {
  const organized = organizeThemesByCategory(themes);
  const groups = [];
  
  if (organized.light.length > 0) {
    groups.push({
      label: 'Light Themes',
      options: organized.light.map(theme => ({
        value: theme.name,
        label: theme.name,
        description: theme.description
      }))
    });
  }
  
  if (organized.dark.length > 0) {
    groups.push({
      label: 'Dark Themes',
      options: organized.dark.map(theme => ({
        value: theme.name,
        label: theme.name,
        description: theme.description
      }))
    });
  }
  
  if (organized.user.length > 0) {
    groups.push({
      label: 'Custom Themes',
      options: organized.user.map(theme => ({
        value: theme.name,
        label: theme.name,
        description: theme.description
      }))
    });
  }
  
  return groups;
} 