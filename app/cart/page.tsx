"use client";

import Link from "next/link";
import CartItems from "@/components/CartItems";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { items, isHydrated } = useCart();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        Your cart
      </h1>

      {!isHydrated ? (
        <p className="mt-8 text-sm text-muted">Loading your cart…</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-ink/20 bg-white/60 px-6 py-12 text-center">
          <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Your cart is empty — meet TickTail
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
            One comfortable collar, one simple routine, no batteries. Find the
            size that fits your dog and we&apos;ll take it from there.
          </p>
          <Link href="/product" className="btn btn-primary mt-6">
            Meet TickTail
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <div className="rounded-3xl border border-ink/10 bg-white/60 px-5 py-5 sm:px-6 sm:py-6">
            <CartItems />
          </div>

          <Link
            href="/checkout"
            className="btn btn-primary mt-5 w-full text-base"
          >
            Proceed to checkout
          </Link>
        </div>
      )}
    </div>
  );
}
