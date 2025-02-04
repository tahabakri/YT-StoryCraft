import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
        colors: {
          border: "hsl(var(--border))",
          background: "hsl(var(--background))",
          youtube: {
  	          dark: '#0F0F0F',
  	          surface: '#1A1A1A',
  	          accent: '#FF4D79',
  	          secondary: '#6D6AFF',
  	          text: {
  	            primary: '#FFFFFF',
  	            secondary: '#AAAAAA'
  	          }
  	        }
  	      },
  	      animation: {
  	        'fade-in': 'fadeIn 300ms ease-in',
  	        'panel-slide': 'slideUp 400ms cubic-bezier(0.4, 0, 0.2, 1)'
  	      }
  	    }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
