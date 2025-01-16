/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      colors: {
        customIndigo: '#4F46E5', // Example custom color
        customCyan: {
          light: '#22D3EE',
          DEFAULT: '#06B6D4',
          dark: '#0E7490',
        },
        palette:{
          primary: '#0197F6', 
          secondary: '#1E96FC',
          back_1:  '#EFA00B', 
          back_2: '#D65108', 
          back_3: '#591F0A',
          background:'#f7f9fc'
        }
      },
    },
  },
  plugins: [],
}

//#0267C1