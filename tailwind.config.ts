import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  // Case-study layout classes are written in markdown stored in Supabase, so
  // the scanner never sees them. Keep every `case-*` component rule.
  safelist: [{ pattern: /^case-/ }],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        surface: "var(--surface)",
        line: "var(--line)",
        "inv-bg": "var(--inv-bg)",
        "inv-fg": "var(--inv-fg)",
        overlay: "var(--overlay)",
        "overlay-ink": "var(--overlay-ink)",
        status: {
          unknown: "var(--status-unknown)",
          tracking: "var(--status-tracking)",
        },
        swaralu: {
          ink: "var(--swaralu-ink)",
          paper: "var(--swaralu-paper)",
          muted: "var(--swaralu-muted)",
          rule: "var(--swaralu-rule)",
        },
        yt: {
          text: "#0f0f0f",
          meta: "#606060",
        },
        caravan: {
          pink: "#ef6f9c",
          cream: "#fefae0",
          olive: "#697a21",
          moss: "#83992b",
          orange: "#f29812",
          star: "#ffda0c",
          water: "#5db7fb",
          land: "#f8ebda",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        bricolage: ["var(--font-bricolage)", "sans-serif"],
        telugu: ["var(--font-telugu)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        math: ["var(--font-math)", "serif"],
        roboto: ["var(--font-roboto)", "Roboto", "Arial", "sans-serif"],
      },
      fontSize: {
        statement: ["clamp(32px, 4.5vw, 56px)", { lineHeight: "1.12", letterSpacing: "-0.03em" }],
        label: ["14px", { lineHeight: "1.2", letterSpacing: "0.06em" }],
        meta: ["14px", { lineHeight: "1.6" }],
        dek: ["14px", { lineHeight: "1.6" }],
        "card-title": ["14px", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        prose: ["16px", { lineHeight: "1.7" }],
        section: ["clamp(24px, 2.6vw, 32px)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        sub: ["19px", { lineHeight: "1.35", letterSpacing: "-0.015em" }],
      },
      letterSpacing: {
        display: "-0.045em",
        wordmark: "-0.055em",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.2,.7,.3,1)",
      },
      borderRadius: {
        card: "14px",
      },
      maxWidth: {
        shell: "1440px",
        body: "720px",
      },
    },
  },
  plugins: [],
} satisfies Config;
