/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#030712', // Deep slate / dark background
        foreground: '#f8fafc',
        neon: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          green: '#10b981',
          red: '#ef4444',
          yellow: '#f59e0b',
          pink: '#ec4899',
        },
        cyber: {
          dark: '#0f172a',
          darker: '#020617',
          card: 'rgba(15, 23, 42, 0.6)',
          border: 'rgba(56, 189, 248, 0.2)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'aurora': 'linear-gradient(60deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-scan': 'radarScan 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-line': 'glowLine 3s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: .7, filter: 'brightness(1.5)' },
        },
        radarScan: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowLine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        }
      }
    },
  },
  plugins: [],
}
