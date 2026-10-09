import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          base: "#0B192C",
          surface: "#101828",
          accent: "#1E2E4F",
          deep: "#061426",
        },
        gold: {
          DEFAULT: "#D4AF37",
          regal: "#D4AF37",
          champagne: "#E5C378",
          light: "#F7E7CE",
        },
        porcelain: "#FDFBF7",
        cream: "#E4EAF6",
        navy: "#0D0E3A",
        rose: "#CC3366",
      },
      fontFamily: {
        playfair: ["Playfair Display", "Georgia", "serif"],
        jakarta: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        pinyon: ["Pinyon Script", "cursive"],
        cormorant: ["Cormorant Garamond", "serif"],
        caudex: ["Caudex", "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        gold: "0 8px 24px -4px rgba(212, 175, 55, 0.28)",
        "gold-lg": "0 12px 28px -2px rgba(212, 175, 55, 0.45)",
        card: "0 12px 32px -8px rgba(3, 8, 16, 0.6), 0 2px 8px 0 rgba(212, 175, 55, 0.08)",
        invitation: "rgba(0, 0, 0, 0.2) 0px 15px 35px 0px",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        xxl: "32px",
        xxxl: "40px",
        section: "52px",
        band: "80px",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
