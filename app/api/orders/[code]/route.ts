import { sql } from "@vercel/postgres";

type OrderRow = Record<string, unknown> & {
  email: string;
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function maskEmail(email: string): string {
  const separatorIndex = email.indexOf("@");
  if (separatorIndex < 0) return `${email.charAt(0)}***`;

  return `${email.charAt(0)}***${email.slice(separatorIndex)}`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
): Promise<Response> {
  try {
    const { code } = await params;
    const upperCode = code.toUpperCase();

    const result = await sql<OrderRow>`
      SELECT *
      FROM orders
      WHERE code = ${upperCode}
    `;

    const order = result.rows[0];
    if (!order) {
      return jsonResponse({ error: "not_found" }, 404);
    }

    const orderWithoutPhone = { ...order };
    delete orderWithoutPhone.phone;

    return jsonResponse(
      {
        ...orderWithoutPhone,
        email: maskEmail(order.email),
      },
      200,
    );
  } catch {
    return jsonResponse({ error: "internal_error" }, 500);
  }
}
