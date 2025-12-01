/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        themes: [
            {
                dark: {
                    // Primarios - Más vibrantes
                    "primary": "#a855f7",           // Purple 500 (más brillante)
                    "primary-focus": "#9333ea",     // Purple 600
                    "primary-content": "#ffffff",

                    // Secundarios - Blues vibrantes
                    "secondary": "#3b82f6",         // Blue 500
                    "secondary-focus": "#2563eb",   // Blue 600
                    "secondary-content": "#ffffff",

                    // Accent - Pink/Magenta llamativo
                    "accent": "#ec4899",            // Pink 500
                    "accent-focus": "#db2777",      // Pink 600
                    "accent-content": "#ffffff",

                    // Neutral - Más contrastante
                    "neutral": "#374151",           // Gray 700 (más claro)
                    "neutral-focus": "#4b5563",     // Gray 600
                    "neutral-content": "#f9fafb",   // Gray 50

                    // Base - Backgrounds más oscuros
                    "base-100": "#0f172a",          // Slate 900
                    "base-200": "#1e293b",          // Slate 800
                    "base-300": "#334155",          // Slate 700
                    "base-content": "#f1f5f9",      // Slate 100

                    // Estados
                    "info": "#06b6d4",              // Cyan 500
                    "success": "#10b981",           // Green 500
                    "warning": "#f59e0b",           // Amber 500
                    "error": "#ef4444",             // Red 500
                },
            },
            {
                light: {
                    "primary": "#9333ea",           // Purple 600
                    "primary-focus": "#7e22ce",     // Purple 700
                    "primary-content": "#ffffff",

                    "secondary": "#2563eb",         // Blue 600
                    "secondary-focus": "#1d4ed8",   // Blue 700
                    "secondary-content": "#ffffff",

                    "accent": "#db2777",            // Pink 600
                    "accent-focus": "#be185d",      // Pink 700
                    "accent-content": "#ffffff",

                    "neutral": "#f3f4f6",           // Gray 100
                    "neutral-focus": "#e5e7eb",     // Gray 200
                    "neutral-content": "#1f2937",   // Gray 800

                    "base-100": "#ffffff",          // White
                    "base-200": "#f8fafc",          // Slate 50
                    "base-300": "#f1f5f9",          // Slate 100
                    "base-content": "#0f172a",      // Slate 900

                    "info": "#0891b2",              // Cyan 600
                    "success": "#059669",           // Emerald 600
                    "warning": "#d97706",           // Amber 600
                    "error": "#dc2626",             // Red 600
                },
            },
        ],
        darkTheme: "dark",
        base: true,
        styled: true,
        utils: true,
    },
}