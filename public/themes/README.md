# Figaroo Design System Themes

This folder contains built-in design system themes that are automatically loaded into the Design System Popover.

## Available Themes

### Light Themes
- **Default Light** (`default-light.json`) - Clean light theme with warm tones and excellent readability
- **Corporate Light** (`corporate-light.json`) - Professional corporate theme with subtle blues and clean typography
- **Minimal Mono** (`minimal-mono.json`) - Ultra-minimal monochrome theme focused on typography and spacing

### Dark Themes
- **Default Dark** (`default-dark.json`) - Elegant dark theme with cool tones and enhanced contrast
- **Modern Dark** (`modern-dark.json`) - A modern dark theme with vibrant accents and enhanced contrast
- **Vibrant Neon** (`vibrant-neon.json`) - Electric neon theme with vibrant colors and glowing effects

## Theme Structure

Each theme follows this JSON structure:

```json
{
  "name": "Theme Name",
  "tokens": {
    "colors": { ... },
    "typography": { ... },
    "spacing": { ... },
    "shadows": { ... },
    "borders": { ... }
  },
  "description": "Theme description",
  "category": "light|dark|user",
  "version": "1.0.0",
  "author": "Author Name"
}
```

## Adding New Themes

To add a new built-in theme:

1. Create a new JSON file in this folder following the structure above
2. Add the filename to the `BUILT_IN_THEMES` array in `src/components/DesignSystemPopover/themeLoader.ts`
3. The theme will automatically appear in the organized dropdown

## Theme Categories

- **light** - Light themes with bright backgrounds
- **dark** - Dark themes with dark backgrounds  
- **user** - Custom themes imported by users (stored in localStorage) 