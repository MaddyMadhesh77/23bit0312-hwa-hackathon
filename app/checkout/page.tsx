"use client";

import { useContext, useRef, useState } from "react";
import Link from "next/link";
import { CartContext } from "@/lib/cart";
import { CreateOrderSchema } from "@/lib/order-schema";
import { formatINR, getProduct } from "@/lib/products";

export default function CheckoutPage() {
  const { items, clearCart } = useContext(CartContext) || {};
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const idempotencyKeyRef = useRef<string | null>(null);
  const [values, setValues] = useState<{
    name: string;
    email: string;
    phone: string;
    address_line1: string;
    city: string;
    state: string;
    pincode: string;
  }>({
    name: "",
    email: "",
    phone: "",
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const rawCart = (items || []).map((it) => {
    const prod = getProduct(it.productId);
    return prod ? { item: it, product: prod } : null;
  }).filter(Boolean);

  if (!items || items.length === 0 || !rawCart) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-12">
        <div className="text-center">
          <p className="text-2xl font-medium text-muted mb-4">Your cart is empty</p>
          <p className="text-muted">Your cart is empty — meet TickTail</p>
          <Link href="/product" className="btn btn-primary mt-6">Browse Products</Link>
        </div>
      </div>
    );
  }

  const cartItems = rawCart as Array<{ item: any; product: any }>;
  const subtotal = cartItems.reduce((t, { item, product }) => t + product.pricePaise * item.qty, 0);
  const shipping = subtotal >= 99_900 ? 0 : 7_900;
  const total = subtotal + shipping;
  const shipText = subtotal >= 99_900 ? "Free" : "₹79";

  const okForm = () => {
    const F = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      address_line1: values.address_line1,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
      items: cartItems.map((c) => ({ productId: c.item.productId, qty: c.item.qty })),
      idempotencyKey: idempotencyKeyRef.current ?? "",
    };
    const R = CreateOrderSchema.safeParse(F);
    if (!R.success) {
      const E: Record<string, string> = {};
      R.error.issues.forEach((i) => { E[i.path.join(".")] = i.message; });
      setFormErrors(E);
      setSubmitState("idle");
      return false;
    }
    setFormErrors({});
    return true;
  };

  const hChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name: n } = e.target;
    setValues((p) => ({ ...p, [n]: value }));
    setFormErrors((P) => ({ ...P, [n]: "" }));
  };

  if (!items || items.length === 0 || !rawCart) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-12">
        <div className="text-center">
          <p className="text-2xl font-medium text-muted mb-4">Your cart is empty</p>
          <p className="text-muted">Your cart is empty — meet TickTail</p>
          <Link href="/product" className="btn btn-primary mt-6">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-display font-semibold text-ink mb-6">Order Details</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-1">Name</label>
                <input id="name" name="name" type="text" value={values.name} onChange={hChange} required className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 transition-colors focus:outline-none focus:border-primary sm:text-sm" />
                {formErrors.name && <p className="mt-1 text-sm text-error">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-1">Email</label>
                <input id="email" name="email" type="email" value={values.email} onChange={hChange} required className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 transition-colors focus:outline-none focus:border-primary sm:text-sm" />
                {formErrors.email && <p className="mt-1 text-sm text-error">{formErrors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-1">Phone</label>
                <input id="phone" name="phone" type="tel" value={values.phone} onChange={hChange} required className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 transition-colors focus:outline-none focus:border-primary sm:text-sm" />
                {formErrors.phone && <p className="mt-1 text-sm text-error">{formErrors.phone}</p>}
              </div>
              <div>
                <label htmlFor="address_line1" className="block text-sm font-medium text-1">Address Line 1</label>
                <input id="address_line1" name="address_line1" type="text" value={values.address_line1} onChange={hChange} required className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 transition-colors focus:outline-none focus:border-primary sm:text-sm" />
                {formErrors.address_line1 && <p className="mt-1 text-sm text-error">{formErrors.address_line1}</p>}
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-1">City</label>
                <input id="city" name="city" type="text" value={values.city} onChange={hChange} required className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 transition-colors focus:outline-none focus:border-primary sm:text-sm" />
                {formErrors.city && <p className="mt-1 text-sm text-error">{formErrors.city}</p>}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-1">State</label>
                <input id="state" name="state" type="text" value={values.state} onChange={hChange} required className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 transition-colors focus:outline-none focus:border-primary sm:text-sm" />
                {formErrors.state && <p className="mt-1 text-sm text-error">{formErrors.state}</p>}
              </div>
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-1">Pincode</label>
                <input id="pincode" name="pincode" type="text" value={values.pincode} onChange={hChange} required className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 transition-colors focus:outline-none focus:border-primary sm:text-sm" />
                {formErrors.pincode && <p className="mt-1 text-sm text-error">{formErrors.pincode}</p>}
              </div>
              <button type="submit" disabled={submitState !== "idle"} className="w-full rounded-2xl bg-primary py-3 px-4 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {submitState === "submitting" ? "Placing order…" : "Place Order"}
              </button>
            </form>
          </div>
          <div>
            <h2 className="text-2xl font-display font-semibold text-ink">Order Summary</h2>
            <div className="border rounded-2xl p-5 bg-white">
              <ul className="space-y-3 text-left">
                {cartItems.map(({ item, product }) => (
                  <li key={product.id} className="flex items-baseline justify-between">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="h-12 w-12 rounded-2xl object-cover" />
                      <div>
                        <p className="font-medium text-ink truncate">{product.name}</p>
                        <p className="text-xs text-muted">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-ink">{formatINR(product.pricePaise * item.qty)}</span>
                  </li>
                ))}
                <li><span className="font-medium text-ink">Subtotal</span><span className="font-semibold text-ink">{formatINR(subtotal)}</span></li>
                <li><span className="font-medium text-ink">Shipping</span><span className="font-semibold text-ink">{shipText}</span></li>
                <li className="border-t pt-4 flex items-baseline justify-between"><span>Total</span><strong className="text-2xl font-bold text-ink">{formatINR(total)}</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}