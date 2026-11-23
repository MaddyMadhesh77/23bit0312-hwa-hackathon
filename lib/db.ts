import { sql } from "@vercel/postgres";

export async function ensureOrdersTable(): Promise<void> {
  if (!process.env.POSTGRES_URL) return;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      code text UNIQUE NOT NULL,
      customer_name text NOT NULL, email text NOT NULL, phone text NOT NULL,
      address_line1 text NOT NULL, city text NOT NULL, state text NOT NULL,
      pincode text NOT NULL,
      items jsonb NOT NULL,
      subtotal_paise integer NOT NULL, shipping_paise integer NOT NULL,
      total_paise integer NOT NULL,
      status text NOT NULL DEFAULT 'confirmed',
      idempotency_key text UNIQUE NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;
}
