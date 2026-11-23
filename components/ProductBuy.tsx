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

/** Subscription: 15% off refill-pack (39900 → 33900 rounded). */
const SUBSCRIPTION_REFILL_PAISE = 33900;
const ONE_TIME_REFILL_PAISE = 39900;

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

  // ---- Purchase toggle state ----
  const [purchaseMode, setPurchaseMode] = useState<'one-time' | 'subscription'>('one-time');
  // Refill qty: 1 for subscription, user-chosen for one-time
  const [refillQty, setRefillQty] = useState(1);

  // Prices
  const kitPricePaise = selected.pricePaise;
  const refillOneTimePaise = ONE_TIME_REFILL_PAISE; // 39900
  const refillSubscriptionPaise = SUBSCRIPTION_REFILL_PAISE; // 33900

  // Derived totals
  const kitTotalPaise = kitPricePaise * qty;
  const refillTotalPaise = refillQty * (purchaseMode === 'subscription'
    ? refillSubscriptionPaise
    : refillOneTimePaise);
  const combinedTotalPaise = kitTotalPaise + refillTotalPaise;
  const combinedTotalINR = formatINR(combinedTotalPaise);
  const kitINR = formatINR(kitPricePaise);
  const refillINR = formatINR(refillTotalPaise);

  // Effect to keep refillQty min 1
  useEffect(() => {
    if (refillQty < 1) setRefillQty(1);
  }, [refillQty]);

  function handleAddToCart() {
    if (!selected) return;
    // In subscription mode, add both the kit and the refill
    if (purchaseMode === 'subscription') {
      addItem(selected.id, 1);
      addItem('refill-pack', refillQty);
    } else {
      addItem(selected.id, qty);
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

  // Helper: generate a one-sentence skill description per hour tray
  const traySkills: Record<string, string> = {
    'Slide-lid tray': 'Sliding a lid reveals a hidden compartment, teaching dogs to investigate and use their nose to discover what\'s inside.',
    'Nose-flip flap': 'A spring-loaded flap that flips up when nudged, rewarding dogs for precise nose touches and timing.',
    'Roll-out ball maze': 'A ball that rolls out slowly when pushed, encouraging dogs to use their paw to control the pace of play.',
    'Scent-hide pocket': 'A pocket scented with natural herb aroma that taps into dogs\' instinct to track and follow scent trails.',
    'Lick-and-twist cup': 'A textured cup that dispenses treats when licked, soothing anxious dogs and promoting calm chewing behavior.',
    'Pull-the-tab drawer': 'A drawer that extends when a tab is pulled, teaching patience and rewarding dogs for controlled, deliberate movements.',
  };

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

        {/* Purchase mode toggle */}
        <div className="mt-4 rounded-2xl bg-bg p-3 mb-5">
          {/* One-time radio */}
          <label className="font-sm font-medium cursor-pointer">
            <input
              type="radio"
              name="purchase-mode"
              value="one-time"
              checked={purchaseMode === 'one-time'}
              onChange={() => setPurchaseMode('one-time')}
              className="hidden"
            />
            <span className="rounded-xl px-3 py-1.5 text-sm font-medium transition-colors {purchaseMode === 'one-time' && 'text-primary bg-primary/10'}">{'One-time'}</span>
          </label>
          {/* Subscription radio */}
          <label className="font-sm font-medium cursor-pointer">
            <input
              type="radio"
              name="purchase-mode"
              value="subscription"
              checked={purchaseMode === 'subscription'}
              onChange={() => setPurchaseMode('subscription')}
              className="hidden"
            />
            <span className="rounded-xl px-3 py-1.5 text-sm font-medium transition-colors {purchaseMode === 'subscription' && 'text-primary bg-primary/10'}">{'Kit + monthly refills'}</span>
          </label>
        </div>

        {/* Price area */}
        <div className="mt-6 rounded-2xl bg-white/70 p-4">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-muted">Kit price</span>
            <span className="text-3xl font-semibold tracking-tight text-ink tabular-nums">
              {kitINR}
            </span>
          </div>
          {/* Subscription refill pricing */}
          {purchaseMode === 'subscription' && (
            <div className="mt-2 flex items-baseline justify-between gap-2 text-sm">
              <span className="text-muted">Refill (subscription)</span>
              <span className="text-3xl font-semibold tracking-tight text-primary">
                {formatINR(refillSubscriptionPaise)}
              </span>
            </div>
          )}
          {purchaseMode !== 'subscription' && (
            <div className="mt-2 flex items-baseline justify-between gap-2 text-sm">
              <span className="text-muted">Refill (one-time)</span>
              <span className="text-3xl font-semibold text-error">
                {formatINR(refillOneTimePaise)}
              </span>
            </div>
          )}
          {/* Struck-through one-time refill price when in subscription mode */}
          {purchaseMode === 'subscription' && (
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <span className="text-muted text-xs line-through">
                {formatINR(refillOneTimePaise)}
              </span>
              <span className="text-xs text-muted">₹399 → ₹339</span>
            </div>
          )}
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <span>
              Total for {qty} {qty === 1 ? "kit" : "kits"}
            </span>
            <span className="text-3xl font-bold text-ink tabular-nums">
              {combinedTotalINR}
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
              ? selected.stock < 10
                ? `Only ${selected.stock} left`
                : `In stock · ${selected.stock} available`
              : "Out of stock"}
          </p>
        </div>
      </section>
    </div>
  );
}