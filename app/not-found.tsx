"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg p-8 text-center">
      <h1 className="text-5xl font-display font-bold text-ink mb-4">
        Woof! Page not found.
      </h1>
      <p className="text-2xl text-muted mb-8">
        Looks like you chased a tail that got away. But the good news is, you can
        always start over.
      </p>
      <div className="space-y-4 max-w-md mx-auto">
        <Link
          href="/"
          className="btn btn-primary"
        >
          Go home
        </Link>
        <Link
          href="/product"
          className="btn btn-accent"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}