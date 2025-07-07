import { DesignSystemTheme, DesignSystemTokens, ColorTokens, TypographyTokens, SpacingTokens, ShadowTokens, BorderTokens } from './types';

function parseCSSVariables(text: string): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // Extract CSS variables from :root or .dark selectors
  const cssVarRegex = /--([^:]+):\s*([^;]+);/g;
  let match;
  
  while ((match = cssVarRegex.exec(text)) !== null) {
    const [, name, value] = match;
    variables[name.trim()] = value.trim();
  }
  
  return variables;
}

function organizeTokens(variables: Record<string, string>): DesignSystemTokens {
  const colors: Partial<ColorTokens> = {};
  const typography: Partial<TypographyTokens> = {};
  const spacing: Partial<SpacingTokens> = {};
  const shadows: Partial<ShadowTokens> = {};
  const borders: Partial<BorderTokens> = {};
  
  // Categorize variables based on their names
  Object.entries(variables).forEach(([key, value]) => {
    if (key.startsWith('font-')) {
      typography[key as keyof TypographyTokens] = value;
    } else if (key.startsWith('shadow')) {
      shadows[key as keyof ShadowTokens] = value;
    } else if (key.includes('radius')) {
      if (key === 'radius') {
        spacing[key] = value;
      } else {
        borders[key as keyof BorderTokens] = value;
      }
    } else if (key === 'spacing') {
      spacing[key] = value;
    } else {
      // Most other variables are colors
      colors[key as keyof ColorTokens] = value;
    }
  });
  
  // Ensure we have default values for essential colors
  const defaultColors: ColorTokens = {
    background: colors.background || '#ffffff',
    foreground: colors.foreground || '#000000',
    card: colors.card || '#ffffff',
    'card-foreground': colors['card-foreground'] || '#000000',
    popover: colors.popover || '#ffffff',
    'popover-foreground': colors['popover-foreground'] || '#000000',
    primary: colors.primary || '#2196F3',
    'primary-foreground': colors['primary-foreground'] || '#ffffff',
    secondary: colors.secondary || '#6b7280',
    'secondary-foreground': colors['secondary-foreground'] || '#ffffff',
    muted: colors.muted || '#f3f4f6',
    'muted-foreground': colors['muted-foreground'] || '#6b7280',
    accent: colors.accent || '#f59e0b',
    'accent-foreground': colors['accent-foreground'] || '#000000',
    destructive: colors.destructive || '#ef4444',
    'destructive-foreground': colors['destructive-foreground'] || '#ffffff',
    border: colors.border || '#e5e7eb',
    input: colors.input || '#e5e7eb',
    ring: colors.ring || '#2196F3',
    'chart-1': colors['chart-1'] || '#2196F3',
    'chart-2': colors['chart-2'] || '#10b981',
    'chart-3': colors['chart-3'] || '#f59e0b',
    'chart-4': colors['chart-4'] || '#ef4444',
    'chart-5': colors['chart-5'] || '#8b5cf6',
    ...colors
  };
  
  const defaultTypography: TypographyTokens = {
    'font-sans': typography['font-sans'] || 'Inter, sans-serif',
    'font-serif': typography['font-serif'] || 'Georgia, serif',
    'font-mono': typography['font-mono'] || 'Menlo, monospace',
    ...typography
  };
  
  const defaultSpacing: SpacingTokens = {
    radius: spacing.radius || '0.5rem',
    spacing: spacing.spacing || '0.25rem',
    ...spacing
  };
  
  const defaultShadows: ShadowTokens = {
    'shadow-2xs': shadows['shadow-2xs'] || '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    'shadow-xs': shadows['shadow-xs'] || '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    'shadow-sm': shadows['shadow-sm'] || '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    shadow: shadows.shadow || '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    'shadow-md': shadows['shadow-md'] || '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    'shadow-lg': shadows['shadow-lg'] || '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    'shadow-xl': shadows['shadow-xl'] || '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    'shadow-2xl': shadows['shadow-2xl'] || '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    ...shadows
  };
  
  const defaultBorders: BorderTokens = {
    'radius-sm': borders['radius-sm'] || 'calc(var(--radius) - 4px)',
    'radius-md': borders['radius-md'] || 'calc(var(--radius) - 2px)',
    'radius-lg': borders['radius-lg'] || 'var(--radius)',
    'radius-xl': borders['radius-xl'] || 'calc(var(--radius) + 4px)',
    ...borders
  };
  
  return {
    colors: defaultColors,
    typography: defaultTypography,
    spacing: defaultSpacing,
    shadows: defaultShadows,
    borders: defaultBorders
  };
}

export async function parseDesignSystemFile(file: File): Promise<DesignSystemTheme> {
  const text = await file.text();
  let parsed: any;
  
  try {
    // Try to parse as JSON first
    parsed = JSON.parse(text);
  } catch {
    // If JSON parsing fails, try to extract from CSS or Markdown
    if (text.includes(':root') || text.includes('--')) {
      // Parse as CSS
      const variables = parseCSSVariables(text);
      const tokens = organizeTokens(variables);
      
      return {
        name: file.name.replace(/\.[^.]+$/, ''),
        tokens,
        raw: { variables, css: text }
      };
    } else {
      // Try to extract JSON from Markdown
      const match = text.match(/```[a-zA-Z]*([\s\S]*?)```/);
      if (match) {
        try {
          parsed = JSON.parse(match[1]);
        } catch {
          throw new Error('Invalid JSON in file.');
        }
      } else {
        throw new Error('File is not valid JSON, CSS, or Markdown with JSON.');
      }
    }
  }
  
  // Validate structure
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid theme structure.');
  }
  
  const name = parsed.name || file.name.replace(/\.[^.]+$/, '');
  
  // If it's already in our token format, use it directly
  if (parsed.tokens) {
    return {
      name,
      tokens: parsed.tokens,
      raw: parsed
    };
  }
  
  // Otherwise, organize the flat structure
  const tokens = organizeTokens(parsed);
  
  return {
    name,
    tokens,
    raw: parsed
  };
} 