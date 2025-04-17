export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.{css}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        surfaceDeep: 'var(--surface-deep)',

        foreground: 'var(--foreground)',

        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textMuted: 'var(--text-muted)',

        accentPrimary: 'var(--accent-primary)',
        accentSecondary: 'var(--accent-secondary)',
        accentGlow: 'var(--accent-glow)',

        gray: {
          900: 'var(--gray-900)',
          800: 'var(--gray-800)',
        },
      },
    },
  },
  // ✅ Add this here!
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
