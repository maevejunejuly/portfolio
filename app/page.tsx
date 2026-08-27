import Link from "next/link";
import MinesweeperCard from "./components/cards/MinesweeperCard";
import GanulaCard from "./components/cards/GanulaCard";
import CaravanCard from "./components/cards/CaravanCard";
import BlackVampireCard from "./components/cards/BlackVampireCard";
import DomeDecal from "./components/DomeDecal";
import Ruler from "./components/Ruler";
import Footer from "./components/Footer";

const ALSO = [
  { slug: "kintsugi", title: "Kintsugi", when: "2025" },
  { slug: "heat-island", title: "Heat Island Model", when: "2024" },
  { slug: "fastest-t-rider", title: "The Fastest T Rider", when: "Video" },
  { slug: "leetcode-srs", title: "LeetCode SRS", when: "—" },
];

const linkish =
  "relative inline-block after:absolute after:bottom-[0.08em] after:left-0 after:h-[2px] after:w-full after:origin-right after:scale-x-0 after:bg-fg after:transition-transform after:duration-300 after:ease-smooth hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100";

export default function Home() {
  return (
    <main className="relative mx-auto max-w-shell overflow-hidden px-4 pb-10 sm:px-7">
      <div className="flex items-baseline justify-between font-label text-label uppercase opacity-45">
        <span>Maeve Chen — selected work</span>
        <span>[FIG. 0] Cambridge / Brooklyn · MMXXVI</span>
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-1 items-start gap-x-8 gap-y-12 lg:grid-cols-[minmax(0,290px)_minmax(0,1fr)_minmax(0,400px)]">
        <div className="mx-auto w-full max-w-[340px] lg:mx-0 lg:max-w-none lg:pt-6">
          <MinesweeperCard />

          <div className="mt-10">
            <p className="font-label text-label uppercase opacity-45">Also in the catalog</p>
            <div className="mt-2">
              {ALSO.map((p) => (
                <Link
                  key={p.slug}
                  href={`/catalog?tag=${p.slug}`}
                  className="mx-[-8px] flex items-baseline justify-between gap-3 border-t border-line px-2 py-2 font-label text-label uppercase transition-colors duration-150 first:border-t-0 hover:bg-inv-bg hover:text-inv-fg"
                >
                  <span className="truncate">{p.title}</span>
                  <span className="whitespace-nowrap opacity-55">{p.when}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex flex-col gap-8 lg:pt-2">
          <CaravanCard />

          <div>
            <p className="max-w-[13.5em] font-hand text-[clamp(22px,2.5vw,31px)] leading-[1.3]">
              Hi, I&apos;m{" "}
              <Link href="/about" className={linkish}>
                Maeve
              </Link>
              .
              <br />A{" "}
              <Link href="/catalog?tag=engineering" className={linkish}>
                software engineer
              </Link>{" "}
              and{" "}
              <Link href="/catalog?tag=creative" className={linkish}>
                digital creative
              </Link>
            </p>

            <Link
              href="/catalog"
              className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-fg px-4 py-2 font-label text-label font-bold uppercase transition-colors duration-200 hover:bg-inv-bg hover:text-inv-fg"
            >
              All projects
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <GanulaCard />
          <BlackVampireCard />
        </div>
      </div>

      <div
        className="pointer-events-none relative -mt-8 select-none lg:-mt-[130px]"
        aria-hidden
      >
        <svg
          viewBox="0 0 1200 140"
          preserveAspectRatio="none"
          className="absolute bottom-[18px] left-0 h-[140px] w-full text-fg"
        >
          <path
            d="M0 128 C 180 127, 300 116, 470 108 S 760 90, 1200 86"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>

        <div className="flex justify-end">
          <DomeDecal className="mr-[-3%] w-[min(700px,76%)] text-fg opacity-[0.93] lg:mr-[-4%] lg:w-[56%]" />
        </div>
      </div>

      <div className="relative z-10 mt-2 flex items-end justify-between gap-6 font-label text-label uppercase opacity-45">
        <span>[FIG. 2] Bldg. 10 — recreated, 104 × 68 px</span>
        <span>Scale 1:1</span>
      </div>
      <Ruler className="mt-1 text-fg opacity-60" />

      <Footer />
    </main>
  );
}
