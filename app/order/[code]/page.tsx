import Link from "next/link";
import { sql } from "@vercel/postgres";
import { formatINR } from "@/lib/products";

export const instant = false;

type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  unitPricePaise: number;
};

type OrderRow = {
  id: string;
  code: string;
  customer_name: string;
  email: string;
  address_line1: string;
  city: string;
  state: string;
  pincode: string;
  items: unknown;
  subtotal_paise: number;
  shipping_paise: number;
  total_paise: number;
  status: string;
  created_at: string | Date;
};

type OrderPageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function isOrderItem(value: unknown): value is OrderItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<OrderItem>;
  return (
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    typeof item.qty === "number" &&
    typeof item.unitPricePaise === "number"
  );
}

function parseOrderItems(value: unknown): OrderItem[] {
  let parsed = value;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }

  return Array.isArray(parsed) ? parsed.filter(isOrderItem) : [];
}

function maskEmail(email: string): string {
  const separatorIndex = email.indexOf("@");
  if (separatorIndex < 0) return `${email.charAt(0)}***`;

  return `${email.charAt(0)}***${email.slice(separatorIndex)}`;
}

export default async function OrderPage({
  params,
  searchParams,
}: OrderPageProps) {
  const [{ code: rawCode }, query] = await Promise.all([params, searchParams]);
  const code = rawCode.toUpperCase();

  const result = await sql<OrderRow>`
    SELECT
      id,
      code,
      customer_name,
      email,
      address_line1,
      city,
      state,
      pincode,
      items,
      subtotal_paise,
      shipping_paise,
      total_paise,
      status,
      created_at
    FROM orders
    WHERE code = ${code}
  `;

  const order = result.rows[0];

  if (!order) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/15 text-3xl">
          ?
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold text-ink">
          Order not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
          We couldn&apos;t find an order with code{" "}
          <code className="rounded-lg bg-white px-2 py-1 font-mono text-sm text-ink">
            {code}
          </code>
          . Check the code and try again.
        </p>
        <Link href="/track" className="btn btn-primary mt-8">
          Track an order
        </Link>
      </section>
    );
  }

  const items = parseOrderItems(order.items);
  const newParam = query.new;
  const showSuccessBanner =
    newParam === "1" ||
    (Array.isArray(newParam) && newParam.includes("1"));

  const createdAt = new Date(order.created_at);
  const estimatedDelivery = new Date(
    createdAt.getTime() + 5 * 24 * 60 * 60 * 1000,
  );
  const estimatedDeliveryLabel = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
  }).format(estimatedDelivery);
  const statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {showSuccessBanner && (
        <div
          role="status"
          className="mb-8 rounded-2xl border border-success/25 bg-success/10 px-5 py-4 text-success"
        >
          <p className="font-semibold">
            Order confirmed — check your email for details
          </p>
        </div>
      )}

      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
          Order code
        </p>
        <code
          title="Select and copy this code"
          aria-label={`Order code ${order.code}`}
          className="mt-3 block cursor-text select-all font-mono text-4xl font-bold tracking-wider text-ink sm:text-5xl"
        >
          {order.code}
        </code>
        <p className="mt-3 text-sm text-muted">
          Select and copy this code for support or tracking.
        </p>
      </section>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-ink/10 bg-white p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Items
              </h2>
              <span className="rounded-full bg-bg px-3 py-1 text-sm text-muted">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            <ul className="mt-5 divide-y divide-ink/10">
              {items.map((item, index) => (
                <li
                  key={`${item.productId}-${index}`}
                  className="grid gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      Quantity {item.qty} × {formatINR(item.unitPricePaise)}
                    </p>
                  </div>
                  <p className="font-semibold text-ink sm:text-right">
                    {formatINR(item.unitPricePaise * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-accent/30 bg-accent/10 p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              First session
            </h2>
            <p className="mt-2 leading-relaxed text-ink/80">
              Supervise the first session, and start with only chambers 1 and 2
              filled.
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-ink/10 bg-white p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              Order summary
            </h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium text-ink">
                  {formatINR(order.subtotal_paise)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-medium text-ink">
                  {order.shipping_paise === 0
                    ? "Free"
                    : formatINR(order.shipping_paise)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-ink/10 pt-4 text-base">
                <dt className="font-bold text-ink">Total</dt>
                <dd className="font-bold text-ink">
                  {formatINR(order.total_paise)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-ink/10 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-semibold text-ink">
                Status
              </h2>
              <span className="rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success">
                {statusLabel}
              </span>
            </div>
            <p className="mt-4 text-sm text-muted">
              Estimated delivery:{" "}
              <span className="font-medium text-ink">
                {estimatedDeliveryLabel}
              </span>
            </p>
          </section>

          <section className="rounded-3xl border border-ink/10 bg-white p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              Delivery address
            </h2>
            <address className="mt-4 not-italic leading-relaxed text-muted">
              <span className="block font-medium text-ink">
                {order.customer_name}
              </span>
              <span className="mt-1 block">{order.address_line1}</span>
              <span className="block">
                {order.city}, {order.state} {order.pincode}
              </span>
            </address>
            <p className="mt-4 border-t border-ink/10 pt-4 text-sm text-muted">
              Email:{" "}
              <span className="font-medium text-ink">
                {maskEmail(order.email)}
              </span>
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
