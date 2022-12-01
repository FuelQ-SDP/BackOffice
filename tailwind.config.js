/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        /* Neutrals */
        white: '#fff',
        grey: {
            1: '#F9F8F9',
            2: '#F4F4F4',
            3: '#E5E5E5',
            4: '#B6B6B6',
            5: '#8b8c8c',
            6: '#757575',
            7: '#2d2f30',
            8: '#151617'
        },

        /* Semantics */
        'information': '#0172CB',
        'success': '#46B655',
        'error': '#D21C1C',
        'warning': '#F9971E'
      }
    },
  },
  plugins: [],
}
