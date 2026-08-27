export type Category = "engineering" | "creative";

export type Project = {
  slug: string;
  title: string;
  category: Category;
  date: string;
  sortDate: number;
  company: string;
  tags: string[];
  blurb: string;
  href?: string;
  src?: string;
  gallery?: string[];
  aspect?: "square" | "portrait" | "landscape" | "video";
};

export const projects: Project[] = [
  {
    slug: "ganula",
    title: "Ganula",
    category: "engineering",
    date: "May 2026 — now",
    sortDate: 202605,
    company: "Personal",
    tags: ["TypeScript", "Next.js", "Supabase", "NLP", "Chrome Extension"],
    blurb:
      "A sentence-mining workshop for Telugu learners: bring native video, get transcription, per-word dictionary lookup across C.P. Brown → Wiktionary → LLM, an n+1 comprehension score, and Anki cards out the other end.",
    href: "https://ganula.vercel.app",
    aspect: "landscape",
  },
  {
    slug: "minesweeper-psoc",
    title: "Minesweeper on PSoC 5LP",
    category: "engineering",
    date: "April — May 2026",
    sortDate: 202604,
    company: "MIT 6.115",
    tags: ["C", "Hardware", "PSoC", "Embedded", "SPI"],
    blurb:
      "A standalone Minesweeper console on a CY8CKIT-050: ILI9341 TFT over 8 MHz SPI, analog joystick input, a hardware-timer ISR for the clock, and high scores in on-chip EEPROM. No PC, no OS, no second processor.",
    src: "/media/minesweeper-board.jpg",
    gallery: ["/media/minesweeper-menu.jpg", "/media/minesweeper-schematic.svg"],
    aspect: "portrait",
  },
  {
    slug: "caravan",
    title: "Caravan",
    category: "engineering",
    date: "2025 — now",
    sortDate: 202503,
    company: "BU Forge Catalyst",
    tags: ["Figma", "Hackathon", "Elasticsearch", "Qdrant", "Docker"],
    blurb:
      "An identity-focused travel utility — find your place in the world. Started as a design-a-thon prototype built on user research (70% of respondents had faced safety concerns, 90% language barriers), now a hybrid BM25 + vector retrieval backend.",
    href: "https://www.figma.com/proto/L5R40xMulApXN7y8Ces77v/Caravan--BU-Forge-Catalyst-Design-a-thon?node-id=24-952",
    src: "/media/caravan-hero.png",
    gallery: [
      "/media/caravan-home.png",
      "/media/caravan-search.png",
      "/media/caravan-destination.png",
      "/media/caravan-log.png",
    ],
    aspect: "landscape",
  },
  {
    slug: "kintsugi",
    title: "Kintsugi",
    category: "engineering",
    date: "January 2025",
    sortDate: 202501,
    company: "Rice Design-A-Thon",
    tags: ["Figma", "Hackathon", "Product Design"],
    blurb:
      "A writing and self-improvement app for acquiring knowledge non-linearly — daily prompts feeding a growing knowledge tree. Built on a survey of 18 respondents, 38.9% of them outside college.",
    href: "https://www.figma.com/proto/4t0FGBwSUNvWVXd8pkba7n/Kintsugi--Rice-Design-A-Thon-2025?node-id=14-3214",
    src: "/media/kintsugi-hero.png",
    gallery: [
      "/media/kintsugi-prompt.png",
      "/media/kintsugi-tree.png",
      "/media/kintsugi-explore.png",
      "/media/kintsugi-profile.png",
    ],
    aspect: "landscape",
  },
  {
    slug: "heat-island",
    title: "Heat Island Model",
    category: "engineering",
    date: "January — February 2024",
    sortDate: 202401,
    company: "MIT Concrete Sustainability Hub",
    tags: ["MATLAB", "Data Science", "Climate"],
    blurb:
      "Urban heat island modelling as a data science researcher at the CSHub.",
    aspect: "landscape",
  },
  {
    slug: "leetcode-srs",
    title: "LeetCode SRS",
    category: "engineering",
    date: "",
    sortDate: 0,
    company: "Personal",
    tags: ["TypeScript", "Spaced Repetition"],
    blurb:
      "Spaced repetition for algorithm practice — schedule problems the way a language learner schedules vocabulary.",
    aspect: "landscape",
  },
  {
    slug: "black-vampire-media",
    title: "Black Vampire Media",
    category: "creative",
    date: "",
    sortDate: 0,
    company: "Self-published",
    tags: ["Video", "Essay", "Culture"],
    blurb: "A video essay.",
    href: "https://youtu.be/tyj3BLw83-0",
    src: "/media/black-vampire-poster.jpg",
    aspect: "video",
  },
  {
    slug: "fastest-t-rider",
    title: "The Fastest T Rider",
    category: "creative",
    date: "",
    sortDate: 0,
    company: "Self-published",
    tags: ["Documentary", "Challenge", "Video"],
    blurb:
      "Documenting the attempt on the record for visiting every MBTA subway station. A Brooklyn native's love of trains, transplanted to a much shorter system.",
    src: "/media/mbta-hero.png",
    gallery: ["/media/mbta-route.png"],
    aspect: "landscape",
  },
  {
    slug: "queer-boston-nightlife",
    title: "Boston Queer Nightlife",
    category: "creative",
    date: "",
    sortDate: 0,
    company: "Self-published",
    tags: ["Interview", "Queerness", "Video"],
    blurb: "An interview series on Boston's queer nightlife.",
    aspect: "landscape",
  },
  {
    slug: "queerness-series",
    title: "Queerness — Series",
    category: "creative",
    date: "",
    sortDate: 0,
    company: "TikTok / Instagram",
    tags: ["Video", "Queerness", "Series"],
    blurb: "An ongoing series on queerness, identity, and being visible online.",
    href: "https://www.tiktok.com/@maevejunejuly",
    aspect: "portrait",
  },
  {
    slug: "telugu-series",
    title: "Telugu — Series",
    category: "creative",
    date: "",
    sortDate: 0,
    company: "TikTok / Instagram",
    tags: ["Video", "Linguistics", "Series"],
    blurb:
      "Telugu, heritage, and the particular grief of losing a language you were supposed to inherit.",
    href: "https://www.tiktok.com/@maevejunejuly",
    aspect: "portrait",
  },
  {
    slug: "thoughts-series",
    title: "Thoughts — Series",
    category: "creative",
    date: "",
    sortDate: 0,
    company: "TikTok / Instagram",
    tags: ["Video", "Essay", "Series"],
    blurb: "Short-form thinking out loud about politics, culture, and the internet.",
    href: "https://www.tiktok.com/@maevejunejuly",
    aspect: "portrait",
  },
];

