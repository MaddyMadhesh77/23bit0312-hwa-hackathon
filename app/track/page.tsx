"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TrackPage() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleTrack = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setMessage("Please enter an order code");
      return;
    }
    setMessage("");
    router.push(`/order/${trimmed}`);
  }

  return (
    <div className="min-h-screen p-8 bg-bg text-center">
      <h1 className="text-4xl font-bold text-ink mb-8">Track your order</h1>

      <div className="max-w-md mx-auto">
        <div className="border rounded-2xl p-6 mb-8">
          <label htmlFor="order-code" className="block text-sm font-medium text-ink mb-2">
            Order code
          </label>
          <input
            id="order-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl text-ink focus:ring-2 focus:ring-primary"
            placeholder="TT-XXXXXX"
            aria-label="Order code"
          />
          {message && (
            <p className="text-error text-sm mt-2">{message}</p>
          )}
        </div>

        <button
          onClick={handleTrack}
          className="w-full rounded-2xl bg-primary py-3 px-4 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {code.trim() ? "Track Order" : "Enter order code"}
        </button>
      </div>
    </div>
  );
}