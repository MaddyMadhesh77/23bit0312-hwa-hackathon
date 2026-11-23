import EngagementTimeline from "@/components/EngagementTimeline";
import ProductBuy from "@/components/ProductBuy";
import ProductFAQ from "@/components/ProductFAQ";
import ProductSpecs from "@/components/ProductSpecs";
import { PRODUCTS } from "@/lib/products";

export const metadata = {
  title: "TickTail Starter Kit",
  description:
    "Six sealed chambers, six different puzzles, one clockwork timer. Sizes S, M and L from ₹1,499.",
};

export default function ProductPage() {
  const kits = PRODUCTS.filter((product) => product.kind === "kit");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-4xl font-bold text-ink">TickTail</h1>
      <p className="mt-2 text-lg text-muted">
        Six puzzles. Six hours. Zero batteries.
      </p>
      <ProductBuy kits={kits} />
      <h2 className="text-2xl font-bold mt-12">Six hours of play, unlocked</h2>
      <EngagementTimeline />
      <h2 className="text-2xl font-bold mt-12">Specs & safety</h2>
      <ProductSpecs />
      <h2 className="text-2xl font-bold mt-12">Questions, answered</h2>
      <ProductFAQ />
    </div>
  );
}
