"use client";

import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { z } from "zod";
import { useCart } from "@/lib/cart";
import { CreateOrderSchema } from "@/lib/order-schema";
import { PRODUCTS, formatINR } from "@/lib/products";

type CheckoutFormValues = Pick<
  z.infer<typeof CreateOrderSchema>,
  "name" | "email" | "phone" | "address_line1" | "city" | "state" | "pincode"
>;

const inputClass =
  "mt-2 w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-primary focus:outline-none";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [values, setValues] = useState<CheckoutFormValues>({
    name: "",
    email: "",
    phone: "",
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const cartLines = items.flatMap((item) => {
    const product = PRODUCTS.find(
      (candidate) => candidate.id === item.productId,
    );

    return product ? [{ item, product }] : [];
  });

  const subtotalPaise = cartLines.reduce(
    (subtotal, { item, product }) =>
      subtotal + product.pricePaise * item.qty,
    0,
  );
  const shippingPaise = subtotalPaise >= 99900 ? 0 : 7900;
  const totalPaise = subtotalPaise + shippingPaise;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Your cart is empty
        </h1>
        <p className="mt-3 text-muted">
          Your cart is empty — meet TickTail
        </p>
        <Link
          href="/product"
          onClick={clearCart}
          className="btn btn-primary mt-6"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <section>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Checkout
          </h1>

          <form className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-ink"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-sm text-error"></p>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-ink"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-sm text-error"></p>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-ink"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-sm text-error"></p>
            </div>

            <div>
              <label
                htmlFor="address_line1"
                className="block text-sm font-medium text-ink"
              >
                Address line 1
              </label>
              <input
                id="address_line1"
                name="address_line1"
                type="text"
                value={values.address_line1}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-sm text-error"></p>
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-ink"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={values.city}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-sm text-error"></p>
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-ink"
              >
                State
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={values.state}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-sm text-error"></p>
            </div>

            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-ink"
              >
                Pincode
              </label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                inputMode="numeric"
                value={values.pincode}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-sm text-error"></p>
            </div>
          </form>
        </section>

        <aside>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Order summary
          </h2>

          <div className="mt-5 rounded-3xl border border-ink/10 bg-white p-5 sm:p-6">
            <ul className="space-y-4">
              {cartLines.map(({ item, product }) => (
                <li
                  key={product.id}
                  className="flex items-baseline justify-between gap-4"
                >
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
                <dd className="font-medium text-ink">
                  {formatINR(subtotalPaise)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-medium text-ink">
                  {shippingPaise === 0 ? "Free" : formatINR(shippingPaise)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-ink/10 pt-4 text-base">
                <dt className="font-bold text-ink">Total</dt>
                <dd className="font-bold text-ink">
                  {formatINR(totalPaise)}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
