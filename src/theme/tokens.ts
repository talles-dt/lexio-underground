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
  // Legacy aliases (auto-added by monitoring loop)
  white: "#F5F0E8", // alias for ivory
  blackPrimary: "#0D0D0F", // alias for obsidian
  grayLight: "#71717A", // alias for zinc
  grayDark: "#3f3f46", // dark gray
  grayLightest: "#27272A", // lightest gray
  red: "#DC2626", // alias for crimson
  card: "#141416", // alias for surface
  primary: "#00FF88", // alias for phosphor
  text: "#F5F0E8", // alias for ivory
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
  lime: "#C4F82A",
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

import { MaturityStage } from "@/types/stubs";
import { stageColors } from "./tokens.stageColors";

export const themeColors: Record<MaturityStage, string> = {
  roots: "#00FF88",
  sprouts: "#22C55E",
  branches: "#FF9500",
  canopy: "#166534",
  underground: "#A855F7",
};

export const typography = {
  display: {
    fontFamily: "Syne-Bold",
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "700" as const,
  },
  h1: {
    fontFamily: "Syne-Bold",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
  },
  h2: {
    fontFamily: "SourceSerif4-SemiBold",
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600" as const,
  },
  heading: {
    xl: {
      fontFamily: "Syne-Bold",
      fontSize: 24,
      lineHeight: 30,
      fontWeight: "700" as const,
    },
  },
  text: {
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
  } as const,
  body: {
    fontFamily: "SourceSerif4-Regular",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "400" as const,
  },
  bodyItalic: {
    fontFamily: "SourceSerif4-Italic",
    fontSize: 14,
    lineHeight: 18,
    fontStyle: "italic" as const,
  },
  bodyLg: {
    fontFamily: "SourceSerif4-Regular",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  ui: {
    fontFamily: "JetBrainsMono-Medium",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500" as const,
  },
  caption: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "400" as const,
  },
} as const;

export const spacing = {
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  6: 16,
  8: 24,
  12: 32,
  16: 48,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export const radius = {
  card: 12,
  btn: 8,
  full: 9999,
  sm: 6,
  md: 12,
} as const;

export const duration = {
  instant: 150,
  fast: 200,
  normal: 300,
  slow: 400,
  reveal: 500,
  palace: 1300,
} as const;

const theme = {
  colors,
  stageColors,
  typography,
  spacing,
  radius,
  duration,
} as const;

export type Theme = typeof theme;
export default theme;
