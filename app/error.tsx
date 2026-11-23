"use client";

import Link from "next/link";

export default function Error() {
  return (
    <div className="min-h-screen bg-bg p-8 text-center">
      <h1 className="text-4xl font-display font-bold text-ink mb-4">
        Something went wrong.
      </h1>
      <p className="text-2xl text-muted mb-8">
        Don't panic — click below to reset and try again.
      </p>
      <div className="space-y-4 max-w-md mx-auto">
        <Link
          href="/"
          className="btn btn-primary"
        >
          Return home
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-accent"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}