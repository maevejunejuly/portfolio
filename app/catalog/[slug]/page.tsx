import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "../../components/CaseStudy";
import Footer from "../../components/Footer";
import ImageSlot from "../../components/ImageSlot";
import { getProject, getProjects, type Project } from "../../lib/projects";

// Must be a literal: Next parses this statically. Keep in step with db.ts.
export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: `${project.title} — Maeve Chen`, description: project.blurb };
}

function linkLabel({ href, type }: Project) {
  if (!href) return null;
  if (href.includes("github.com")) return "GitHub";
  if (type.includes("video")) return "Watch";
  if (type.includes("design")) return "Mockup";
  return "Visit";
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  if (project.body) return <CaseStudy project={project} />;

  const label = linkLabel(project);

  return (
    <main className="mx-auto flex min-h-svh max-w-shell flex-col px-4 pb-10 sm:px-7">
      <div className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
        <div className="flex flex-col gap-6">
          <h1 className="text-statement">{project.title}</h1>
          <p className="max-w-[46ch] text-meta opacity-70 [text-wrap:pretty]">
            {project.blurb}
          </p>
          {project.year && <div className="kicker">{project.year}</div>}
          {label && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit rounded-full border border-fg px-4 py-2 kicker font-bold transition-colors duration-200 hover:bg-inv-bg hover:text-inv-fg"
            >
              {label} ↗
            </a>
          )}
        </div>

        <div className="relative aspect-[4/3] w-full">
          <ImageSlot src={project.cover} placeholder={project.title} fit="contain" />
        </div>
      </div>

      <div className="mt-auto pt-14">
        <Footer />
      </div>
    </main>
  );
}
