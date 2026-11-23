import { PRODUCTS, getProduct } from "./products";

export interface PricingResult {
  unknownIds: string[];
  outOfStock: { productId: string; stock: number }[];
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
  lines: { productId: string; name: string; qty: number; unitPricePaise: number }[];
}

export interface CartLine {
  productId: string;
  qty: number;
}

export function computeTotals(items: CartLine[]): PricingResult {
  const unknownIds: string[] = [];
  const outOfStock: { productId: string; stock: number }[] = [];
  const lines: { productId: string; name: string; qty: number; unitPricePaise: number }[] = [];
  let subtotalPaise = 0;

  for (const line of items) {
    const product = getProduct(line.productId);
    if (!product) {
      unknownIds.push(line.productId);
      continue;
    }

    const unitPricePaise = product.pricePaise;
    const qty = line.qty;

    if (qty > product.stock) {
      outOfStock.push({ productId: line.productId, stock: product.stock });
    }

    subtotalPaise += unitPricePaise * qty;

    lines.push({
      productId: line.productId,
      name: product.name,
      qty,
      unitPricePaise,
    });
  }

  const shippingPaise = subtotalPaise >= 99900 ? 0 : 7900;
  const totalPaise = subtotalPaise + shippingPaise;

  return {
    unknownIds,
    outOfStock,
    subtotalPaise,
    shippingPaise,
    totalPaise,
    lines,
  };
}