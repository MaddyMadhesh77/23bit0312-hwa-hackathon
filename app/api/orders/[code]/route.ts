import { sql, type QueryResult } from "@vercel/postgres";

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const upperCode = code.toUpperCase();

  try {
    const result: QueryResult = await sql`
      SELECT * FROM orders WHERE code = ${upperCode}
    `;

    const orders = result.rows;

    if (!orders || orders.length === 0) {
      return new Response(JSON.stringify({ error: "not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const order = orders[0];

    // Mask email: first char + "***@" + domain
    const emailMasked = order.email
      .split("@")
      .map((part: string) => (part ? part[0] + "***" : part))
      .join("@");

    // Omit phone field
    const { phone, ...orderWithoutPhone } = order;

    return new Response(
      JSON.stringify({
        ...orderWithoutPhone,
        email: emailMasked,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    // Database not configured - return 404
    return new Response(JSON.stringify({ error: "not_found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
}