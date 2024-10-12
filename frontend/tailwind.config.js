/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../templates/**/*.html',  // Путь к шаблонам относительно директории с конфигурацией
    './src/**/*.js',          // Путь к вашим JavaScript-файлам (если используете)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}



