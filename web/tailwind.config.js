/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "var(--primary)",
                background: "var(--background)",
                surface: "var(--surface)",
                text: "var(--text)",
                "text-muted": "var(--text-muted)",
                border: "var(--border)",
            },

            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
