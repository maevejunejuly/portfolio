import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogClient from "./CatalogClient";
import Footer from "../components/Footer";
import Ruler from "../components/Ruler";

export const metadata: Metadata = {
  title: "Catalog — Maeve Chen",
  description:
    "Every project — engineering and creative — filterable by tag, in three ways of looking at it.",
};

export default function Catalog() {
  return (
    <main className="mx-auto max-w-shell px-4 pb-10 sm:px-7">
      <div className="flex items-baseline justify-between font-label text-label uppercase opacity-45">
        <span>Catalog</span>
        <span>[FIG. 3] Index / Directory / Board</span>
      </div>

      <h1 className="mt-4 font-display text-[clamp(38px,7vw,86px)] uppercase leading-[0.88] tracking-wordmark">
        Everything
      </h1>
      <p className="mb-6 mt-3 max-w-prose text-body-lg opacity-70 [text-wrap:pretty]">
        Engineering and creative work in one place. Filter by tag, sort it, or drag it
        around — three ways of looking at the same set.
      </p>

      <Suspense
        fallback={
          <p className="py-20 text-center font-label text-label uppercase opacity-40">
            Loading catalog…
          </p>
        }
      >
        <CatalogClient />
      </Suspense>

      <Ruler className="mt-6 text-fg opacity-60" />
      <Footer />
    </main>
  );
}
