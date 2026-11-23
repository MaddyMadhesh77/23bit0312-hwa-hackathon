"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { planSession, type Energy } from "@/lib/planner";
import { PRODUCTS, formatINR } from "@/lib/products";

const ENERGY_OPTIONS: { label: string; value: Energy }[] = [
  { label: "Couch potato", value: "low" },
  { label: "Balanced", value: "medium" },
  { label: "Zoomies", value: "high" },
];

export default function DogPlanner() {
  const { addItem, openDrawer } = useCart();
  const [weightKg, setWeightKg] = useState(15);
  const [energy, setEnergy] = useState<Energy>("medium");
  const [hoursAlone, setHoursAlone] = useState(4);
  const [plan, setPlan] = useState<ReturnType<typeof planSession> | null>(null);

  const recommendedProduct = plan
    ? PRODUCTS.find(
        (product) => product.id === `ticktail-${plan.size.toLowerCase()}`,
      )
    : undefined;

  const handlePlan = () => {
    setPlan(planSession(weightKg, energy, hoursAlone));
  };

  const handleAddRecommendedKit = () => {
    if (!recommendedProduct) return;

    addItem(recommendedProduct.id, 1);
    openDrawer();
  };

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-ink/10 bg-white/70 p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label
              htmlFor="dog-weight"
              className="block text-sm font-semibold text-ink"
            >
              Weight (kg)
            </label>
            <input
              id="dog-weight"
              type="number"
              min={2}
              max={60}
              value={weightKg}
              onChange={(event) =>
                setWeightKg(
                  Math.min(60, Math.max(2, Number(event.target.value))),
                )
              }
              className="mt-2 w-full rounded-2xl border border-ink/15 bg-bg px-4 py-3 text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-ink">
              Energy level
            </legend>
            <div className="mt-2 grid gap-2">
              {ENERGY_OPTIONS.map((option) => {
                const selected = energy === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setEnergy(option.value)}
                    className={`rounded-2xl border px-4 py-3 text-left font-medium transition-colors ${
                      selected
                        ? "border-primary bg-primary/10 text-ink"
                        : "border-ink/15 bg-bg text-muted hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="hours-alone"
                className="text-sm font-semibold text-ink"
              >
                Hours alone
              </label>
              <output
                htmlFor="hours-alone"
                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
              >
                {hoursAlone} {hoursAlone === 1 ? "hour" : "hours"}
              </output>
            </div>
            <input
              id="hours-alone"
              type="range"
              min={1}
              max={10}
              value={hoursAlone}
              onChange={(event) => setHoursAlone(Number(event.target.value))}
              className="mt-5 w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        </div>

        <button type="button" onClick={handlePlan} className="btn btn-primary mt-8">
          Plan my dog&apos;s day
        </button>
      </section>

      {plan && recommendedProduct && (
        <div className="space-y-8">
          <section className="rounded-3xl border border-accent/30 bg-accent/10 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              Recommended kit
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
              {recommendedProduct.name}
            </h2>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted">
              <span>
                Weight range:{" "}
                <strong className="text-ink">
                  {recommendedProduct.weightRangeKg
                    ? `${recommendedProduct.weightRangeKg[0]}–${recommendedProduct.weightRangeKg[1]} kg`
                    : "See size guide"}
                </strong>
              </span>
              <span>
                Price:{" "}
                <strong className="text-ink">
                  {formatINR(recommendedProduct.pricePaise)}
                </strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddRecommendedKit}
              className="btn btn-primary mt-6"
            >
              Add recommended kit to cart
            </button>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Your session
            </h2>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {plan.chambers.map((chamber) => (
                <div
                  key={chamber.hour}
                  className="min-w-[160px] flex-1 rounded-2xl bg-primary/10 p-4"
                >
                  <p className="text-sm font-semibold text-ink">
                    Hour {chamber.hour} — {chamber.tray}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {plan.notes?.map((note) => (
            <p key={note} className="text-sm text-muted">
              {note}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
