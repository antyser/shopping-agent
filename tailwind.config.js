module.exports = {
  content: [
    "./src/**/*.{html,js}", // Keep for potential HTML/JS files
    "./src/components/**/*.{ts,tsx}", // Target UI components
    "./src/content/components/**/*.{ts,tsx}", // Target content script components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#140722", // Text-primary from Figma
        secondary: "#65686C", // Secondary-text-color from Figma
        figma: {
          "primary-text-color": "#050505",
          "icon-tertiary": "#594173",
          "border-primary": "#EAE7EE",
          "text-secondary": "#2B0F49",
          "primary-button": "#8C55FF",
          "bg-secondary": "#FFFFFF",
          "secondary-text-color": "#65686C",
          "pink-500": "#FF4AA1", // Also used as Badge/pink
          "text-primary": "#140722",
          "primary-500": "#6F2BFF", // Gradient component
          "general-white": "#FFFFFF",
          divider: "#C9CCD1",
          "input-bg": "#F7F4FA",
          "gradient-light-purple": "#BD9DFF", // Gradient component
          "gradient-light-pink": "#FFC7E2", // Gradient component
          "gray-subtle": "#D9D9D9",
        },
      },
      fontFamily: {
        sans: ["SF Pro Text", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
