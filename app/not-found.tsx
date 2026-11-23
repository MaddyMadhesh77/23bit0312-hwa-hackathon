import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
      <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">
        This page rolled under the sofa.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Go home
      </Link>
    </div>
  );
}
