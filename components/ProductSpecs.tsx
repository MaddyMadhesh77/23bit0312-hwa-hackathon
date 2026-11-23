export default function ProductSpecs() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="rounded-2xl border bg-white/60 p-4">
        <h3 className="font-semibold">Materials</h3>
        <p className="text-sm text-muted">
          Food-safe silicone and TPE shell with a steel-reinforced base. No small
          detachable parts.
        </p>
      </div>

      <div className="rounded-2xl border bg-white/60 p-4">
        <h3 className="font-semibold">Sizes</h3>
        <p className="text-sm text-muted">
          S for 5–12 kg, M for 12–25 kg, L for 25–45 kg. When in doubt, size up.
        </p>
      </div>

      <div className="rounded-2xl border bg-white/60 p-4">
        <h3 className="font-semibold">Care</h3>
        <p className="text-sm text-muted">
          Trays and cups are top-rack dishwasher safe. Wipe the base with a damp
          cloth — never submerge the clockwork.
        </p>
      </div>

      <div className="rounded-2xl border bg-white/60 p-4">
        <h3 className="font-semibold">Safety</h3>
        <p className="text-sm text-muted">
          Dry treats only. Supervise the first session. Not a chew toy — remove it
          if your dog starts chewing the shell.
        </p>
      </div>

      <div className="rounded-2xl border bg-white/60 p-4 sm:col-span-2">
        <h3 className="font-semibold">How the mechanism works</h3>
        <p className="text-sm text-muted">
          One wind stores energy in a mainspring — the same mechanism as a kitchen
          timer, only geared for hour-by-hour releases. A governor and escapement
          meter that energy out at a steady rate, releasing one chamber roughly every
          45–60 minutes — about one per hour — until all six are open. No batteries,
          no electronics, nothing to charge.
        </p>
      </div>
    </div>
  );
}
