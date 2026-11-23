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
            A wind-up tower that unlocks six puzzles over six hours. No batteries.
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
    </>
  );
}
