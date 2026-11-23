"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
      <h2 className="font-display text-4xl font-bold text-ink sm:text-5xl">
        Something chewed through a wire.
      </h2>
      <button type="button" onClick={() => reset()} className="btn btn-primary mt-8">
        Try again
      </button>
    </div>
  );
}
