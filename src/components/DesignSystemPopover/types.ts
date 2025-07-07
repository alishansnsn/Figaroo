export interface DesignSystem {
  name: string;
  colors: string[];
  description?: string;
}

export interface DesignSystemPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (designSystem: string) => void;
  selectedSystem: string;
  anchorElement?: HTMLElement | null;
}

export interface SearchState {
  query: string;
  filteredSystems: DesignSystem[];
}

// Enhanced design system theme structure
export interface DesignSystemTheme {
  name: string;
  tokens: DesignSystemTokens;
  raw: any;
  description?: string;
  category?: 'light' | 'dark' | 'user';
  version?: string;
  author?: string;
}

export interface DesignSystemTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  shadows: ShadowTokens;
  borders: BorderTokens;
  [key: string]: any;
}

export interface ColorTokens {
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  popover: string;
  'popover-foreground': string;
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  muted: string;
  'muted-foreground': string;
  accent: string;
  'accent-foreground': string;
  destructive: string;
  'destructive-foreground': string;
  border: string;
  input: string;
  ring: string;
  'chart-1': string;
  'chart-2': string;
  'chart-3': string;
  'chart-4': string;
  'chart-5': string;
  [key: string]: string;
}

export interface TypographyTokens {
  'font-sans': string;
  'font-serif': string;
  'font-mono': string;
  [key: string]: string;
}

export interface SpacingTokens {
  radius: string;
  spacing: string;
  [key: string]: string;
}

export interface ShadowTokens {
  'shadow-2xs': string;
  'shadow-xs': string;
  'shadow-sm': string;
  shadow: string;
  'shadow-md': string;
  'shadow-lg': string;
  'shadow-xl': string;
  'shadow-2xl': string;
  [key: string]: string;
}

export interface BorderTokens {
  'radius-sm': string;
  'radius-md': string;
  'radius-lg': string;
  'radius-xl': string;
  [key: string]: string;
}

export interface ThemeMode {
  light: Partial<ColorTokens>;
  dark: Partial<ColorTokens>;
} 