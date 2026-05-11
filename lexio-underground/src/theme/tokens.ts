/**
 * Lexio Underground — Design Tokens
 * TypeScript constants + theme object for use throughout the app.
 * Source: lexio-vault/02-design/DESIGN.md
 */

export const colors = {
  // Core
  obsidian: '#0D0D0F',
  surface: '#141416',
  ivory: '#F5F0E8',
  zinc: '#71717A',

  // Signal
  phosphor: '#00FF88',
  amber: '#FF9500',
  violet: '#A855F7',
  crimson: '#DC2626',

  // Borders
  borderSubtle: '#27272A',
} as const;

export const stageColors = {
  roots: '#00FF88',
  sprouts: '#22C55E',
  branches: '#FF9500',
  canopy: '#166534',
  underground: '#A855F7',
} as const;

export const typography = {
  display: {
    fontFamily: 'Syne-Bold',
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700' as const,
  },
  h1: {
    fontFamily: 'Syne-Bold',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  h2: {
    fontFamily: 'SourceSerif4-SemiBold',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  body: {
    fontFamily: 'SourceSerif4-Regular',
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400' as const,
  },
  bodyItalic: {
    fontFamily: 'SourceSerif4-Italic',
    fontSize: 16,
    lineHeight: 26,
    fontStyle: 'italic' as const,
  },
  bodyLg: {
    fontFamily: 'SourceSerif4-Regular',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  ui: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  caption: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
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