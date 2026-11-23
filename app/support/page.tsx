export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
        Support
      </h1>

      <div className="mt-10 space-y-8">
        <section className="rounded-3xl border border-ink/10 bg-white/60 p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Shipping
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Flat ₹79, free over ₹999. Dispatched in 24 hours, delivered in 3–5
            days.
          </p>
        </section>

        <section className="rounded-3xl border border-ink/10 bg-white/60 p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Returns
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            30-day returns on unused kits. Refills are final sale for hygiene.
          </p>
        </section>

        <section className="rounded-3xl border border-ink/10 bg-white/60 p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Contact
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Email support@ticktail.in — we reply within one working day.
          </p>
        </section>

        <section className="rounded-3xl border border-ink/10 bg-white/60 p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">
            About
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            TickTail is a clockwork puzzle tower: a wound spring and escapement
            unlock one of six puzzle trays per hour. No batteries, no apps — just
            engineering.
          </p>
        </section>
      </div>
    </div>
  );
}
