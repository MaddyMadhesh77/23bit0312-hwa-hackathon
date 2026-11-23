import DogPlanner from "@/components/DogPlanner";

export default function PlannerPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
        TickTail Planner
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        Tell us about your dog and build a calm, engaging session for the hours
        they spend alone.
      </p>
      <div className="mt-10">
        <DogPlanner />
      </div>
    </div>
  );
}
