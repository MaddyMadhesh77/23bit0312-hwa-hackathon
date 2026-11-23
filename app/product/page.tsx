import type { Metadata } from "next";
import ProductBuy from "@/components/ProductBuy";
import { PRODUCTS } from "@/lib/products";
import EngagementTimeline from "@/components/EngagementTimeline";

export const metadata: Metadata = {
  title: "TickTail Starter Kit | TickTail",
  description:
    "Mechanical, battery-free tick control for dogs from 5 to 45 kg. Pick your size and start your TickTail routine.",
};

export default function ProductPage() {
  const kits = PRODUCTS.filter((product) => product.kind === "kit");
  const selected = kits[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
        Shop
      </p>
      <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        Tick control that works without a battery.
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
        One comfortable collar, one simple routine. Choose the size that fits
        your dog and we'll send everything you need to get started.
      </p>

      <ProductBuy kits={kits} />

      {/* Specs section */}
      <section className="mt-12 space-y-6">
        <h2 className="font-display text-2xl font-semibold text-ink mb-4">Specs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Materials */}
          <div>
            <h3 className="font-medium text-ink mb-2">Materials</h3>
            <ul className="text-muted space-y-1">
              <li>Food-safe silicone & TPE</li>
              <li>Steel-reinforced base</li>
            </ul>
          </div>
          {/* Size ranges */}
          <div>
            <h3 className="font-medium text-ink mb-2">Size weight ranges</h3>
            <ul className="text-muted space-y-1">
              <li>S: 5–12 kg</li>
              <li>M: 12–25 kg</li>
              <li>L: 25–45 kg</li>
            </ul>
          </div>
          {/* Care */}
          <div>
            <h3 className="font-medium text-ink mb-2">Care</h3>
            <ul className="text-muted space-y-1">
              <li>Top-rack dishwasher safe</li>
            </ul>
          </div>
          {/* Safety */}
          <div>
            <h3 className="font-medium text-ink mb-2">Safety</h3>
            <ul className="text-muted space-y-1">
              <li>Dry treats only</li>
              <li>Supervise first use</li>
              <li>Not a chew toy</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Engagement timeline */}
      <EngagementTimeline />

      {/* FAQ accordion */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ink mb-4">Frequently asked questions</h2>
        <div className="space-y-2">
          {/* Is it really battery-free? */}
          <button
            aria-expanded="true"
            className="w-full text-left justify-between align-items-center rounded-2xl bg-bg p-4 hover:bg-bg/80 transition-colors font-medium text-ink"
          >
            Is it really battery-free?
            <svg
              className="w-4 h-4 rotate-180 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 10l5 5 5-5M7 15l5-5 5-5M7 20l5-5 5-5" />
            </svg>
          </button>
          <div className="hidden bg-white rounded-xl p-4 mt-1 text-muted">
            Yes. TickTail uses a wind-up clockwork mechanism — no batteries, no apps, no electronics. Just pure mechanical engagement that delivers six puzzle experiences over six hours.
          </div>

          {/* What treats can I use? */}
          <button
            aria-expanded="false"
            className="w-full text-left justify-between align-items-center rounded-2xl bg-bg p-4 hover:bg-bg/80 transition-colors font-medium text-ink"
          >
            What treats can I use?
            <svg
              className="w-4 h-4 rotate-0 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 10l5 5 5-5M7 15l5-5 5-5M7 20l5-5 5-5" />
            </svg>
          </button>
          <div className="hidden bg-white rounded-xl p-4 mt-1 text-muted">
            Dry treats only. Use small, dry kibble or treats that can fit through the collar opening. Avoid soft or moist treats that could clog the mechanism.
          </div>

          {/* Is it chew-proof? */}
          <button
            aria-expanded="false"
            className="w-full text-left justify-between align-items-center rounded-2xl bg-bg p-4 hover:bg-bg/80 transition-colors font-medium text-ink"
          >
            Is it chew-proof?
            <svg
              className="w-4 h-4 rotate-0 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 10l5 5 5-5M7 15l5-5 5-5M7 20l5-5 5-5" />
            </svg>
          </button>
          <div className="hidden bg-white rounded-xl p-4 mt-1 text-muted">
            No — it is not chew-proof. Supervise first use. If chewing starts, remove the collar and contact support@ticktail.in. The mechanism is designed for engagement, not destructive chewing.
          </div>

          {/* How do I clean it? */}
          <button
            aria-expanded="false"
            className="w-full text-left justify-between align-items-center rounded-2xl bg-bg p-4 hover:bg-bg/80 transition-colors font-medium text-ink"
          >
            How do I clean it?
            <svg
              className="w-4 h-4 rotate-0 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 10l5 5 5-5M7 15l5-5 5-5M7 20l5-5 5-5" />
            </svg>
          </button>
          <div className="hidden bg-white rounded-xl p-4 mt-1 text-muted">
            The collar is top-rack dishwasher safe. Remove the electronic components (none — it's mechanical) and wash on the top rack. Wipe the exterior with a damp cloth and mild soap. Allow to air dry completely before use.
          </div>

          {/* Which size should I pick? */}
          <button
            aria-expanded="false"
            className="w-full text-left justify-between align-items-center rounded-2xl bg-bg p-4 hover:bg-bg/80 transition-colors font-medium text-ink"
          >
            Which size should I pick?
            <svg
              className="w-4 h-4 rotate-0 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 10l5 5 5-5M7 15l5-5 5-5M7 20l5-5 5-5" />
            </svg>
          </button>
          <div className="hidden bg-white rounded-xl p-4 mt-1 text-muted">
            Measure your dog's weight. Small (S): 5–12 kg, Medium (M): 12–25 kg, Large (L): 25–45 kg. Each kit size fits its weight range. Not sure? Visit /planner for a personalised recommendation based on your dog's weight and energy level.
          </div>
        </div>
      </section>
    </div>
  );
}