/**
 * Lexio Underground — Design Tokens
 * Single source of truth: CSS custom properties in src/styles/tokens.css
 * This module re-exports CSS var references for use in inline styles.
 * Edit tokens.css as the single source of truth.
 */

// All colors as CSS var references
export const colors = {
  // Core
  obsidian: "var(--obsidian)",
  surface: "var(--surface)",
  ivory: "var(--ivory)",
  zinc: "var(--zinc)",
  // Signal
  phosphor: "var(--phosphor)",
  amber: "var(--amber)",
  violet: "var(--violet)",
  crimson: "var(--crimson)",
  // Borders
  borderSubtle: "var(--border-subtle)",
  // Extended surface variants
  surfaceDim: "#0c160e",
  surfaceBright: "#323c32",
  surfaceContainerLowest: "#071009",
  surfaceContainerLow: "#141e16",
  surfaceContainer: "#18221a",
  surfaceContainerHigh: "#222c24",
  surfaceContainerHighest: "#2d372e",
  surfaceVariant: "#2d372e",
  // Text colors
  onSurface: "#dae6d8",
  onSurfaceVariant: "#b9cbb9",
  inverseSurface: "#dae6d8",
  inverseOnSurface: "#29332a",
  text: "var(--ivory)",
  // Phosphor variants
  phosphorFixed: "#60ff99",
  phosphorFixedDim: "#00e479",
  onPhosphor: "#003919",
  onPhosphorContainer: "#007139",
  inversePhosphor: "#006d37",
  // Accent variants
  lime: "#C4F82A",
  secondary: "#ffbc7c",
  onSecondary: "#4b2800",
  secondaryContainer: "#fe9400",
  onSecondaryContainer: "#633700",
  tertiary: "#fffaf7",
  onTertiary: "#3d2f00",
  tertiaryContainer: "#ffdb79",
  onTertiaryContainer: "#795f01",
  // Error
  error: "#ffb4ab",
  onError: "#690005",
  errorContainer: "#93000a",
  onErrorContainer: "#ffdad6",
  // Outline
  outline: "#849585",
  outlineVariant: "#3b4b3d",
  // Aliases
  white: "var(--ivory)",
  blackPrimary: "var(--obsidian)",
  grayLight: "var(--zinc)",
  grayDark: "#3f3f46",
  grayLightest: "#27272a",
  card: "var(--surface)",
  primary: "var(--phosphor)",
  red: "var(--crimson)",
} as const;

// Typography values (in px, for use in inline styles)
export const typography = {
  display: {
    fontFamily: "var(--font-display)",
    fontSize: 36,
    lineHeight: "42px",
    fontWeight: "700" as const,
  },
  h1: {
    fontFamily: "var(--font-display)",
    fontSize: 28,
    lineHeight: "34px",
    fontWeight: "700" as const,
  },
  h2: {
    fontFamily: "var(--font-serif)",
    fontSize: 20,
    lineHeight: "26px",
    fontWeight: "600" as const,
  },
  heading: {
    xl: {
      fontFamily: "var(--font-display)",
      fontSize: 24,
      lineHeight: "30px",
      fontWeight: "700" as const,
    },
  },
  body: {
    fontFamily: "var(--font-serif)",
    fontSize: 14,
    lineHeight: "18px",
    fontWeight: "400" as const,
  },
  bodyItalic: {
    fontFamily: "var(--font-serif)",
    fontSize: 14,
    lineHeight: "18px",
    fontStyle: "italic" as const,
  },
  bodyLg: {
    fontFamily: "var(--font-serif)",
    fontSize: 15,
    lineHeight: "20px",
    fontWeight: "400" as const,
  },
  ui: {
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    lineHeight: "18px",
    fontWeight: "500" as const,
  },
  caption: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    lineHeight: "14px",
    fontWeight: "400" as const,
  },
  // Font size shortcuts (for use as typography.text.md etc.)
  text: {
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
  } as const,
} as const;

// Spacing scale (2px base) — must match --space-* in tokens.css
export const spacing = {
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  6: 16,
  8: 24,
  12: 32,
  16: 48,
  // Named aliases (backward compat)
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

// Radius
export const radius = {
  card: 12,
  btn: 8,
  full: 9999,
  sm: 6,
  md: 12,
} as const;

// Duration
export const duration = {
  instant: 150,
  fast: 200,
  normal: 300,
  slow: 400,
  reveal: 500,
  palace: 1300,
} as const;

// Stage colors (for maturity progression)
export const themeColors = {
  roots: "var(--phosphor)",
  sprouts: "#22c55e",
  branches: "var(--amber)",
  canopy: "#166534",
  underground: "var(--violet)",
} as const;

const theme = {
  colors,
  themeColors,
  typography,
  spacing,
  radius,
  duration,
} as const;

export type Theme = typeof theme;
export default theme;
