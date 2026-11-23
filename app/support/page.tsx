"use client";

import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="flex-1 bg-bg p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Shipping section */}
        <section className="mb-12">
          <h2 className="text-4xl font-display font-semibold text-ink mb-6">
            Shipping
          </h2>
          <div className="border rounded-xl p-6 bg-white space-y-4">
            <div>
              <p className="font-medium text-ink">Flat rate</p>
              <p className="text-2xl font-bold text-primary">₹79</p>
            </div>
            <div>
              <p className="font-medium text-ink">Free shipping</p>
              <p className="text-2xl font-bold text-primary">Over ₹999</p>
            </div>
            <div>
              <p className="font-medium text-ink">Delivery time</p>
              <p>3–5 business days</p>
            </div>
          </div>
        </section>

        {/* Returns section */}
        <section className="mb-12">
          <h2 className="text-4xl font-display font-semibold text-ink mb-6">
            Returns
          </h2>
          <div className="border rounded-xl p-6 bg-white space-y-4">
            <p>30-day return window</p>
            <p>Items must be unused</p>
            <p>Refund processed within 7 business days</p>
          </div>
        </section>

        {/* Contact section */}
        <section className="mb-12">
          <h2 className="text-4xl font-display font-semibold text-ink mb-6">
            Contact
          </h2>
          <div className="border rounded-xl p-6 bg-white space-y-4">
            <p className="font-medium text-ink">support@ticktail.in</p>
            <p className="font-medium text-ink">Response within 24 hours</p>
          </div>
        </section>

        {/* About section */}
        <section>
          <h2 className="text-4xl font-display font-semibold text-ink mb-6">
            About
          </h2>
          <div className="border rounded-xl p-6 bg-white">
            <p>
              TickTail uses a wind-up clockwork mechanism that delivers six
              different puzzle experiences over six hours — no batteries, no apps,
              just pure mechanical engagement designed for dogs who love to think.
            </p>
            <p>
              Each chamber unlocks a new skill, from scent tracking to paw-eye
              coordination, providing mental stimulation that tires dogs out
              without requiring electricity or Wi-Fi.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}