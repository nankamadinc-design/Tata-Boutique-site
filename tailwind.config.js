/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--color-bg) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        'surface-2': 'hsl(var(--color-surface-2) / <alpha-value>)',
        'surface-offset': 'hsl(var(--color-surface-offset) / <alpha-value>)',
        border: 'hsl(var(--color-border) / <alpha-value>)',
        divider: 'hsl(var(--color-divider) / <alpha-value>)',
        text: 'hsl(var(--color-text) / <alpha-value>)',
        'text-muted': 'hsl(var(--color-text-muted) / <alpha-value>)',
        'text-faint': 'hsl(var(--color-text-faint) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--color-primary) / <alpha-value>)',
          hover: 'hsl(var(--color-primary-hover) / <alpha-value>)',
          active: 'hsl(var(--color-primary-active) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--color-accent) / <alpha-value>)',
          hover: 'hsl(var(--color-accent-hover) / <alpha-value>)',
        },
        whatsapp: {
          DEFAULT: 'hsl(var(--color-whatsapp) / <alpha-value>)',
          hover: 'hsl(var(--color-whatsapp-hover) / <alpha-value>)',
        },
        success: 'hsl(var(--color-success) / <alpha-value>)',
        warning: 'hsl(var(--color-warning) / <alpha-value>)',
        error: 'hsl(var(--color-error) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      keyframes: {
        fadein: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-up': { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        fadein: 'fadein 0.6s ease-out',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
};
