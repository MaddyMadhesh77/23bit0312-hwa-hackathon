"use client";

import Link from "next/link";
import { useState } from "react";

const FAQS = [
  {
    question: "Is it really battery-free?",
    answer:
      "Yes. A wound spring and escapement, like a kitchen timer, are designed to unlock one chamber roughly every 45–60 minutes — about one per hour. Wind it and walk away.",
  },
  {
    question: "What treats can I use?",
    answer:
      "Dry treats and kibble only. Wet or sticky food can spoil inside sealed chambers.",
  },
  {
    question: "Is it chew-proof?",
    answer:
      "No toy is. Supervise the first sessions and remove TickTail if your dog starts chewing the shell instead of solving the trays.",
  },
  {
    question: "How do I clean it?",
    answer:
      "Trays and cups go in the top rack of the dishwasher. Wipe the base with a damp cloth and never submerge it.",
  },
  {
    question: "Which size should I pick?",
    answer:
      "S for 5–12 kg, M for 12–25 kg, L for 25–45 kg. Not sure? Our Dog Planner recommends a size from your dog's weight, energy and routine.",
  },
] as const;

export default function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ul className="w-full">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        const answerId = `product-faq-answer-${index + 1}`;

        return (
          <li key={faq.question}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full justify-between py-4 text-left border-b border-muted/20"
            >
              <span className="font-medium">{faq.question}</span>
              <span
                aria-hidden="true"
                className={`transition-transform ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ⌄
              </span>
            </button>

            {isOpen && (
              <div id={answerId} className="text-sm text-muted pb-4">
                {faq.answer}
                {index === 4 && (
                  <>
                    {" "}
                    <Link href="/planner" className="text-primary underline">
                      Use the Dog Planner
                    </Link>
                  </>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
