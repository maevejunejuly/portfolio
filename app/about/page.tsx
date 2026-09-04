import type { Metadata } from "next";
import Footer from "../components/Footer";
import ImageSlot from "../components/ImageSlot";
import { experience } from "../lib/content";

export const metadata: Metadata = {
  title: "About — Maeve Chen",
  description:
    "Maeve Chen — software engineer and MIT EECS undergraduate; New York-based video creator.",
};

export default function About() {
  return (
    <div className="mx-auto max-w-shell overflow-hidden text-fg">
      <div className="grid grid-cols-1 gap-12 px-4 pt-10 sm:px-7 lg:grid-cols-[300px_minmax(0,1fr)_244px] lg:gap-16">
        <div className="flex max-w-[320px] flex-col gap-8">
          <p className="text-meta leading-[1.7] opacity-70 [text-wrap:pretty]">
            Maeve Chen is a software engineer and a 4th year MIT undergraduate
            student studying Artificial Intelligence & Decision Making. She
            is searching for new grad roles in full-stack development, with a
            specialty in natural language processing, AI applications, and user design.
          </p>
          <div className="mt-1 flex flex-col gap-2.5 text-meta">
            <a
              href="mailto:maevechn@mit.edu"
              className="w-fit border-b border-line pb-0.5"
            >
              maevechn@mit.edu
            </a>
            <a
              href="https://github.com/maevejunejuly"
              className="w-fit"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://linkedin.com/in/maevechen"
              className="w-fit"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
            <a href="#" className="w-fit border-b border-fg pb-0.5 font-bold">
              Resume ↓
            </a>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          {experience.map((item) => (
            <div
              key={`${item.company} ${item.role}`}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_160px] items-baseline gap-x-8 border-t border-line py-3.5 first:border-t-0"
            >
              <span className="truncate text-meta font-medium">{item.company}</span>
              <span className="truncate text-meta opacity-70">{item.role}</span>
              <span className="whitespace-nowrap text-right text-label opacity-60">
                {item.when}
              </span>
            </div>
          ))}
        </div>

        <div className="relative aspect-[3/4] w-full max-w-[244px]">
          <ImageSlot placeholder="Portrait" className="h-full w-full" />
        </div>
      </div>

      <div className="px-4 pt-24 sm:px-7">
        <div className="flex max-w-[320px] flex-col gap-8">
          <p className="text-meta leading-[1.7] opacity-70 [text-wrap:pretty]">
            Maeve Chen is a New York-based video creator. She is probably
            pondering about linguistics, politics, queerness, or culture.
          </p>
          <div className="mt-1 flex flex-col gap-2.5 text-meta">
            <a
              href="mailto:maevejunejuly@gmail.com"
              className="w-fit border-b border-line pb-0.5"
            >
              maevejunejuly@gmail.com
            </a>
            <a
              href="https://www.tiktok.com/@maevejunejuly"
              className="w-fit"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok [17k] ↗
            </a>
            <a
              href="https://www.instagram.com/maevejunejuly"
              className="w-fit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Insta [11k] ↗
            </a>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
