import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        surface: "var(--surface)",
        line: "var(--line)",
        line2: "var(--line2)",
        "inv-bg": "var(--inv-bg)",
        "inv-fg": "var(--inv-fg)",
        // Ganula's own palette, so the definition popup matches the real app.
        ganula: {
          ink: "var(--ganula-ink)",
          paper: "var(--ganula-paper)",
          muted: "var(--ganula-muted)",
          rule: "var(--ganula-rule)",
          gold: "var(--ganula-gold)",
        },
        // Exact RGB565 values from the PSoC firmware's sprites.h / display.c.
        psoc: {
          panel: "#BDBEBD", // COL_WIN95 0xBDF7
          face: "#C5C2C5", // sprite cell face 0xC618
          hi: "#FFFFFF", // COL_HUDHI
          sh: "#838183", // COL_HUDSH 0x8410
          led: "#FF0000", // 0xF800
          smiley: "#FFDE00", // 0xFEE0
          cursor: "#FFFF00", // 0xFFE0
          lens: "#414041", // 0x4208
        },
        // Sampled from the Caravan hi-fi screens.
        caravan: {
          cream: "#fdf6dd",
          olive: "#6f8b2a",
          orange: "#e08a1e",
          rust: "#8a4a17",
          pink: "#ef6f9c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        label: ["var(--font-label)", "ui-monospace", "monospace"],
        hand: ["var(--font-hand)", "cursive"],
        bricolage: ["var(--font-bricolage)", "sans-serif"],
        telugu: ["var(--font-telugu)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      // Type ramp — replaces the design-canvas per-element pixel sizes.
      fontSize: {
        label: ["0.72rem", { lineHeight: "1", letterSpacing: "0.1em" }], // ~11.5px kickers, meta, footer
        nav: ["0.79rem", { lineHeight: "0.875rem", letterSpacing: "0.11em" }], // ~12.6px nav
        meta: ["0.825rem", { lineHeight: "1.2", letterSpacing: "0.08em" }], // ~13.2px meta values
        dek: ["0.9rem", { lineHeight: "1.6" }], // ~14.4px card deks
        body: ["0.975rem", { lineHeight: "1.6" }], // ~15.6px body / links
        "body-lg": ["1.05rem", { lineHeight: "1.7" }], // ~16.8px bio paragraphs
        "card-title": ["1.14rem", { lineHeight: "1.02", letterSpacing: "-0.025em" }], // ~18.2px note-card heads
      },
      spacing: {
        nav: "46px", // sticky nav height (also mirrored-name sticky offset)
        card: "26px", // note-card padding
        gutter: "18px", // intra-card gap
      },
      letterSpacing: {
        display: "-0.045em",
        wordmark: "-0.055em",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.2,.7,.3,1)",
      },
      maxWidth: {
        shell: "1440px",
        prose: "520px",
      },
    },
  },
  plugins: [],
} satisfies Config;
