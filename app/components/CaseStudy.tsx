import Link from "next/link";
import Footer from "./Footer";
import Toc from "./case-study/Toc";
import { renderCaseBody } from "../lib/case-md";
import type { ProjectPage } from "../lib/projects";

export default function CaseStudy({ project }: { project: ProjectPage }) {
  const { html, toc } = renderCaseBody(project.body ?? "", project.slug);

  const backLink = (
    <Link href="/catalog" className="kicker filter-opt">
      ← Catalog
    </Link>
  );

  return (
    <main
      className="mx-auto flex min-h-svh max-w-shell flex-col px-4 pb-10 sm:px-7"
      data-project={project.slug}
    >
      <div className="relative py-6">
        <aside className="absolute left-0 top-6 hidden h-full md:block">
          <div className="sticky top-24 flex flex-col items-start gap-6">
            {backLink}
            <Toc sections={toc} />
          </div>
        </aside>

        <div className="mx-auto w-full max-w-body">
          <div className="md:hidden">{backLink}</div>

          <div className="mt-6 kicker md:mt-0">
            {project.kicker ??
              [project.title, project.year].filter(Boolean).join(" · ")}
          </div>
          <h1 className="mt-4 text-statement [text-wrap:balance]">
            {project.headline ?? project.title}
          </h1>

          {project.cover && (
            <figure className={`case-media case-hero case-hero-${project.aspect}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.cover} alt={project.title} />
            </figure>
          )}

          {project.overview.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
              {project.overview.map(({ label, value }) => (
                <div key={label}>
                  <dt className="kicker opacity-55">{label}</dt>
                  <dd
                    className="mt-2 text-prose case-fact"
                    dangerouslySetInnerHTML={{ __html: value }}
                  />
                </div>
              ))}
            </dl>
          )}

          <div
            className="case-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <div className="mt-auto pt-14">
        <Footer />
      </div>
    </main>
  );
}
