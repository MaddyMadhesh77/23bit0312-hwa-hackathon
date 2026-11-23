"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function TrackOrderForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      setMessage("Please enter your order code.");
      return;
    }

    setMessage("");
    router.push(`/order/${normalizedCode}`);
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
          Order status
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Track your order
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
          Enter the order code from your confirmation to see delivery details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"
      >
        <label
          htmlFor="order-code"
          className="block text-sm font-semibold text-ink"
        >
          Order code
        </label>
        <input
          id="order-code"
          name="order-code"
          type="text"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            if (message) setMessage("");
          }}
          placeholder="TT-XXXXXX"
          autoCapitalize="characters"
          autoComplete="off"
          aria-describedby={message ? "order-code-message" : undefined}
          aria-invalid={message ? true : undefined}
          className="mt-2 w-full rounded-2xl border border-ink/15 bg-bg px-4 py-3 font-mono text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        {message && (
          <p
            id="order-code-message"
            role="alert"
            className="mt-2 text-sm text-error"
          >
            {message}
          </p>
        )}

        <button type="submit" className="btn btn-primary mt-6 w-full">
          Track order
        </button>
      </form>
    </section>
  );
}
