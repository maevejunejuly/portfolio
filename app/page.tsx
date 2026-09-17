import Link from "next/link";
import MinesweeperCard from "./components/cards/MinesweeperCard";
import SwaraluCard from "./components/cards/SwaraluCard";
import CaravanCard from "./components/cards/CaravanCard";
import BlackVampireCard from "./components/cards/BlackVampireCard";
import Footer from "./components/Footer";
import HoverField from "./components/HoverField";
import HalftoneField from "./components/HalftoneField";
import GemLogo from "./components/GemLogo";
import Handwritten from "./components/hover/Handwritten";
import SplitFlap from "./components/hover/SplitFlap";
import Smear from "./components/hover/Smear";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <HoverField className="relative z-10 mx-auto mt-16 grid w-full max-w-[440px] grid-cols-1 items-start gap-6 px-4 sm:mt-12 sm:px-7 lg:max-w-shell lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)_minmax(0,380px)] xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)_minmax(0,400px)]">
        <div data-push="1.1">
          <MinesweeperCard />
        </div>

        <div className="relative flex flex-col gap-6">
          <div data-push="1">
            <CaravanCard />
          </div>

          <div data-push="0.7" className="flex justify-center p-4">
            <div className="w-full max-w-[550px]">
              <p className="text-statement">
                Hi, I&apos;m{" "}
                <Handwritten href="/about">Maeve.</Handwritten>
                <br />
                A{" "}
                <SplitFlap href="/catalog?type=software,hardware">
                  software engineer
                </SplitFlap>
                <br />
                and{" "}
                <Smear href="/catalog?type=design,video,text">
                  digital creator.
                </Smear>
              </p>
              <p className="mt-4">
                I&apos;m currently searching for new grad SWE jobs in NYC and
                building{" "}
                <a
                  href="https://swaralu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-chip ml-0.5 inline-flex rotate-2 items-center gap-1.5 px-2.5 py-1 align-middle font-medium text-fg transition-transform duration-300 ease-smooth hover:rotate-0"
                >
                  <GemLogo size={18} active={false} color="#FFCC66" restFill="#14120f" restIcon="#FFCC66" />
                  Swaralu
                </a>
              </p>

              <Link
                href="/catalog"
                className="glass-chip ml-auto mt-6 flex w-fit items-center gap-2 px-4 py-2 kicker font-bold"
              >
                All projects
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div data-push="1">
            <SwaraluCard />
          </div>
          <div data-push="1">
            <BlackVampireCard />
          </div>
        </div>
      </HoverField>

      <div className="sm:-mt-48">
        <HalftoneField>
          <div className="mx-auto max-w-shell px-4 text-bg sm:px-7">
            <Footer />
          </div>
        </HalftoneField>
      </div>
    </main>
  );
}
