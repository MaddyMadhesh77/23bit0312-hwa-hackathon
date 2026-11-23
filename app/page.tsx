"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 bg-bg p-4 md:p-8">
      {/* Hero section */}
      <section className="md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto pb-8">
        <div>
          <h1 className="text-5xl font-display font-semibold text-ink mb-6">
            The puzzle toy that paces itself.
          </h1>
          <p className="text-2xl text-muted mb-8">
            A wind-up tower that unlocks six puzzles over six hours. No batteries.
            No apps.
          </p>
          <Link
            href="/product"
            className="btn btn-primary"
          >
            Meet TickTail
          </Link>
        </div>
        <div className="relative">
          <Image
            src="/images/hero.webp"
            alt="TickTail wind-up tower puzzle toy on a wooden floor next to a dog bed"
            width={600}
            height={400}
            priority
            className="rounded-2xl object-cover"
          />
        </div>
      </section>

      {/* How it works section */}
      <section className="max-w-7xl mx-auto pb-8">
        <h2 className="text-4xl font-display font-semibold text-ink mb-8">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {/* Hour 1: Slide-lid tray */}
          <div className="p-6 bg-white rounded-xl hover:bg-bg transition-colors cursor-pointer">
            <h3 className="text-xl font-medium text-ink mb-2">Hour 1: Slide-lid tray</h3>
            <p className="text-muted">
              Sliding a lid reveals a hidden compartment, teaching dogs to investigate
              and use their nose to discover what's inside.
            </p>
          </div>
          {/* Hour 2: Nose-flip flap */}
          <div className="p-6 bg-white rounded-xl hover:bg-bg transition-colors cursor-pointer">
            <h3 className="text-xl font-medium text-ink mb-2">Hour 2: Nose-flip flap</h3>
            <p className="text-muted">
              A spring-loaded flap that flips up when nudged, rewarding dogs for
              precise nose touches and timing.
            </p>
          </div>
          {/* Hour 3: Roll-out ball maze */}
          <div className="p-6 bg-white rounded-xl hover:bg-bg transition-colors cursor-pointer">
            <h3 className="text-xl font-medium text-ink mb-2">Hour 3: Roll-out ball maze</h3>
            <p className="text-muted">
              A ball that rolls out slowly when pushed, encouraging dogs to use
              their paw to control the pace of play.
            </p>
          </div>
          {/* Hour 4: Scent-hide pocket */}
          <div className="p-6 bg-white rounded-xl hover:bg-bg transition-colors cursor-pointer">
            <h3 className="text-xl font-medium text-ink mb-2">Hour 4: Scent-hide pocket</h3>
            <p className="text-muted">
              A pocket scented with natural herb aroma that taps into dogs' instinct
              to track and follow scent trails.
            </p>
          </div>
          {/* Hour 5: Lick-and-twist cup */}
          <div className="p-6 bg-white rounded-xl hover:bg-bg transition-colors cursor-pointer">
            <h3 className="text-xl font-medium text-ink mb-2">Hour 5: Lick-and-twist cup</h3>
            <p className="text-muted">
              A textured cup that dispenses treats when licked, soothing anxious
              dogs and promoting calm chewing behavior.
            </p>
          </div>
          {/* Hour 6: Pull-the-tab drawer */}
          <div className="p-6 bg-white rounded-xl hover:bg-bg transition-colors cursor-pointer">
            <h3 className="text-xl font-medium text-ink mb-2">Hour 6: Pull-the-tab drawer</h3>
            <p className="text-muted">
              A drawer that extends when a tab is pulled, teaching patience and
              rewarding dogs for controlled, deliberate movements.
            </p>
          </div>
        </div>
      </section>

      {/* Why it's different section */}
      <section className="max-w-7xl mx-auto pb-8">
        <h2 className="text-4xl font-display font-semibold text-ink mb-8">Why it's different</h2>
        <table className="w-full border rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="text-left p-4 font-medium text-ink">Engagement time</th>
              <th className="text-left p-4 font-medium text-ink">Variety</th>
              <th className="text-left p-4 font-medium text-ink">Power needed</th>
              <th className="text-left p-4 font-medium text-ink">Mess</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-ink/10 hover:bg-bg transition-colors">
              <td className="p-4">Long-lasting</td>
              <td className="p-4">Multiple textures</td>
              <td className="p-4">Battery required</td>
              <td className="p-4">Messy fillings</td>
            </tr>
            <tr className="border-b border-ink/10 hover:bg-bg transition-colors">
              <td className="p-4">Variable</td>
              <td className="p-4">Different shapes</td>
              <td className="p-4">Occasional batteries</td>
              <td className="p-4">Some debris</td>
            </tr>
            <tr className="border-b border-ink/10 hover:bg-bg transition-colors">
              <td className="p-4">Depends on size</td>
              <td className="p-4">Limited patterns</td>
              <td className="p-4">No power</td>
              <td className="p-4">Fibers everywhere</td>
            </tr>
            <tr className="border-b border-ink/10 hover:bg-bg transition-colors">
              <td className="p-4">2–6 hours</td>
              <td className="p-4">Six skills</td>
              <td className="p-4">None — clockwork</td>
              <td className="p-4">Sealed chambers</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Built for real dogs section */}
      <section className="max-w-7xl mx-auto pb-8">
        <h2 className="text-4xl font-display font-semibold text-ink mb-8">Built for real dogs</h2>
        <div className="grid grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl font-medium text-ink mb-4">Food-safe materials</h3>
            <ul className="text-muted space-y-3">
              <li>Food-grade silicone & TPE</li>
              <li>Top-rack dishwasher safe</li>
              <li>Steel-reinforced base</li>
            </ul>
            <p className="mt-6 text-sm text-error">
              Supervise first use. Not a chew toy.
            </p>
          </div>
          <div>
            <img
              src="/images/exploded.webp"
              alt="TickTail exploded view showing internal mechanisms"
              width={500}
              height={400}
              className="rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-primary py-12 text-center max-w-7xl mx-auto">
        <h2 className="text-3xl font-display font-semibold text-ink mb-4">
          Ready for calmer afternoons?
        </h2>
        <Link
          href="/product"
          className="btn btn-accent"
        >
          Shop TickTail
        </Link>
      </section>
    </main>
  );
}