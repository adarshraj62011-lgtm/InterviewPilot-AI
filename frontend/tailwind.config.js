// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1', // Indigo-500
        'accent-cyan': '#06B6D4', // Cyan-500
        'accent-emerald': '#10B981', // Emerald-500
        'accent-rose': '#F43F5E', // Rose-500
        'accent-violet': '#8B5CF6', // Violet-500
        'dark-bg': '#0F172A', // Slate-900
        'dark-card': '#1E293B', // Slate-800
        'dark-muted': '#64748B', // Slate-500
        'glass-card': 'rgba(255, 255, 255, 0.05)',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'neon-primary': '0 0 10px rgba(99, 102, 241, 0.6)',
        'neon-cyan': '0 0 10px rgba(6, 182, 212, 0.6)',
        'neon-emerald': '0 0 10px rgba(16, 185, 129, 0.6)',
        'neon-rose': '0 0 10px rgba(244, 63, 94, 0.6)',
        'neon-violet': '0 0 10px rgba(139, 92, 246, 0.6)',
      },
      animation: {
        'neon-pulse': 'neonPulse 2s infinite',
      },
      keyframes: {
        neonPulse: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
