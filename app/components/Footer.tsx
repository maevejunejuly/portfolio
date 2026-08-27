export default function Footer() {
  return (
    <div className="mt-14 flex flex-col gap-6 border-t border-line px-4 py-6 font-label text-label uppercase sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <span>© 2026 Maeve Chen</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
        <a
          href="mailto:maevechn@mit.edu"
          className="w-fit border-b border-line pb-0.5 normal-case tracking-normal"
        >
          maevechn@mit.edu
        </a>
        <a
          href="mailto:maevejunejuly@gmail.com"
          className="w-fit border-b border-line pb-0.5 normal-case tracking-normal hover:bg-inv-bg hover:text-inv-fg"
        >
          maevejunejuly@gmail.com
        </a>
      </div>
    </div>
  );
}
