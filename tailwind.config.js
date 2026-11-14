module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#07090f",
        slateCard: "#0d111c",
        slateElevated: "#131929",
        electricIndigo: "#6366f1",
        electricViolet: "#8b5cf6",
        emeraldPulse: "#10b981"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      boxShadow: {
        glow: "0 0 35px -5px rgba(99, 102, 241, 0.35)",
        emeraldGlow: "0 0 25px -5px rgba(16, 185, 129, 0.35)"
      }
    }
  },
  plugins: []
};
