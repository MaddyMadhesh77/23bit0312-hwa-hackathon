"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

const focusRing =
  "rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export default function Header() {
  const { cartCount } = useCart();
  const itemLabel = cartCount === 1 ? "item" : "items";

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="TickTail home"
          className={`font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl ${focusRing}`}
        >
          TickTail
        </Link>

        <nav aria-label="Main" className="flex items-center gap-4 sm:gap-7">
          <Link
            href="/product"
            className={`text-sm font-medium text-muted transition-colors hover:text-ink sm:text-base ${focusRing}`}
          >
            Product
          </Link>
          <Link
            href="/planner"
            className={`text-sm font-medium text-muted transition-colors hover:text-ink sm:text-base ${focusRing}`}
          >
            Planner
          </Link>
          <Link
            href="/track"
            className={`text-sm font-medium text-muted transition-colors hover:text-ink sm:text-base ${focusRing}`}
          >
            Track order
          </Link>
        </nav>

        <Link
          href="/cart"
          aria-label={`Cart, ${cartCount} ${itemLabel}`}
          className={`relative -mr-1 inline-flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-primary ${focusRing}`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2.5 3.5h2.2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.2l1.4-7.2H5.2" />
          </svg>
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold leading-none text-ink"
          >
            {cartCount}
          </span>
        </Link>
      </div>
    </header>
  );
}
