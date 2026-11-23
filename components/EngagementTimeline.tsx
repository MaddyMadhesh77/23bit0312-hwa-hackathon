"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const TRAY_NAMES = ["Slide-lid", "Nose-flip", "Roll-out maze", "Scent-hide", "Lick-and-twist", "Pull-the-tab"];
const TRAY_SKILLS = [
  "Sliding a lid reveals a hidden compartment, teaching dogs to investigate and use their nose to discover what's inside.",
  "A spring-loaded flap that flips up when nudged, rewarding dogs for precise nose touches and timing.",
  "A ball that rolls out slowly when pushed, encouraging dogs to use their paw to control the pace of play.",
  "A pocket scented with natural herb aroma that taps into dogs' instinct to track and follow scent trails.",
  "A textured cup that dispenses treats when licked, soothing anxious dogs and promoting calm chewing behavior.",
  "A drawer that extends when a tab is pulled, teaching patience and rewarding dogs for controlled, deliberate movements.",
];

export default function EngagementTimeline() {
  const [highlighted, setHighlighted] = useState<number | null>(null);

  useEffect(() => {
    const storedSeg = window.localStorage.getItem("ticktail_engaged");
    if (storedSeg) setHighlighted(parseInt(storedSeg, 10));
  }, []);

  const showCard = highlighted !== null;
  const skill = highlighted !== null ? TRAY_SKILLS[highlighted - 1] : "";

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="flex space-x-2 pt-6 pb-6">
          {TRAY_NAMES.map((name, i) => {
            const isHighlighted = highlighted === i + 1;
            const onClick = () => localStorage.setItem("ticktail_engaged", (i + 1).toString());
            const cls = isHighlighted
              ? "flex-1 rounded-2xl border-2 border-primary bg-primary/10 text-primary"
              : "flex-1 rounded-2xl border-2 border-ink/15 bg-white text-ink hover:border-primary/30 cursor-pointer transition-colors";

            return (
              <div
                key={i}
                className={cls}
                onClick={() => localStorage.setItem("ticktail_engaged", (i + 1).toString())}
                style={{ margin: 0, padding: 0 }}
              >
                <div className="h-12 w-12 mx-auto rounded-full bg-bg mb-3 flex items-center justify-center">
                  <span className="font-display text-xl font-semibold">{i + 1}</span>
                </div>
                <p className="text-xs font-medium text-muted">{name}</p>
              </div>
            );
          })}
        </div>

        {showCard && (
          <div className="absolute top-1/2 -translate-y-1/2 bg-white rounded-xl p-4 shadow-xl w-full max-w-md border border-ink/10 z-10" style={{ top: "50%" }}>
            <h3 className="font-display font-semibold text-ink mb-3">Hour {highlighted}</h3>
            <p className="text-muted leading-relaxed">{skill || ""}</p>
            <Link
              href="/planner"
              className="mt-3 text-primary hover:text-primary/90 text-sm"
            >
              Learn more in the Planner
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
