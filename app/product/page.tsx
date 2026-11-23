import EngagementTimeline from "@/components/EngagementTimeline";
import ProductBuy from "@/components/ProductBuy";
import ProductFAQ from "@/components/ProductFAQ";
import ProductSpecs from "@/components/ProductSpecs";
import { PRODUCTS } from "@/lib/products";

export const metadata = {
  title: "TickTail Starter Kit",
  description:
    "Six sealed chambers and six different puzzles. Designed for 2–6 hours of engagement, with chambers unlocking roughly every 45–60 minutes. Sizes S, M and L from ₹1,499.",
};

export default function ProductPage() {
  const kits = PRODUCTS.filter((product) => product.kind === "kit");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-4xl font-bold text-ink">TickTail</h1>
      <p className="mt-2 text-lg text-muted">
        Six puzzles. Designed for 2–6 hours. Zero batteries.
      </p>
      <ProductBuy kits={kits} />
      <h2 className="text-2xl font-bold mt-12">Six puzzles, one per hour</h2>
      <EngagementTimeline />
      <h2 className="text-2xl font-bold mt-12">Specs & safety</h2>
      <ProductSpecs />
      <h2 className="text-2xl font-bold mt-12">Questions, answered</h2>
      <ProductFAQ />
    </div>
  );
}
