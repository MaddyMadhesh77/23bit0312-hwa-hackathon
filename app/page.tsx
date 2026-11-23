import Image from "next/image";
import Link from "next/link";

const howItWorks = [
  {
    hour: 1,
    title: "Slide-lid tray",
    description: "A gentle first win — slide the lid with nose or paw.",
  },
  {
    hour: 2,
    title: "Nose-flip flap",
    description: "Flip the flap to free the treats.",
  },
  {
    hour: 3,
    title: "Roll-out ball maze",
    description: "Roll the ball through the maze to release its cargo.",
  },
  {
    hour: 4,
    title: "Scent-hide pocket",
    description: "Sniff out the hidden pocket and tease it open.",
  },
  {
    hour: 5,
    title: "Lick-and-twist cup",
    description: "Lick and twist the cup — patience pays.",
  },
  {
    hour: 6,
    title: "Pull-the-tab drawer",
    description: "Pull the tab, drawer opens, jackpot.",
  },
] as const;

export default function Home() {
  return (
    <>
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center px-4 py-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">
            The puzzle toy that paces itself.
          </h1>
          <p className="mt-6 text-lg text-muted">
            A wind-up tower that unlocks six puzzles, one per hour. No batteries.
            No apps.
          </p>
          <Link href="/product" className="btn btn-primary mt-8">
            Meet TickTail
          </Link>
        </div>

        <div>
          <Image
            src="/images/hero.webp"
            priority
            width={800}
            height={600}
            alt="TickTail puzzle tower with six chambers"
            className="h-auto w-full rounded-3xl object-cover"
          />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {howItWorks.map(({ hour, title, description }) => (
            <article
              key={hour}
              className="rounded-2xl border border-ink/10 bg-white/60 p-4"
            >
              <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-ink">
                Hour {hour}
              </span>
              <h3 className="mt-4 font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-3xl md:text-4xl font-bold">
          Why it&apos;s different
        </h2>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead className="border-b border-ink/15">
              <tr>
                <th className="p-3 text-left text-muted"></th>
                <th className="p-3 text-left text-muted">Engagement time</th>
                <th className="p-3 text-left text-muted">Variety</th>
                <th className="p-3 text-left text-muted">Power needed</th>
                <th className="p-3 text-left text-muted">Mess</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              <tr>
                <td className="p-3 text-ink">Stuffable rubber toys</td>
                <td className="p-3 text-muted">Minutes</td>
                <td className="p-3 text-muted">One trick</td>
                <td className="p-3 text-muted">None</td>
                <td className="p-3 text-muted">Low</td>
              </tr>
              <tr>
                <td className="p-3 text-ink">Puzzle boards</td>
                <td className="p-3 text-muted">Minutes once learned</td>
                <td className="p-3 text-muted">One trick</td>
                <td className="p-3 text-muted">None</td>
                <td className="p-3 text-muted">Low</td>
              </tr>
              <tr>
                <td className="p-3 text-ink">Snuffle mats</td>
                <td className="p-3 text-muted">Minutes</td>
                <td className="p-3 text-muted">Sniffing only</td>
                <td className="p-3 text-muted">None</td>
                <td className="p-3 text-muted">High</td>
              </tr>
              <tr className="bg-primary/10 font-semibold">
                <td className="p-3">TickTail</td>
                <td className="p-3">Designed for 2–6 hours</td>
                <td className="p-3">Six skills</td>
                <td className="p-3">None — clockwork</td>
                <td className="p-3">Sealed chambers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-3xl md:text-4xl font-bold">Built for real dogs</h2>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-5">
            <p className="font-semibold text-ink">Food-safe silicone & TPE</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-5">
            <p className="font-semibold text-ink">
              Top-rack dishwasher safe
            </p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-5">
            <p className="font-semibold text-ink">Steel-reinforced base</p>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted">
          Supervise first use. Not a chew toy.
        </p>
      </section>

      <section className="bg-primary text-center py-16 rounded-3xl mx-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Ready for calmer afternoons?
        </h2>
        <Link href="/product" className="btn btn-primary mt-8">
          Shop TickTail
        </Link>
      </section>
    </>
  );
}
