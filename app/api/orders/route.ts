import { sql } from "@vercel/postgres";
import { customAlphabet } from "nanoid";
import { ensureOrdersTable } from "@/lib/db";
import { CreateOrderSchema } from "@/lib/order-schema";
import { computeTotals } from "@/lib/pricing";

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const customNanoid = customAlphabet(ALPHABET, 6);

type OrderSummaryRow = {
  id: string;
  code: string;
  total_paise: number;
  status: string;
  created_at: string | Date;
};

type DatabaseError = {
  code?: string;
  constraint?: string;
  message?: string;
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isIdempotencyConflict(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const databaseError = error as DatabaseError;
  return (
    databaseError.code === "23505" &&
    (databaseError.constraint === "orders_idempotency_key_key" ||
      databaseError.message?.includes("idempotency_key") === true)
  );
}

function orderSummary(order: OrderSummaryRow) {
  return {
    orderId: order.id,
    code: order.code,
    total: order.total_paise,
    status: order.status,
    createdAt: order.created_at,
  };
}

export async function POST(request: Request): Promise<Response> {
  try {
    await ensureOrdersTable();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "invalid_json" }, 400);
    }

    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      const issues = Object.fromEntries(
        parsed.error.issues.map((issue) => [
          issue.path.join(".") || "_root",
          issue.message,
        ]),
      );
      return jsonResponse({ error: "validation", issues }, 400);
    }

    const validated = parsed.data;
    const totals = computeTotals(validated.items);

    if (totals.unknownIds.length > 0) {
      return jsonResponse(
        { error: "unknown_products", ids: totals.unknownIds },
        404,
      );
    }

    if (totals.outOfStock.length > 0) {
      return jsonResponse(
        { error: "out_of_stock", items: totals.outOfStock },
        409,
      );
    }

    const code = `TT-${customNanoid()}`;

    try {
      const inserted = await sql<OrderSummaryRow>`
        INSERT INTO orders (
          code, customer_name, email, phone,
          address_line1, city, state, pincode,
          items, subtotal_paise, shipping_paise, total_paise,
          status, idempotency_key
        ) VALUES (
          ${code}, ${validated.name}, ${validated.email}, ${validated.phone},
          ${validated.address_line1}, ${validated.city}, ${validated.state}, ${validated.pincode},
          ${JSON.stringify(totals.lines)}, ${totals.subtotalPaise}, ${totals.shippingPaise}, ${totals.totalPaise},
          'confirmed', ${validated.idempotencyKey}
        )
        RETURNING id, code, total_paise, status, created_at
      `;

      const order = inserted.rows[0];
      return jsonResponse(orderSummary(order), 201);
    } catch (error) {
      if (!isIdempotencyConflict(error)) throw error;

      const existing = await sql<OrderSummaryRow>`
        SELECT id, code, total_paise, status, created_at
        FROM orders
        WHERE idempotency_key = ${validated.idempotencyKey}
      `;

      const order = existing.rows[0];
      if (!order) throw error;

      return jsonResponse(orderSummary(order), 200);
    }
  } catch {
    return jsonResponse({ error: "internal_error" }, 500);
  }
}
