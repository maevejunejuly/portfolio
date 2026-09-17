import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "../../components/CaseStudy";
import { getProject, getProjects } from "../../lib/projects";

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

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return <CaseStudy project={project} />;
}
