"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useCart } from "@/lib/cart";
import { CreateOrderSchema } from "@/lib/order-schema";
import { PRODUCTS, formatINR } from "@/lib/products";

const CustomerSchema = CreateOrderSchema.pick({
  name: true,
  email: true,
  phone: true,
  address_line1: true,
  city: true,
  state: true,
  pincode: true,
});

type FieldName =
  | "name"
  | "email"
  | "phone"
  | "address_line1"
  | "city"
  | "state"
  | "pincode";

type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const FIELDS: {
  name: FieldName;
  label: string;
  type: string;
  autoComplete: string;
  inputMode?: "numeric" | "tel" | "email" | "text";
  maxLength: number;
}[] = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name", maxLength: 80 },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email", maxLength: 120 },
  { name: "phone", label: "Phone (10 digits)", type: "tel", autoComplete: "tel-national", inputMode: "tel", maxLength: 10 },
  { name: "address_line1", label: "Address", type: "text", autoComplete: "address-line1", maxLength: 120 },
  { name: "city", label: "City", type: "text", autoComplete: "address-level2", maxLength: 60 },
  { name: "state", label: "State", type: "text", autoComplete: "address-level1", maxLength: 60 },
  { name: "pincode", label: "Pincode", type: "text", autoComplete: "postal-code", inputMode: "numeric", maxLength: 6 },
];

const FIELD_NAMES = FIELDS.map((field) => field.name);

const inputClass =
  "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-primary focus:outline-none";

function normalize(values: Values): Values {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.replace(/[\s-]/g, ""),
    address_line1: values.address_line1.trim(),
    city: values.city.trim(),
    state: values.state.trim(),
    pincode: values.pincode.replace(/\s/g, ""),
  };
}

function validate(values: Values): Errors {
  const result = CustomerSchema.safeParse(normalize(values));
  if (result.success) return {};

  const errors: Errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && FIELD_NAMES.includes(key as FieldName)) {
      const field = key as FieldName;
      if (!errors[field]) errors[field] = issue.message;
    }
  }
  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, hydrated } = useCart();

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // One key per checkout attempt, so a double click or retry never creates two orders.
  const idempotencyKey = useRef<string | null>(null);

  const cartLines = items.flatMap((item) => {
    const product = PRODUCTS.find((candidate) => candidate.id === item.productId);
    return product ? [{ item, product }] : [];
  });

  const subtotalPaise = cartLines.reduce(
    (subtotal, { item, product }) => subtotal + product.pricePaise * item.qty,
    0,
  );
  const shippingPaise = subtotalPaise === 0 || subtotalPaise >= 99900 ? 0 : 7900;
  const totalPaise = subtotalPaise + shippingPaise;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as FieldName;
    const value = event.target.value;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleBlur = (name: FieldName) => {
    if (values[name] === "") return;
    const message = validate(values)[name];
    setErrors((current) => ({ ...current, [name]: message }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || redirecting) return;

    setFormError(null);

    const clientErrors = validate(values);
    setErrors(clientErrors);

    const firstInvalid = FIELD_NAMES.find((name) => clientErrors[name]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    if (!idempotencyKey.current) {
      idempotencyKey.current = crypto.randomUUID();
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...normalize(values),
          items: items.map(({ productId, qty }) => ({ productId, qty })),
          idempotencyKey: idempotencyKey.current,
        }),
      });

      let data: Record<string, unknown> = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok && typeof data.code === "string") {
        setRedirecting(true);
        clearCart();
        router.push(`/order/${data.code}?placed=1`);
        return;
      }

      if (response.status === 400 && data.error === "validation") {
        const issues = (data.issues ?? {}) as Record<string, string>;
        const serverErrors: Errors = {};
        for (const name of FIELD_NAMES) {
          if (issues[name]) serverErrors[name] = issues[name];
        }
        setErrors(serverErrors);

        const first = FIELD_NAMES.find((name) => serverErrors[name]);
        if (first) {
          document.getElementById(first)?.focus();
        } else {
          setFormError("Something in your cart looks wrong. Please review it and try again.");
        }
        idempotencyKey.current = null;
      } else if (response.status === 400) {
        setFormError("We couldn't read that order. Please try again.");
        idempotencyKey.current = null;
      } else if (response.status === 404) {
        setFormError("An item in your cart is no longer available. Please review your cart.");
        idempotencyKey.current = null;
      } else if (response.status === 409) {
        const stockItems = (data.items ?? []) as { productId: string; stock: number }[];
        const names = stockItems
          .map((entry) => PRODUCTS.find((product) => product.id === entry.productId)?.name)
          .filter(Boolean)
          .join(", ");
        setFormError(
          names
            ? `Not enough stock for: ${names}. Please lower the quantity in your cart.`
            : "Some items are out of stock. Please review your cart.",
        );
        idempotencyKey.current = null;
      } else {
        setFormError("Something went wrong on our side. Your cart is safe, please try again.");
      }
    } catch {
      setFormError("Network problem. Check your connection and try again. Your cart is safe.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted">
        Loading checkout…
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center" role="status">
        <h1 className="font-display text-3xl font-semibold text-ink">Order placed</h1>
        <p className="mt-3 text-muted">Taking you to your confirmation…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Your cart is empty</h1>
        <p className="mt-3 text-muted">Add a TickTail to your cart to check out.</p>
        <Link href="/product" className="btn btn-primary mt-6">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <section>
          <h1 className="font-display text-3xl font-semibold text-ink">Checkout</h1>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            {formError && (
              <div
                role="alert"
                className="rounded-2xl border border-error/30 bg-error/5 p-4 text-sm text-error"
              >
                {formError}{" "}
                <Link href="/cart" className="font-medium underline">
                  Review cart
                </Link>
              </div>
            )}

            {FIELDS.map((field) => {
              const error = errors[field.name];
              return (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-ink">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    inputMode={field.inputMode}
                    autoComplete={field.autoComplete}
                    maxLength={field.maxLength}
                    value={values[field.name]}
                    onChange={handleChange}
                    onBlur={() => handleBlur(field.name)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${field.name}-error` : undefined}
                    className={`${inputClass} ${error ? "border-error" : "border-ink/15"}`}
                  />
                  {error && (
                    <p id={`${field.name}-error`} className="mt-1 text-sm text-error">
                      {error}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="rounded-2xl border border-ink/10 bg-white p-4 text-sm text-muted">
              <p className="font-medium text-ink">Payment: pay on delivery</p>
              <p className="mt-1">Demo checkout. No card details are needed.</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Placing order…" : `Place order · ${formatINR(totalPaise)}`}
            </button>
          </form>
        </section>

        <aside>
          <h2 className="font-display text-2xl font-semibold text-ink">Order summary</h2>

          <div className="mt-5 rounded-3xl border border-ink/10 bg-white p-5 sm:p-6">
            <ul className="space-y-4">
              {cartLines.map(({ item, product }) => (
                <li key={product.id} className="flex items-baseline justify-between gap-4">
                  <p className="text-sm text-ink">
                    {product.name} × {item.qty}
                  </p>
                  <p className="shrink-0 text-sm font-medium text-ink">
                    {formatINR(product.pricePaise * item.qty)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-ink/10 pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium text-ink">{formatINR(subtotalPaise)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-medium text-ink">
                  {shippingPaise === 0 ? "Free" : formatINR(shippingPaise)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-ink/10 pt-4 text-base">
                <dt className="font-bold text-ink">Total</dt>
                <dd className="font-bold text-ink">{formatINR(totalPaise)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}