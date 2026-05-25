/**
 * Lexio Underground — Design Tokens
 * TypeScript constants + theme object for use throughout the app.
 * Source: lexio-vault/02-design/DESIGN.md
 * Enhanced with stitch_experience design brief additions
 */

export const colors = {
  // Core
  obsidian: "#0D0D0F",
  surface: "#141416",
  // Surface variants from stitch design brief
  surfaceDim: "#0c160e",
  surfaceBright: "#323c32",
  surfaceContainerLowest: "#071009",
  surfaceContainerLow: "#141e16",
  surfaceContainer: "#18221a",
  surfaceContainerHigh: "#222c24",
  surfaceContainerHighest: "#2d372e",
  surfaceVariant: "#2d372e",
  // Text colors
  ivory: "#F5F0E8",
  zinc: "#71717A",
  // Additional text colors from stitch
  onSurface: "#dae6d8",
  onSurfaceVariant: "#b9cbb9",
  inverseSurface: "#dae6d8",
  inverseOnSurface: "#29332a",
  // Signal colors
  phosphor: "#00FF88",
  phosphorFixed: "#60ff99",
  phosphorFixedDim: "#00e479", // surface-tint from stitch
  onPhosphor: "#003919",
  onPhosphorContainer: "#007139",
  inversePhosphor: "#006d37",
  // Accent colors
  amber: "#FF9500",
  violet: "#A855F7",
  crimson: "#DC2626",
  // Additional accent colors from stitch
  secondary: "#ffbc7c",
  onSecondary: "#4b2800",
  secondaryContainer: "#fe9400",
  onSecondaryContainer: "#633700",
  tertiary: "#fffaf7",
  onTertiary: "#3d2f00",
  tertiaryContainer: "#ffdb79",
  onTertiaryContainer: "#795f01",
  // Error colors
  error: "#ffb4ab",
  onError: "#690005",
  errorContainer: "#93000a",
  onErrorContainer: "#ffdad6",
  // Borders
  borderSubtle: "#27272A",
  outline: "#849585",
  outlineVariant: "#3b4b3d",
} as const;

export const stageColors = {
  roots: "#00FF88",
  sprouts: "#22C55E",
  branches: "#FF9500",
  canopy: "#166534",
  underground: "#A855F7",
} as const;

export const typography = {
  display: {
    fontFamily: "Syne-Bold",
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "700" as const,
  },
  h1: {
    fontFamily: "Syne-Bold",
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontFamily: "SourceSerif4-SemiBold",
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  body: {
    fontFamily: "SourceSerif4-Regular",
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "400" as const,
  },
  bodyItalic: {
    fontFamily: "SourceSerif4-Italic",
    fontSize: 16,
    lineHeight: 26,
    fontStyle: "italic" as const,
  },
  bodyLg: {
    fontFamily: "SourceSerif4-Regular",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "400" as const,
  },
  ui: {
    fontFamily: "JetBrainsMono-Medium",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  caption: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
} as const;

export const radius = {
  card: 12,
  btn: 8,
} as const;

export const duration = {
  instant: 150,
  fast: 200,
  normal: 300,
  slow: 400,
  reveal: 500,
  palace: 1300,
} as const;

export const theme = {
  colors,
  stageColors,
  typography,
  spacing,
  radius,
  duration,
} as const;

export type Theme = typeof theme;
