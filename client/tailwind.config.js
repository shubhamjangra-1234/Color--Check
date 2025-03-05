/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"], // Adjust paths to match your project structure
    theme: {
      extend: {},
    },
    experimental: {
      optimizeUniversalDefaults: false, // Ensures Tailwind uses standard color formats (HEX/RGB)
    },
  };
  