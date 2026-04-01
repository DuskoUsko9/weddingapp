// Design system — Editorial Elegance / "Digital Concierge"
// Source: Stitch project 4401616869883670187 (Sage variant, updated 2026-04-01)
// Rule: NO 1px solid borders — use background color shifts for section boundaries.

export const Colors = {
  // ── Surface hierarchy (treat as stacked paper layers) ──────────────────────
  background: '#faf9f6',             // base layer — warm ivory
  surfaceContainerLow: '#f4f3f1',    // section groupings
  surfaceContainer: '#efeeeb',       // default containers
  surfaceContainerHigh: '#e9e8e5',   // input field backgrounds
  surfaceContainerHighest: '#e3e2e0',// toggle/interactive backgrounds
  surface: '#ffffff',                // floating cards — max contrast on ivory

  // ── Primary — gold ─────────────────────────────────────────────────────────
  primary: '#725b28',                // dark gold — buttons, active icons
  primaryContainer: '#c0a469',       // lighter gold — gradient end, highlights
  primaryFixed: '#fedf9f',           // very light gold — subtle tints
  primaryFixedDim: '#e0c385',        // dim gold
  onPrimary: '#ffffff',              // text on primary bg

  // ── Secondary — eucalyptus / sage ──────────────────────────────────────────
  secondary: '#516351',              // sage green — success, positive actions
  secondaryContainer: '#d4e8d1',     // light sage — chip backgrounds
  onSecondary: '#ffffff',

  // ── Tertiary — warm brown ───────────────────────────────────────────────────
  tertiary: '#6a5d43',
  tertiaryContainer: '#b6a687',

  // ── Text ───────────────────────────────────────────────────────────────────
  onSurface: '#1a1c1a',              // deep warm charcoal — NEVER pure black
  onSurfaceVariant: '#4d4638',       // secondary text
  onBackground: '#1a1c1a',

  // Backward-compatible aliases used across current screens
  textPrimary: '#1a1c1a',
  textSecondary: '#4d4638',

  // ── Outline ────────────────────────────────────────────────────────────────
  outline: '#7f7667',                // visible outlines when needed
  outlineVariant: '#d0c5b3',         // ghost border (use at 15% opacity)

  // Backward-compatible aliases used across current screens
  border: '#d0c5b3',
  accent: '#516351',

  // ── Semantic ───────────────────────────────────────────────────────────────
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',

  // ── Inverse (for dark overlays) ────────────────────────────────────────────
  inverseSurface: '#2f312f',
  inverseOnSurface: '#f2f1ee',
  inversePrimary: '#e0c385',

  // ── Overlay (glassmorphism nav — surface at 80% opacity) ──────────────────
  overlay: 'rgba(250, 249, 246, 0.80)',
} as const;

export const Typography = {
  // Heading — Georgia (elegant serif, built into all browsers/OS)
  heading: 'Georgia, "Times New Roman", serif',
  headingRegular: 'Georgia, "Times New Roman", serif',
  headingItalic: 'Georgia, "Times New Roman", serif',

  // Body — system-ui (native OS sans-serif, zero loading time)
  body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  bodyMedium: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  bodySemiBold: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  gallery: 64, // spacing-16 — top-of-page margin for "Gallery" feel
} as const;

export const Radius = {
  sm: 8,
  md: 12,        // input fields
  lg: 16,
  card: 24,      // "Madu" card — xl (1.5rem)
  button: 24,    // primary CTA — xl roundness
  full: 999,
} as const;

export const Shadow = {
  // Ambient shadow — soft glow, NOT dark drop-shadow
  // Uses both old RN shadow props (native) and boxShadow (web)
  card: {
    shadowColor: '#1a1c1a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 3,
    // @ts-ignore — React Native Web prefers boxShadow
    boxShadow: '0px 8px 24px rgba(26, 28, 26, 0.06)',
  },
  floating: {
    shadowColor: '#1a1c1a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
    // @ts-ignore — React Native Web prefers boxShadow
    boxShadow: '0px 8px 24px rgba(26, 28, 26, 0.08)',
  },
} as const;
