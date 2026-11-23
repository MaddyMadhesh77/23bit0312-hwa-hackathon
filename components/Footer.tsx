import Link from "next/link";

const focusRing =
  "rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-bg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Mechanical. Battery-free. Built for real dogs.</p>
        <nav aria-label="Footer" className="flex items-center gap-5">
          <Link
            href="/support"
            className={`transition-colors hover:text-ink ${focusRing}`}
          >
            Support
          </Link>
          <Link
            href="/track"
            className={`transition-colors hover:text-ink ${focusRing}`}
          >
            Track order
          </Link>
        </nav>
      </div>
    </footer>
  );
}
