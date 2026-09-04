import { Suspense } from "react";
import CatalogClient from "./CatalogClient";
import Footer from "../components/Footer";
import { getProjects } from "../lib/projects";

// Must be a literal: Next parses this statically. Keep in step with db.ts.
export const revalidate = 60;

export default async function Catalog() {
  const projects = await getProjects();
  return (
    <main className="mx-auto max-w-[1760px] px-4 pb-40 sm:px-7 sm:pb-32">
      <Suspense fallback={null}>
        <CatalogClient projects={projects} />
      </Suspense>
      <div data-chrome className="overlay-invert chrome fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[1760px] px-4 sm:px-7">
        <Footer />
      </div>
    </main>
  );
}
