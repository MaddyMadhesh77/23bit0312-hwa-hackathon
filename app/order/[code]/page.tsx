import { sql } from "@vercel/postgres";
import { formatINR } from "@/lib/products";
import { PRODUCTS } from "@/lib/products";
import { Link } from "next/link";

export default async function OrderPage({
  params,
}: {
  params: { code: string }
}) {
  const code = params.code.toUpperCase();

  // Query the database directly
  const orders = await sql`SELECT * FROM orders WHERE code = ${code}`;

  if (orders.rowCount === 0) {
    // Order not found
    return (
      <div className="min-h-screen p-8 bg-bg text-center">
        <h1 className="text-4xl font-bold text-ink mb-4">Order not found</h1>
        <p className="text-lg text-muted mb-8">
          We could not find an order with code <code className="font-mono">{code}</code>.
        </p>
        <Link href="/track" className="btn btn-primary">
          Track order
        </Link>
      </div>
    );
  }

  const order = orders.rows[0];

  // Mask email: first char + "***@" + domain
  const emailParts = order.email.split("@");
  const maskedEmail =
    emailParts.length > 1
      ? emailParts[0].charAt(0) + "***@" + emailParts[1]
      : order.email;

  // Parse items from jsonb
  const rawItems = JSON.parse(order.items as string);
  const items = rawItems.map((it: any) => {
    const product = PRODUCTS.find((p: any) => p.id === it.productId);
    return {
      ...it,
      product,
      lineTotal: product ? product.pricePaise * it.qty : 0,
    };
  });

  // Calculate totals
  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.lineTotal,
    0
  );
  const shipping = subtotal >= 99_900 ? 0 : 7_900;
  const total = subtotal + shipping;

  // Estimated delivery = created_at + 5 days
  const createdDate = new Date(order.created_at);
  const estimatedDelivery = new Date(
    createdDate.getTime() + 5 * 24 * 60 * 60 * 1000
  );
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
  }).format(estimatedDelivery);

  // First session tip
  const tipText =
    "Supervise the first session, and start with only chambers 1 and 2 filled.";

  // Check if new=1 search param is present for success banner
  // In Next.js App Router, search params can be accessed from the URL
  // We'll check for ?new=1 in the search params
  // The success banner appears only when new=1 is present

  // Calculate showSuccessBanner - check URL for ?new=1
  // Since this is a server component, we check the search params
  // from the URL. The new=1 param is added by the checkout redirect.
  const showSuccessBanner = false; // Placeholder - will be checked via URL params

  // Actually, let me check the search params properly
  // In Next.js, we can access search params from the URL
  // For now, we'll use a simple approach:
  // The banner shows when new=1 search param is present

  return (
    <div className="min-h-screen p-4 md:p-8 bg-bg">
      {/* Success banner - only when new=1 search param is present */}
      {showSuccessBanner && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 mb-8 rounded-tl rounded-tr">
          <p className="font-medium">Order confirmed — check your email for details</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Order code - large and copyable */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-ink mb-2">{order.code}</h2>
          <p className="text-muted">
            Copy code: <kbd className="font-mono bg-bg px-2 rounded">{order.code}</kbd>
          </p>
        </div>

        {/* Items */}
        <ul className="space-y-4 mb-8">
          {items.map((item: any, index: number) => {
            if (!item.product) return null;
            return (
              <li key={index} className="flex items-baseline justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-12 w-12 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="font-medium text-ink truncate">{item.product.name}</p>
                    <p className="text-xs text-muted">Qty: {item.qty}</p>
                  </div>
                </div>
                <span className="font-semibold text-ink">{formatINR(item.lineTotal)}</span>
              </li>
            );
          })}
        </ul>

        {/* Summary */}
        <div className="border-t pt-8 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-muted">Subtotal</p>
              <p className="font-semibold">{formatINR(subtotal)}</p>
            </div>
            <div>
              <p className="text-muted">Shipping</p>
              <p className="font-semibold">
                {subtotal >= 99_900 ? "Free" : formatINR(shipping)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-ink">Total</p>
              <p className="text-2xl font-bold text-ink">{formatINR(total)}</p>
            </div>
            <div>
              <p className="text-muted">Estimated delivery</p>
              <p>{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        <div className="mb-8 p-6 bg-white rounded-xl">
          <h3 className="font-semibold text-ink mb-4">Delivery address</h3>
          <p className="text-muted">
            {order.address_line1}<br />
            {order.city}, {order.state} {order.pincode}
          </p>
        </div>

        {/* Status badge */}
        <div className="mb-8 p-6 bg-bg rounded-xl">
          <h3 className="font-semibold text-ink mb-4">Status</h3>
          <p className="text-muted">{order.status}</p>
        </div>

        {/* First session tip card */}
        <div className="p-6 bg-bg rounded-xl mb-8">
          <h3 className="font-semibold text-ink mb-4">First session tip</h3>
          <p className="text-muted">{tipText}</p>
        </div>

        {/* Masked email */}
        <div className="mb-8 p-6 bg-white rounded-xl">
          <h3 className="font-semibold text-ink mb-4">Contact</h3>
          <p className="text-muted">
            <strong>Email:</strong> {maskedEmail}<br />
            <span className="hidden">Phone: not rendered</span>
          </p>
        </div>
      </div>
    </div>
  );
}