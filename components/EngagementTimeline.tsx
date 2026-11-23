"use client";

import { useState } from "react";

const ENGAGEMENT_HOURS = [
  {
    hour: 1,
    tray: "Slide-lid tray",
    blurb: "A gentle first win — slide the lid with nose or paw.",
  },
  {
    hour: 2,
    tray: "Nose-flip flap",
    blurb: "Flip the flap to free the treats.",
  },
  {
    hour: 3,
    tray: "Roll-out ball maze",
    blurb: "Roll the ball through the maze to release its cargo.",
  },
  {
    hour: 4,
    tray: "Scent-hide pocket",
    blurb: "Sniff out the hidden pocket and tease it open.",
  },
  {
    hour: 5,
    tray: "Lick-and-twist cup",
    blurb: "Lick and twist the cup — patience pays.",
  },
  {
    hour: 6,
    tray: "Pull-the-tab drawer",
    blurb: "Pull the tab, drawer opens, jackpot.",
  },
] as const;

export default function EngagementTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeHour = ENGAGEMENT_HOURS[activeIndex];

  return (
    <div>
      <div className="flex gap-1">
        {ENGAGEMENT_HOURS.map((engagementHour, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={engagementHour.hour}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-pressed={isActive}
              className={`flex-1 rounded-lg px-2 py-3 text-left transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-primary/10 text-ink hover:bg-primary/20"
              }`}
            >
              <span className="block text-xs font-semibold">
                Hour {engagementHour.hour}
              </span>
              <span className="mt-1 block text-xs">{engagementHour.tray}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border bg-white/60 p-4">
        <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-ink">
          Hour {activeHour.hour}
        </span>
        <h3 className="mt-3 font-semibold text-ink">{activeHour.tray}</h3>
        <p className="mt-2 text-sm text-muted">{activeHour.blurb}</p>
      </div>
    </div>
  );
}
