"use client";

import { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/products";
import {
  planSession,
  recommendSize,
  sizeDisplayText,
  sizeProductId,
  sizeWeightRange,
  Energy,
} from "@/lib/planner";

type EnergyBtn = "couch" | "balanced" | "zoomies";

const ENERGY_LABELS: Record<EnergyBtn, string> = {
  couch: "Couch potato",
  balanced: "Balanced",
  zoomies: "Zoomies",
};

const ENERGY_COLORS: Record<EnergyBtn, string> = {
  couch: "bg-bg/50 text-muted hover:text-ink",
  balanced: "bg-bg hover:text-ink",
  zoomies: "bg-primary/20 text-primary hover:bg-primary/30",
};

export type PlanSessionResult = ReturnType<typeof planSession>;

interface ChamberSegment {
  hour: number;
  tray: string;
  tip: string;
}

interface DogPlannerProps {
  defaultWeight?: number;
  defaultEnergy?: EnergyBtn;
  defaultHours?: number;
}

export default function DogPlanner({
  defaultWeight = 15,
  defaultEnergy = "balanced",
  defaultHours = 4,
}: DogPlannerProps) {
  const [weightKg, setWeightKg] = useState<number>(defaultWeight);
  const [energy, setEnergy] = useState<EnergyBtn>(defaultEnergy);
  const [hoursAlone, setHoursAlone] = useState<number>(defaultHours);

  const [result, setResult] = useState<PlanSessionResult | null>(null);

  const energyMap: Record<EnergyBtn, Energy> = {
  couch: "low",
  balanced: "medium",
  zoomies: "high",
};

const handleSubmit = () => {
    const session = planSession(weightKg, energyMap[energy], hoursAlone);
    setResult(session);
  };

  // Hardcoded energy buttons
  const energyOptions = [
    { key: "couch" as EnergyBtn, label: "Couch potato" },
    { key: "balanced" as EnergyBtn, label: "Balanced" },
    { key: "zoomies" as EnergyBtn, label: "Zoomies" },
  ];

  const segments: ChamberSegment[] =
    result?.tipChambers.map((c) => ({
      hour: c.hour,
      tray: c.tray,
      tip: c.tip,
    })) || [];

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      {/* Plan section */}
      <section className="max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl font-display font-semibold text-ink mb-6">
          TickTail Planner
        </h2>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Weight input */}
          <div>
            <label htmlFor="dog-weight" className="block text-sm font-medium text-ink mb-1">
              Dog weight (kg)
            </label>
            <input
              id="dog-weight"
              type="number"
              min="2"
              max="60"
              value={weightKg}
              onChange={(e) => {
                const v = Math.max(2, Math.min(60, Number(e.target.value)));
                setWeightKg(v);
              }}
              className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-ink focus:outline-none focus:border-primary sm:text-sm"
              aria-label="Dog weight in kg"
            />
          </div>

          {/* Energy buttons */}
          <div>
            <label htmlFor="energy" className="block text-sm font-medium text-ink mb-1">
              Energy level
            </label>
            <div className="space-x-2">
              {energyOptions.map((eo) => {
                const isSelected = energy === eo.key;
                return (
                  <button
                    key={eo.key}
                    onClick={() => setEnergy(eo.key as EnergyBtn)}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${ENERGY_COLORS[eo.key]} ${isSelected ? "border-primary" : ""}`}
                  >
                    {eo.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Hours slider */}
          <div>
            <label htmlFor="hours-alone" className="block text-sm font-medium text-ink mb-1">
              Hours alone
            </label>
            <input
              id="hours-alone"
              type="range"
              min="1"
              max="10"
              value={hoursAlone}
              onChange={(e) => setHoursAlone(Number(e.target.value))}
              className="w-full rounded-2xl border border-ink/15 bg-white p-2 appearance-none cursor-pointer"
              aria-label="Hours alone (1-10)"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>1</span>
              <span>{hoursAlone}</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!weightKg || !energy}
          className="w-full rounded-2xl bg-primary py-3 px-4 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {!weightKg || !energy ? "Set inputs first" : "Plan my session"}
        </button>
      </section>

      {/* Result section - shown after submit */}
      {result && (
        <section className="max-w-2xl mx-auto">
          {/* Recommendation card */}
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
            <h3 className="text-2xl font-display font-semibold text-ink mb-4">
              {sizeDisplayText(result.size)} recommended
            </h3>
            <p className="text-muted mb-4">
              {result.size} kit is ideal for dogs weighing {sizeWeightRange(
                result.size,
              )[0]}-{sizeWeightRange(result.size)[1]} kg.
            </p>

            <div className="mb-6">
              <h4 className="font-medium text-ink mb-2">Kit details</h4>
              <p className="text-3xl font-bold text-primary">
                {formatINR(149900)} / month {sizeDisplayText(result.size)}
              </p>
            </div>

            <button
              onClick={() => {
                // In full implementation, add to cart via context
                setResult((prev) =>
                  prev ? { ...prev, note: prev.note + " (added to cart)" } : { size: result.size, chambers: result.chambers, tipChambers: result.tipChambers, note: "Added to cart" }
                )
              }}
              className="w-full rounded-2xl bg-accent py-3 px-4 text-white font-semibold transition-colors mt-4"
            >
              Add recommended kit to cart
            </button>
          </div>

          {/* Personalised horizontal timeline */}
          <div className="mt-12">
            <h3 className="text-xl font-display font-semibold text-ink mb-4">
              Your personalised session
            </h3>
            <div className="flex space-x-2">
              {segments.map((segment) => {
                return (
                  <div
                    key={segment.hour}
                    className="flex-1 rounded-xl bg-bg p-4 text-center"
                  >
                    <p className="font-medium text-ink mb-1">{segment.hour}h</p>
                    <p className="text-sm text-muted truncate">{segment.tray}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}