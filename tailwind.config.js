/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Pour App Router
    './pages/**/*.{js,ts,jsx,tsx}',   // Si tu as encore des pages (ancien format)
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lavande: '#C8A1E0',
        bleuPastel: '#C2E2F5',
        roseDoux: '#FEE3EC',
        vertEquilibre: '#BFF9C6',
        beigeDoux: '#EEDEA3',
        orangePastel: '#FFBE98',
        noir: '#000000',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        handwritten: ['"Berkshire Swash"', 'cursive'],
      },
    },
  },
  plugins: [],
}
