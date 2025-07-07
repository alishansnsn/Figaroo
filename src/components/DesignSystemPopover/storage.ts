import { DesignSystemTheme } from './types';
import { loadBuiltInThemes } from './themeLoader';

const STORAGE_KEY = 'figaroo_design_system_themes';

export function getUserThemes(): DesignSystemTheme[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getAllThemes(): Promise<DesignSystemTheme[]> {
  const [builtInThemes, userThemes] = await Promise.all([
    loadBuiltInThemes(),
    Promise.resolve(getUserThemes())
  ]);
  
  return [...builtInThemes, ...userThemes];
}

// Backward compatibility - will be replaced by getAllThemes
export function getThemes(): DesignSystemTheme[] {
  return getUserThemes();
}

export function saveTheme(theme: DesignSystemTheme) {
  const themes = getThemes();
  const filtered = themes.filter(t => t.name !== theme.name);
  filtered.push(theme);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function deleteTheme(name: string) {
  const themes = getThemes().filter(t => t.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
}

export function clearThemes() {
  localStorage.removeItem(STORAGE_KEY);
} 