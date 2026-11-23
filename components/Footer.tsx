import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-8 text-center text-sm text-muted">
      <p>Mechanical. Battery-free. Built for real dogs.</p>
      <div className="mt-4 flex justify-center gap-5">
        <Link
          href="/support"
          className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Support
        </Link>
        <Link
          href="/track"
          className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Track order
        </Link>
      </div>
    </footer>
  );
}
