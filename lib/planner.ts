export type PlannerSize = "S" | "M" | "L";
export type Energy = "low" | "medium" | "high";

export type Chamber = {
  hour: number;
  tray: string;
  tip?: string;
};

export type SessionPlan = {
  size: PlannerSize;
  chambers: Chamber[];
  notes: string[];
};

type LegacyChamber = Chamber & { tip: string };

type CompatibleSessionPlan = Omit<SessionPlan, "notes"> & {
  notes?: string[];
  tipChambers: LegacyChamber[];
  note: string;
};

const TRAY_ORDERS: Record<Energy, readonly string[]> = {
  low: [
    "Scent-hide pocket",
    "Slide-lid tray",
    "Pull-the-tab drawer",
    "Nose-flip flap",
    "Roll-out ball maze",
    "Lick-and-twist cup",
  ],
  medium: [
    "Slide-lid tray",
    "Nose-flip flap",
    "Roll-out ball maze",
    "Scent-hide pocket",
    "Lick-and-twist cup",
    "Pull-the-tab drawer",
  ],
  high: [
    "Roll-out ball maze",
    "Nose-flip flap",
    "Lick-and-twist cup",
    "Slide-lid tray",
    "Scent-hide pocket",
    "Pull-the-tab drawer",
  ],
};

const TRAY_TIPS: Record<string, string> = {
  "Scent-hide pocket": "Tap into your dog's instinct to track scent trails.",
  "Slide-lid tray": "Sliding a lid reveals a hidden compartment.",
  "Pull-the-tab drawer": "A drawer that extends when a tab is pulled.",
  "Nose-flip flap": "A spring-loaded flap that flips up when nudged.",
  "Roll-out ball maze": "A ball that rolls out slowly when pushed.",
  "Lick-and-twist cup": "A textured cup that dispenses treats when licked.",
};

const DEFAULT_WEIGHT_KG = 15;
const MIN_WEIGHT_KG = 2;
const MAX_WEIGHT_KG = 60;
const MIN_HOURS_ALONE = 1;
const MAX_HOURS_ALONE = 10;
const MAX_CHAMBERS = 6;

export function normalizeWeightKg(weightKg: number): number {
  if (!Number.isFinite(weightKg) || weightKg <= 0) return DEFAULT_WEIGHT_KG;

  return Math.min(MAX_WEIGHT_KG, Math.max(MIN_WEIGHT_KG, weightKg));
}

export function normalizeHoursAlone(hoursAlone: number): number {
  if (!Number.isFinite(hoursAlone)) return MIN_HOURS_ALONE;

  return Math.min(MAX_HOURS_ALONE, Math.max(MIN_HOURS_ALONE, hoursAlone));
}

export function recommendSize(weightKg: number): PlannerSize {
  const normalizedWeight = normalizeWeightKg(weightKg);

  if (normalizedWeight < 12) return "S";
  if (normalizedWeight < 25) return "M";
  return "L";
}

export function planSession(
  weightKg: number,
  energy: Energy,
  hoursAlone: number,
): CompatibleSessionPlan {
  const normalizedWeight = normalizeWeightKg(weightKg);
  const normalizedHours = normalizeHoursAlone(hoursAlone);
  const size = recommendSize(normalizedWeight);
  const chamberCount = Math.min(
    MAX_CHAMBERS,
    Math.max(1, Math.round(normalizedHours)),
  );
  const trays = TRAY_ORDERS[energy] ?? TRAY_ORDERS.medium;
  const chambers: Chamber[] = trays.slice(0, chamberCount).map((tray, index) => ({
    hour: index + 1,
    tray,
  }));
  const notes: string[] = [];

  if (normalizedWeight > 45) {
    notes.push("Size L — supervise closely, this is a strong chewer range.");
  }
  if (normalizedHours > 6) {
    notes.push("For a longer routine, pause for a refill around the midpoint.");
  }

  const plan = { size, chambers, notes } as CompatibleSessionPlan;

  // Non-enumerable aliases keep the existing planner UI compatible without
  // changing the public { size, chambers, notes } shape.
  Object.defineProperties(plan, {
    tipChambers: {
      value: chambers.map((chamber) => ({
        ...chamber,
        tip: TRAY_TIPS[chamber.tray],
      })),
      enumerable: false,
    },
    note: {
      value: notes.join(" "),
      enumerable: false,
    },
  });

  return plan;
}

export function sizeWeightRange(size: PlannerSize): [number, number] {
  const ranges: Record<PlannerSize, [number, number]> = {
    S: [5, 12],
    M: [12, 25],
    L: [25, 45],
  };
  return ranges[size];
}

export function sizeProductId(size: PlannerSize): string {
  const ids: Record<PlannerSize, string> = {
    S: "ticktail-s",
    M: "ticktail-m",
    L: "ticktail-l",
  };
  return ids[size];
}

export function sizeDisplayText(size: PlannerSize): string {
  const [min, max] = sizeWeightRange(size);
  return `${size === "S" ? "Small" : size === "M" ? "Medium" : "Large"} (${min}–${max} kg)`;
}
