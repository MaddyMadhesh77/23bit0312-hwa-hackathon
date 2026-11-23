import { getProduct } from "./products";

export type CartLine = {
  productId: string;
  qty: number;
};

export type PricingLine = {
  productId: string;
  name: string;
  qty: number;
  unitPricePaise: number;
};

export type OutOfStockLine = {
  productId: string;
  stock: number;
};

export type PricingResult = {
  unknownIds: string[];
  outOfStock: OutOfStockLine[];
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
  lines: PricingLine[];
};

export function computeTotals(items: CartLine[]): PricingResult {
  const unknownIds: string[] = [];
  const outOfStock: OutOfStockLine[] = [];
  const lines: PricingLine[] = [];
  let subtotalPaise = 0;

  for (const item of items) {
    const product = getProduct(item.productId);

    if (!product) {
      unknownIds.push(item.productId);
      continue;
    }

    const qty = item.qty;
    const unitPricePaise = product.pricePaise;

    if (qty > product.stock) {
      outOfStock.push({ productId: item.productId, stock: product.stock });
    }

    subtotalPaise += qty * unitPricePaise;
    lines.push({
      productId: item.productId,
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
