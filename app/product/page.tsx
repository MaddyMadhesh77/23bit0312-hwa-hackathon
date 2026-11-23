import type { Metadata } from "next";
import ProductBuy from "@/components/ProductBuy";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "TickTail Starter Kit | TickTail",
  description:
    "Mechanical, battery-free tick control for dogs from 5 to 45 kg. Pick your size and start your TickTail routine.",
};

export default function ProductPage() {
  const kits = PRODUCTS.filter((product) => product.kind === "kit");

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
        your dog and we&apos;ll send everything you need to get started.
      </p>

      <ProductBuy kits={kits} />
    </div>
  );
}
