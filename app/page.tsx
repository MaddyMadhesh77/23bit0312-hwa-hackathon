import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
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
  );
}
