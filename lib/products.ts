export type Product = {
  id: string;
  name: string;
  description: string;
  pricePaise: number;
  stock: number;
  image: string;
  kind: 'kit' | 'refill' | 'trays';
  weightRangeKg?: [number, number];
};

export const PRODUCTS: Product[] = [
  {
    id: 'ticktail-s',
    name: 'TickTail Starter Kit — S',
    description:
      'A complete tick-control starter kit for small dogs between 5 and 12 kg, with a comfortable collar and a full season of refills.',
    pricePaise: 149900,
    stock: 50,
    image: '/images/hero.webp',
    kind: 'kit',
    weightRangeKg: [5, 12],
  },
  {
    id: 'ticktail-m',
    name: 'TickTail Starter Kit — M',
    description:
      'A complete tick-control starter kit for medium dogs between 12 and 25 kg, with a comfortable collar and a full season of refills.',
    pricePaise: 179900,
    stock: 50,
    image: '/images/hero.webp',
    kind: 'kit',
    weightRangeKg: [12, 25],
  },
  {
    id: 'ticktail-l',
    name: 'TickTail Starter Kit — L',
    description:
      'A complete tick-control starter kit for large dogs between 25 and 45 kg, with a comfortable collar and a full season of refills.',
    pricePaise: 209900,
    stock: 50,
    image: '/images/hero.webp',
    kind: 'kit',
    weightRangeKg: [25, 45],
  },
  {
    id: 'refill-pack',
    name: 'Treat Refill Pack',
    description:
      'A pack of tasty refill treats that keep your TickTail collar working all season long. Fits every Starter Kit size.',
    pricePaise: 39900,
    stock: 200,
    image: '/images/hero.webp',
    kind: 'refill',
  },
  {
    id: 'tray-set',
    name: 'Replacement Tray Set',
    description:
      'A set of replacement trays for your TickTail station, so you can swap, clean and keep going without missing a day.',
    pricePaise: 59900,
    stock: 3,
    image: '/images/hero.webp',
    kind: 'trays',
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

export function formatINR(paise: number): string {
  return inrFormatter.format(paise / 100);
}
