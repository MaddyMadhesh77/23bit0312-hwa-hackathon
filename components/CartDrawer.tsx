"use client";

import Link from "next/link";
import { useEffect } from "react";
import CartItems from "@/components/CartItems";
import { useCart } from "@/lib/cart";

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer } = useCart();

  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-bg shadow-xl transition-transform duration-200 ease-out"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-ink">Your cart</h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <CartItems />
        </div>

        <div className="space-y-2.5 border-t border-ink/10 px-5 py-4">
          <Link
            href="/cart"
            onClick={closeDrawer}
            className="btn w-full border border-ink/15 bg-white text-ink hover:bg-ink/5"
          >
            View cart
          </Link>
          <Link
            href="/checkout"
            onClick={closeDrawer}
            className="btn btn-primary w-full"
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