export const allTags = (() => {
  const counts = new Map<string, number>();
  for (const p of projects) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([t]) => t);
})();

export type SortKey = "date" | "title" | "company";

export function filterProjects(
  list: Project[],
  { category, tags, sort }: { category?: Category | null; tags?: string[]; sort?: SortKey },
) {
  let out = list;
  if (category) out = out.filter((p) => p.category === category);
  if (tags?.length) out = out.filter((p) => tags.every((t) => p.tags.includes(t)));

  const by: Record<SortKey, (a: Project, b: Project) => number> = {
    date: (a, b) => b.sortDate - a.sortDate || a.title.localeCompare(b.title),
    title: (a, b) => a.title.localeCompare(b.title),
    company: (a, b) => a.company.localeCompare(b.company) || a.title.localeCompare(b.title),
  };
  return [...out].sort(by[sort ?? "date"]);
}

export function resolveToken(token: string): {
  category: Category | null;
  tags: string[];
  slug: string | null;
} {
  if (token === "engineering" || token === "creative")
    return { category: token, tags: [], slug: null };
  if (projects.some((p) => p.slug === token)) return { category: null, tags: [], slug: token };
  const tag = allTags.find((t) => t.toLowerCase() === token.toLowerCase());
  return { category: null, tags: tag ? [tag] : [], slug: null };
}
