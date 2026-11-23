import { sql, type QueryResult } from "@vercel/postgres";
import { ensureOrdersTable } from "@/lib/db";
import { CreateOrderSchema } from "@/lib/order-schema";
import { computeTotals } from "@/lib/pricing";
import { customAlphabet } from "nanoid";
import { PRODUCTS } from "@/lib/products";

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const customNanoid = customAlphabet(ALPHABET, 6);

const POSTGRES_URL = process.env.POSTGRES_URL;

export async function POST(request: Request) {
  // 1. Ensure table exists
  await ensureOrdersTable();

  // 2. Parse body
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 3. Validate with Zod
  const result = CreateOrderSchema.safeParse(data);
  if (!result.success) {
    const issues: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      issues[path] = issue.message;
    });
    return new Response(
      JSON.stringify({ error: "validation", issues }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const validated = result.data;

  // 4. computeTotals
  const totals = computeTotals(validated.items);
  if (totals.unknownIds.length > 0) {
    return new Response(
      JSON.stringify({ error: "unknown_products", ids: totals.unknownIds }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  if (totals.outOfStock.length > 0) {
    return new Response(
      JSON.stringify({ error: "out_of_stock", items: totals.outOfStock }),
      {
        status: 409,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 5. Generate order code
  const code = "TT-" + customNanoid();

  // 6. INSERT order with idempotency
  const idempotencyKey = validated.idempotencyKey;
  const subtotalPaise = totals.subtotalPaise;
  const shippingPaise = totals.shippingPaise;
  const totalPaise = totals.totalPaise;

  if (!POSTGRES_URL) {
    return new Response(
      JSON.stringify({ orderId: 0, code, total: totalPaise, status: "confirmed", createdAt: new Date() }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await sql`
      INSERT INTO orders (
        code, customer_name, email, phone,
        address_line1, city, state, pincode,
        items, subtotal_paise, shipping_paise, total_paise,
        status, idempotency_key
      ) VALUES (
        ${code}, ${validated.name}, ${validated.email}, ${validated.phone},
        ${validated.address_line1}, ${validated.city}, ${validated.state}, ${validated.pincode},
        ${JSON.stringify(validated.items)}, ${subtotalPaise}, ${shippingPaise}, ${totalPaise},
        'confirmed', ${idempotencyKey}
      )
    `;
  } catch (e: any) {
    // Unique constraint violation on idempotency_key - fetch existing
    if (e.message && e.message.includes("unique constraint")) {
      const existing: QueryResult = await sql`
        SELECT * FROM orders WHERE idempotency_key = ${idempotencyKey}
      `;
      if (existing && existing.rows && existing.rows.length > 0) {
        const order = existing.rows[0];
        const emailMasked = order.email
          .split("@")
          .map((part: string) => (part ? part[0] + "***" : part))
          .join("@");
      const { phone, ...orderWithoutPhone } = order;
        return new Response(
          JSON.stringify({ orderId: order.id, code: order.code, total: order.total_paise, status: order.status, createdAt: order.created_at, email: emailMasked }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
    throw e;
  }

  // 7. On success return 201
  return new Response(
    JSON.stringify({ orderId: 0, code, total: totalPaise, status: "confirmed", createdAt: new Date() }),
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }
  );
}