"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/products";
import type { Product } from "@/lib/products";

type ProductBuyProps = {
  kits: Product[];
};

const GALLERY = [
  {
    src: "/images/hero.webp",
    alt: "TickTail Starter Kit collar and refill tin on a warm neutral background",
  },
  {
    src: "/images/exploded.webp",
    alt: "TickTail Starter Kit shown apart: collar, refill tray and treat refills",
  },
  {
    src: "/images/lifestyle.webp",
    alt: "A happy dog wearing a TickTail Starter Kit collar outdoors",
  },
] as const;

const SIZE_LABELS = ["S", "M", "L"] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

function weightLabel(kit: Product): string {
  if (!kit.weightRangeKg) return "";
  return `${kit.weightRangeKg[0]}–${kit.weightRangeKg[1]} kg`;
}

export default function ProductBuy({ kits }: ProductBuyProps) {
  const { addItem, openDrawer } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedId, setSelectedId] = useState(kits[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<number | null>(null);

  const selected = kits.find((kit) => kit.id === selectedId) ?? kits[0];

  useEffect(() => {
    return () => {
      if (addedTimer.current !== null) {
        window.clearTimeout(addedTimer.current);
      }
    };
  }, []);

  if (!selected) {
    return (
      <p className="text-muted">This product is not available right now.</p>
    );
  }

  function handleAddToCart() {
    if (!selected) return;
    addItem(selected.id, qty);
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
      {/* Gallery */}
      <section aria-label="Product images">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-ink/10 bg-white">
          <Image
            src={GALLERY[activeImage].src}
            alt={GALLERY[activeImage].alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {GALLERY.map((image, index) => {
            const isActive = index === activeImage;
            return (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`Show image ${index + 1}: ${image.alt}`}
                aria-pressed={isActive}
                className={`relative aspect-square overflow-hidden rounded-2xl border-2 bg-white transition-colors ${focusRing} ${
                  isActive
                    ? "border-primary ring-2 ring-primary/25"
                    : "border-ink/10 hover:border-primary/50"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Buy panel */}
      <section aria-label="Choose your kit">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
          TickTail Starter Kit
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {selected.name}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          {selected.description}
        </p>

        {/* Size selector */}
        <fieldset className="mt-7">
          <legend className="text-sm font-semibold text-ink">
            Size
            <span className="ml-2 font-normal text-muted">
              pick your dog&apos;s weight range
            </span>
          </legend>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {kits.map((kit, index) => {
              const isSelected = kit.id === selected.id;
              return (
                <button
                  key={kit.id}
                  type="button"
                  onClick={() => setSelectedId(kit.id)}
                  aria-pressed={isSelected}
                  className={`rounded-2xl border-2 px-3 py-4 text-center transition-colors ${focusRing} ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-ink/15 bg-white text-ink hover:border-primary/60"
                  }`}
                >
                  <span className="block font-display text-xl font-semibold">
                    {SIZE_LABELS[index] ?? kit.id}
                  </span>
                  <span
                    className={`mt-1 block text-xs ${
                      isSelected ? "text-white/85" : "text-muted"
                    }`}
                  >
                    {weightLabel(kit)}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Quantity stepper */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-semibold text-ink">Quantity</span>
          <div className="inline-flex items-center rounded-2xl border border-ink/15 bg-white">
            <button
              type="button"
              onClick={() => setQty((current) => Math.max(1, current - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className={`flex h-11 w-11 items-center justify-center rounded-l-2xl text-xl text-ink transition-colors hover:bg-ink/5 disabled:text-ink/30 ${focusRing}`}
            >
              −
            </button>
            <span
              aria-live="polite"
              aria-label={`Quantity ${qty}`}
              className="w-12 text-center text-base font-semibold tabular-nums text-ink"
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((current) => Math.min(10, current + 1))}
              disabled={qty >= 10}
              aria-label="Increase quantity"
              className={`flex h-11 w-11 items-center justify-center rounded-r-2xl text-xl text-ink transition-colors hover:bg-ink/5 disabled:text-ink/30 ${focusRing}`}
            >
              +
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="mt-6 rounded-2xl bg-white/70 p-4">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-muted">Price</span>
            <span className="text-3xl font-semibold tracking-tight text-ink tabular-nums">
              {formatINR(selected.pricePaise)}
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-4 text-sm text-muted">
            <span>
              Total for {qty} {qty === 1 ? "kit" : "kits"}
            </span>
            <span className="tabular-nums">
              {formatINR(selected.pricePaise * qty)}
            </span>
          </div>
        </div>

        {/* Add to cart */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleAddToCart}
            aria-live="polite"
            className="btn btn-primary w-full text-base"
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
          <p className="mt-3 text-center text-sm text-muted">
            {selected.stock > 0
              ? `In stock · ${selected.stock} available`
              : "Out of stock"}
          </p>
        </div>
      </section>
    </div>
  );
}
