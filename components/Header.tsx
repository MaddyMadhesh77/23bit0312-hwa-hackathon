"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export default function Header() {
  // CartProvider is rendered in app/layout.tsx, so the live cart count is available.
  // If the provider is temporarily unavailable, use 0 as the fallback count.
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b bg-bg/90 backdrop-blur">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className={`font-display font-bold text-xl ${focusRing}`}>
          TickTail
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/product"
            className={`text-muted hover:text-ink ${focusRing}`}
          >
            Product
          </Link>
          <Link
            href="/planner"
            className={`text-muted hover:text-ink ${focusRing}`}
          >
            Planner
          </Link>
          <Link
            href="/track"
            className={`text-muted hover:text-ink ${focusRing}`}
          >
            Track
          </Link>
        </div>

        <Link href="/cart" className={`flex items-center ${focusRing}`}>
          Cart
          <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-ink">
            {cartCount}
          </span>
        </Link>
      </nav>
    </header>
  );
}
