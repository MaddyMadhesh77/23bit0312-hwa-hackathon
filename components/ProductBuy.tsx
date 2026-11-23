"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatINR, getProduct } from "@/lib/products";
import type { Product } from "@/lib/products";

type ProductBuyProps = {
  kits: Product[];
};

const GALLERY_IMAGES = [
  "/images/hero.webp",
  "/images/exploded.webp",
  "/images/lifestyle.webp",
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

function StockBadge({ stock }: { stock: number }) {
  if (stock >= 10) return null;

  return (
    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-ink">
      Only {stock} left
    </span>
  );
}

export default function ProductBuy({ kits }: ProductBuyProps) {
  const { addItem, openDrawer } = useCart();
  const [selectedKit, setSelectedKit] = useState<Product>(kits[0]);
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState<"once" | "sub">("once");
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<number | null>(null);
  const refillIntro = getProduct("refill-intro")!;
  const traySet = getProduct("tray-set")!;

  useEffect(() => {
    return () => {
      if (addedTimer.current !== null) {
        window.clearTimeout(addedTimer.current);
      }
    };
  }, []);

  if (!selectedKit) {
    return <p className="text-muted">No kits are available right now.</p>;
  }

  function handleAddToCart() {
    addItem(selectedKit.id, qty);
    if (mode === "sub") {
      addItem("refill-intro", qty);
    }
    openDrawer();
    setAdded(true);

    if (addedTimer.current !== null) {
      window.clearTimeout(addedTimer.current);
    }

    addedTimer.current = window.setTimeout(() => {
      setAdded(false);
      addedTimer.current = null;
    }, 2000);
  }

  return (
    <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-2 md:gap-12">
      <section aria-label="Product gallery">
        <Image
          src={GALLERY_IMAGES[activeImage]}
          alt={selectedKit.name}
          width={800}
          height={600}
          className="h-auto w-full rounded-3xl border border-ink/10 bg-white object-cover"
        />

        <div className="mt-3 grid grid-cols-3 gap-3">
          {GALLERY_IMAGES.map((src, index) => {
            const isSelected = index === activeImage;

            return (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`Show product image ${index + 1}`}
                aria-pressed={isSelected}
                className={`overflow-hidden rounded-2xl border border-ink/10 bg-white transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                  isSelected ? "ring-2 ring-accent" : ""
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  width={240}
                  height={180}
                  className="h-auto w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </section>

      <section aria-label="Choose your TickTail kit">
        <fieldset>
          <legend className="text-sm font-semibold text-ink">Size</legend>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {kits.map((kit) => {
              const isSelected = kit.id === selectedKit.id;
              const weightRange = kit.weightRangeKg
                ? `${kit.weightRangeKg.join("–")} kg`
                : "";

              return (
                <button
                  key={kit.id}
                  type="button"
                  onClick={() => setSelectedKit(kit)}
                  aria-pressed={isSelected}
                  className={`rounded-2xl px-3 py-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                    isSelected
                      ? "border-2 border-primary bg-primary/10"
                      : "border border-muted/40 bg-white"
                  }`}
                >
                  <span className="block font-display text-xl font-bold text-ink">
                    {kit.id.slice(-1).toUpperCase()}
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {weightRange}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-7 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">Quantity</span>
          <div className="inline-flex items-center rounded-2xl border border-ink/15 bg-white">
            <button
              type="button"
              onClick={() => setQty((current) => Math.max(1, current - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="flex h-11 w-11 items-center justify-center rounded-l-2xl text-xl text-ink transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              −
            </button>
            <span
              aria-live="polite"
              className="w-12 text-center text-base font-semibold tabular-nums text-ink"
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((current) => Math.min(10, current + 1))}
              disabled={qty >= 10}
              aria-label="Increase quantity"
              className="flex h-11 w-11 items-center justify-center rounded-r-2xl text-xl text-ink transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-1 rounded-2xl border border-muted/40 p-1">
          <button
            type="button"
            onClick={() => setMode("once")}
            aria-pressed={mode === "once"}
            className={
              mode === "once"
                ? "flex-1 rounded-xl bg-primary px-4 py-2 font-semibold text-white"
                : "flex-1 rounded-xl px-4 py-2 text-muted"
            }
          >
            One-time
          </button>
          <button
            type="button"
            onClick={() => setMode("sub")}
            aria-pressed={mode === "sub"}
            className={
              mode === "sub"
                ? "flex-1 rounded-xl bg-primary px-4 py-2 font-semibold text-white"
                : "flex-1 rounded-xl px-4 py-2 text-muted"
            }
          >
            Kit + monthly refills
          </button>
        </div>

        {mode === "sub" && (
          <p className="mt-3 text-sm text-muted">
            First refill ₹{refillIntro.pricePaise / 100} — usually{" "}
            <span className="line-through">₹399</span>, 15% off. Then ₹399/month,
            cancel anytime.
          </p>
        )}

        <div className="mt-7 flex items-center justify-between gap-3">
          <div>
            <span className="text-sm text-muted">Total</span>
            <p className="text-2xl font-bold text-ink">
              {formatINR(
                (selectedKit.pricePaise +
                  (mode === "sub" ? refillIntro.pricePaise : 0)) *
                  qty,
              )}
            </p>
          </div>
          <StockBadge stock={selectedKit.stock} />
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleAddToCart}
            aria-live="polite"
            className="rounded-2xl bg-accent px-6 py-3 font-semibold text-ink transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-muted/30 p-3">
          <div>
            <p className="text-sm font-semibold">Need spares?</p>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-muted">
                {traySet.name} · {formatINR(traySet.pricePaise)}
              </p>
              <StockBadge stock={traySet.stock} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              addItem("tray-set", 1);
              openDrawer();
            }}
            className="rounded-xl border border-primary px-4 py-1.5 text-sm font-semibold text-primary"
          >
            Add
          </button>
        </div>
      </section>
    </div>
  );
}
