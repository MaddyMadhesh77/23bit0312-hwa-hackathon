"use client";

import Link from "next/link";
import CartItems from "@/components/CartItems";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { items, isHydrated } = useCart();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {!isHydrated ? (
        <p className="text-center text-sm text-muted">Loading your cart…</p>
      ) : items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-xl text-ink">
            Your cart is empty — meet TickTail
          </p>
          <Link href="/product" className="btn btn-primary mt-6">
            Meet TickTail
          </Link>
        </div>
      ) : (
        <>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Your cart
          </h1>

          <div className="mt-6 rounded-3xl border border-ink/10 bg-white/60 px-5 py-5 sm:px-6 sm:py-6">
            <CartItems />
          </div>

          <Link
            href="/checkout"
            className="btn btn-primary mt-6 w-full text-base"
          >
            Proceed to checkout
          </Link>
        </>
      )}
    </div>
  );
}
