import { assetUrl, select } from "./db";

export const TYPES = ["software", "hardware", "design", "video", "text"] as const;
export const TOPICS = [
  "education",
  "language",
  "accessibility",
  "media",
  "queerness",
  "fun",
] as const;

export type Type = (typeof TYPES)[number];
export type Topic = (typeof TOPICS)[number];

export const TYPE_GROUPS: Record<string, Type[]> = {
  engineering: ["software", "hardware"],
  creative: ["design", "video", "text"],
};

export type Project = {
  slug: string;
  title: string;
  year?: number;
  type: Type[];
  topic: Topic[];
  blurb: string;
  href?: string;
  cover?: string;
  coverSmall?: string;
  aspect: "square" | "portrait" | "landscape" | "video";
};

/** The case-study document, absent for projects that are just a catalog entry. */
export type ProjectPage = Project & {
  kicker?: string;
  headline?: string;
  overview: { label: string; value: string }[];
  body?: string;
};

type Row = {
  slug: string;
  title: string;
  year: number | null;
  type: Type[];
  topic: Topic[];
  blurb: string | null;
  href: string | null;
  cover: string | null;
  cover_small: string | null;
  aspect: Project["aspect"];
  kicker: string | null;
  headline: string | null;
  overview: { label: string; value: string }[] | null;
  body: string | null;
};

/** A leading "/" means a file still in public/; anything else lives in storage. */
function media(slug: string, file: string | null) {
  if (!file) return undefined;
  return file.startsWith("/") || /^https?:\/\//.test(file)
    ? file
    : assetUrl(slug, file);
}

function toPage(r: Row): ProjectPage {
  return {
    slug: r.slug,
    title: r.title,
    year: r.year ?? undefined,
    type: r.type ?? [],
    topic: r.topic ?? [],
    blurb: r.blurb ?? "",
    href: r.href ?? undefined,
    cover: media(r.slug, r.cover),
    coverSmall: media(r.slug, r.cover_small),
    aspect: r.aspect ?? "landscape",
    kicker: r.kicker ?? undefined,
    headline: r.headline ?? undefined,
    overview: r.overview ?? [],
    body: r.body ?? undefined,
  };
}

const FIELDS =
  "slug,title,year,type,topic,blurb,href,cover,cover_small,aspect,kicker,headline,overview,body";

export async function getProjects(): Promise<Project[]> {
  const rows = await select<Row>(
    `projects?select=${FIELDS}&published=is.true&order=position.asc,year.desc.nullslast,title.asc`,
  );
  return rows.map(toPage);
}

export async function getProject(slug: string): Promise<ProjectPage | null> {
  const rows = await select<Row>(
    `projects?select=${FIELDS}&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  );
  return rows[0] ? toPage(rows[0]) : null;
}
