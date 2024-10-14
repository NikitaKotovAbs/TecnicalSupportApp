/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            keyframes: {
                fadeBackground: {
                    '0%': {backgroundImage: "url('./src/assets/photo1.png')"},
                    '33%': {backgroundImage: "url('./src/assets/photo2.png')"},
                    '66%': {backgroundImage: "url('./src/assets/photo3.png')"},
                    '100%': {backgroundImage: "url('./src/assets/photo1.png')"}, // Цикл возвращается к первой картинке
                },
            },
            animation: {
                fadeBackground: 'fadeBackground 15s ease-in-out infinite', // Плавная анимация с циклом
            },
        },
    },
    plugins: [
        "prettier-plugin-tailwindcss",
        "tailwindcss-animate",
    ],

}

