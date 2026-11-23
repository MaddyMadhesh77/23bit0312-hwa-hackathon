"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart";
import { formatINR, PRODUCTS } from "@/lib/products";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export default function CartItems() {
  const { items, setQty, removeItem } = useCart();

  const lines = items.flatMap((item) => {
    const product = PRODUCTS.find((candidate) => candidate.id === item.productId);
    return product ? [{ item, product }] : [];
  });

  if (lines.length === 0) {
    return null;
  }

  const subtotalPaise = lines.reduce(
    (total, { item, product }) => total + product.pricePaise * item.qty,
    0,
  );

  return (
    <div>
      <ul className="divide-y divide-ink/10">
        {lines.map(({ item, product }) => (
          <li key={product.id} className="flex gap-4 py-4 first:pt-0">
            <Image
              src={product.image}
              alt={product.name}
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-2xl border border-ink/10 bg-white object-cover"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink sm:text-base">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted sm:text-sm">
                    {formatINR(product.pricePaise)} each
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-ink sm:text-base">
                  {formatINR(product.pricePaise * item.qty)}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="inline-flex items-center rounded-xl border border-ink/15 bg-white">
                  <button
                    type="button"
                    onClick={() => setQty(product.id, item.qty - 1)}
                    aria-label={`Decrease quantity of ${product.name}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-l-xl text-base text-ink transition-colors hover:bg-ink/5 ${focusRing}`}
                  >
                    −
                  </button>
                  <span
                    aria-live="polite"
                    aria-label={`${product.name} quantity ${item.qty}`}
                    className="w-8 text-center text-sm font-semibold tabular-nums text-ink"
                  >
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(product.id, item.qty + 1)}
                    aria-label={`Increase quantity of ${product.name}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-r-xl text-base text-ink transition-colors hover:bg-ink/5 ${focusRing}`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  aria-label={`Remove ${product.name} from cart`}
                  className={`rounded-lg px-2 py-1 text-xs font-medium text-muted underline-offset-2 transition-colors hover:text-error hover:underline ${focusRing}`}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-baseline justify-between border-t border-ink/10 pt-4">
        <span className="text-sm font-semibold text-ink">Subtotal</span>
        <span className="text-lg font-semibold tabular-nums text-ink">
          {formatINR(subtotalPaise)}
        </span>
      </div>
    </div>
  );
}
