/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        paper: "#FFFFFF",
        mist: "#F4F4F4",
        fog: "#F7F7F7",
        hairline: "#E5E5E5",
        accent: "#D4FF3F",
      },
      fontFamily: {
        heading: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        kicker: "0.12em",
      },
      lineHeight: {
        display: "0.95",
      },
      fontSize: {
        hero: ["clamp(3rem, 8vw, 7.5rem)", { lineHeight: "0.95" }],
      },
    },
  },
  plugins: [],
};
