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
        primary: "#E4EAF6",
        "on-primary": "#0D0E3A",
        canvas: "#FFFFFF",
        ink: "#E4EAF6",
        "accent-1": "#212529",
        "accent-2": "#CC3366",
        neutral: "#5A5A5A",
        navy: "#0D0E3A",
        cream: "#E4EAF6",
        rose: "#CC3366",
      },
      fontFamily: {
        pinyon: ["Pinyon Script", "cursive"],
        aboreto: ["Aboreto", "serif"],
        cormorant: ["Cormorant Garamond", "serif"],
        "cormorant-infant": ["Cormorant Infant", "serif"],
        caudex: ["Caudex", "serif"],
        poppins: ["Poppins", "sans-serif"],
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
      boxShadow: {
        "invitation": "rgba(0, 0, 0, 0.2) 0px 15px 35px 0px",
        "invitation-hover": "rgba(0, 0, 0, 0.16) 0px 28px 50px 0px",
        "btn-icon": "rgba(0, 0, 0, 0.12) 0px 2px 16px 0px, rgba(255, 255, 255, 0.8) 0px 1px 0px 0px inset",
        "btn-icon-sm": "rgba(255, 255, 255, 0.85) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.1) 0px 1px 4px 0px",
      },
      borderRadius: {
        none: "0px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
export default config;
