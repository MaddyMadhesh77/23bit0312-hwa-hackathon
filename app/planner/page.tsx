"use client";

import DogPlanner from "@/components/DogPlanner";
import Link from "next/link";

export default function PlannerPage() {
  return (
    <main className="flex-1 bg-bg p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <DogPlanner />
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="btn btn-primary"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  )
}