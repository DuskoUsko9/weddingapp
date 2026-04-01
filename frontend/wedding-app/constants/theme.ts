export const Colors = {
  background: '#FDFAF5',
  surface: '#FFFFFF',
  primary: '#C9A96E',
  primaryDark: '#A8854A',
  textPrimary: '#2C2423',
  textSecondary: '#8C7B6B',
  accent: '#A8B5A0',
  error: '#C0666B',
  border: '#E8DDD0',
  overlay: 'rgba(44, 36, 35, 0.4)',
} as const;

export const Typography = {
  heading: 'PlayfairDisplay_700Bold',
  headingItalic: 'PlayfairDisplay_700Bold_Italic',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  card: 16,
  button: 28,
  full: 999,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#2C2423',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;
