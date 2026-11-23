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

      {/* 3D Tower Scene - driven by engagement timeline */}

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
    </div>
  );
}