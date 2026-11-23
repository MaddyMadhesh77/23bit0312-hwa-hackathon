import ProductBuy from "@/components/ProductBuy";
import { PRODUCTS } from "@/lib/products";

export default function ProductPage() {
  const kits = PRODUCTS.filter((product) => product.kind === "kit");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-4xl font-bold text-ink">TickTail</h1>
      <p className="mt-2 text-lg text-muted">
        Six puzzles. Six hours. Zero batteries.
      </p>
      <ProductBuy kits={kits} />
    </div>
  );
}
