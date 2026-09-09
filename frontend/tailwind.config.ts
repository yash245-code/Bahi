import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "Paper & Rust" Palette
        paper: {
          DEFAULT: '#F7F6F3',
          dark: '#161715',
          warm: '#F4F2EC',
        },
        ink: {
          DEFAULT: '#20211F',
          muted: '#75766E',
          subtle: '#9A9B93',
          dark: '#F7F6F3',
        },
        accent: {
          DEFAULT: '#A8462F',
          hover: '#853526',
          subtle: '#FAF4F2',
          border: '#EBD2CB',
        },
        // Brand palette mapped to Rust
        brand: {
          50: '#FAF4F2',
          100: '#F5E8E4',
          200: '#EBD2CB',
          300: '#DDB3A7',
          400: '#C88775',
          500: '#B7624C',
          600: '#A8462F', // Primary Accent
          700: '#853526', // Hover / Pressed
          800: '#6F2E22',
          900: '#5D2A20',
          950: '#3A1811',
        },
        // Surfaces
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F7F6F3',
          tertiary: '#EFECE6',
          dark: '#191A18',
          'dark-secondary': '#222320',
          'dark-tertiary': '#2D2F2B',
        },
        // Borders
        border: {
          DEFAULT: '#E6E3DC',
          subtle: '#EFECE6',
          dark: '#30322D',
        },
        // Status Colors (from spec)
        status: {
          success: '#1F7A4D',
          warning: '#B8790A',
          danger: '#B23A2E',
          info: '#75766E',
        },
        // Module Colors
        module: {
          crm: {
            DEFAULT: '#C2542F',
            bg: '#3A2318',
            border: '#5A3624',
          },
          inventory: {
            DEFAULT: '#3E7FBF',
            bg: '#16283A',
            border: '#254764',
          },
          accounting: {
            DEFAULT: '#2E9169',
            bg: '#123322',
            border: '#1F5138',
          },
          billing: {
            DEFAULT: '#8B8D85',
            bg: '#26271F',
            border: '#3A3C33',
          },
          hr: {
            DEFAULT: '#C24A6B',
            bg: '#3A1B24',
            border: '#5C2E3C',
          },
          projects: {
            DEFAULT: '#D1A536',
            bg: '#332A11',
            border: '#544620',
          },
        },
        // Neutral Ramp (50 lightest -> 950 darkest)
        neutral: {
          50: '#F7F6F3',
          100: '#E8E6E1',
          200: '#D5D2CA',
          300: '#B8B6AE',
          400: '#9A9B93',
          500: '#75766E',
          600: '#54554E',
          700: '#3A3A3A',
          800: '#2A2A2A',
          900: '#222222',
          950: '#141513',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(32, 33, 31, 0.05)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.32)',
        'card': '0 1px 3px rgba(32, 33, 31, 0.04), 0 1px 2px rgba(32, 33, 31, 0.06)',
        'card-hover': '0 8px 24px rgba(32, 33, 31, 0.08)',
        'accent': '0 4px 14px rgba(168, 70, 47, 0.25)',
        'glow-crm': '0 4px 14px rgba(194, 84, 47, 0.25)',
        'glow-inventory': '0 4px 14px rgba(62, 127, 191, 0.25)',
        'glow-accounting': '0 4px 14px rgba(46, 145, 105, 0.25)',
        'glow-billing': '0 4px 14px rgba(139, 141, 133, 0.25)',
        'glow-hr': '0 4px 14px rgba(194, 74, 107, 0.25)',
        'glow-projects': '0 4px 14px rgba(209, 165, 54, 0.25)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
