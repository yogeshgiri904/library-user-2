import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif']
      },
      colors: {
        ink: '#0F172A',
        saffron: '#F59E0B',
        success: '#22C55E',
        paper: '#F8FAFC',
        card: '#FFFFFF'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.10)',
        glow: '0 20px 60px rgba(245, 158, 11, 0.28)'
      },
      backgroundImage: {
        'premium-radial': 'radial-gradient(circle at top left, rgba(245,158,11,0.28), transparent 32%), radial-gradient(circle at top right, rgba(34,197,94,0.18), transparent 28%), linear-gradient(180deg, #0F172A 0%, #111827 100%)',
        'card-glow': 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))'
      },
      keyframes: {
        flame: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', filter: 'drop-shadow(0 0 12px rgba(245,158,11,.45))' },
          '50%': { transform: 'translateY(-3px) scale(1.07)', filter: 'drop-shadow(0 0 24px rgba(245,158,11,.7))' }
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        flame: 'flame 1.2s ease-in-out infinite',
        floaty: 'floaty 3.5s ease-in-out infinite'
      }
    }
  },
  plugins: []
} satisfies Config;
