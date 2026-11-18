import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "About SpaceTrack — Vanessa Zamzow & Luna",
  description:
    "The story behind SpaceTrack: founder Vanessa Zamzow, her cat Luna, and the mission to keep every pet safe.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border bg-card px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-primary font-bold">
            <Logo size={32} showWordmark />
          </Link>
          <Link
            href="/"
            className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-dark"
          >
            ← Back to dashboard
          </Link>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <Logo size={48} showWordmark tagline founder />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            About SpaceTrack
          </h1>
          <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
            Keeping every pet safe — founded by Vanessa Zamzow, inspired by her cat Luna.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        {/* Hero image */}
        <section className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="w-full sm:w-1/2 flex justify-center">
            <img
              src="/about/vanessa-photo.jpg"
              alt="Vanessa Zamzow — founder of SpaceTrack"
              className="max-w-md h-auto rounded-2xl border border-border shadow-lg"
              width={500}
              height={400}
            />
          </div>
          <div className="w-full sm:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl font-bold">A founder’s story</h2>
            <p className="mt-4 text-muted leading-relaxed">
              SpaceTrack was created by <strong>Vanessa Zamzow</strong>, who dedicated her life to animal
              safety after losing cats whose collars got caught and snagged — accidents no pet should ever
              suffer. She wanted a way to keep pets safe without relying on collars that can fail.
            </p>
          </div>
        </section>

        {/* The story */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Vanessa &amp; Luna</h2>
          <p className="text-muted leading-relaxed">
            Vanessa’s beloved cat, <strong>Luna</strong>, was the inspiration behind everything. Luna was
            more than a pet — she was family. When Vanessa learned how many animals are lost each year
            because collars break, snag, or fall off, she knew there had to be a better way.
          </p>
          <p className="text-muted leading-relaxed">
            That idea became the SpaceTrack implant: a small, collar-free device that helps reunite lost
            pets with their families. It’s labeled as a <strong>concept / prototype</strong> — it records
            device data points like body temperature and location, and makes no medical or health claims.
            The “big brain” who helped bring Vanessa’s vision to life is represented abstractly in our
            branding, not as a portrait.
          </p>
        </section>

        {/* Gallery */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Our story in pictures</h2>
          <p className="text-muted">Original artwork — no photos, no real-person likenesses.</p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <figure className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col items-center">
              <img
                src="/about/vanessa.svg"
                alt="Vanessa Zamzow — founder illustration"
                className="w-full h-48 object-cover rounded-lg mb-3"
                width={400}
                height={500}
              />
              <figcaption className="text-sm font-medium text-foreground">
                Vanessa Zamzow
              </figcaption>
              <p className="mt-1 text-xs text-muted text-center">
                Founder, dedicated her life to animal safety
              </p>
            </figure>

            <figure className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col items-center">
              <img
                src="/about/pet.svg"
                alt="Luna — Vanessa's cat illustration"
                className="w-full h-48 object-cover rounded-lg mb-3"
                width={400}
                height={400}
              />
              <figcaption className="text-sm font-medium text-foreground">
                Luna
              </figcaption>
              <p className="mt-1 text-xs text-muted text-center">
                Beloved cat — the inspiration behind SpaceTrack
              </p>
            </figure>

            <figure className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col items-center sm:col-span-2">
              <img
                src="/about/together.svg"
                alt="Vanessa and Luna together illustration"
                className="w-full h-48 object-cover rounded-lg mb-3"
                width={500}
                height={400}
              />
              <figcaption className="text-sm font-medium text-foreground">
                Vanessa &amp; Luna
              </figcaption>
              <p className="mt-1 text-xs text-muted text-center">
                Founder and her inspiration, side by side
              </p>
            </figure>

            <figure className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col items-center">
              <img
                src="/about/vanessa-photo.jpg"
                alt="Vanessa Zamzow — real photo"
                className="w-full h-48 object-cover rounded-lg mb-3"
                width={400}
                height={500}
              />
              <figcaption className="text-sm font-medium text-foreground">
                Vanessa Zamzow
              </figcaption>
              <p className="mt-1 text-xs text-muted text-center">
                Founder, dedicated her life to animal safety
              </p>
            </figure>

            <figure className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col items-center">
              <img
                src="/about/luna-photo.jpg"
                alt="Luna — Vanessa's cat, real photo"
                className="w-full h-48 object-cover rounded-lg mb-3"
                width={400}
                height={400}
              />
              <figcaption className="text-sm font-medium text-foreground">
                Luna
              </figcaption>
              <p className="mt-1 text-xs text-muted text-center">
                Beloved cat — the inspiration behind SpaceTrack
              </p>
            </figure>
          </div>
        </section>

        {/* Mission */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Our mission</h2>
          <p className="text-muted leading-relaxed mb-4">
            SpaceTrack exists so that no pet ever dies because a collar got caught or snagged. Every
            feature — the live map, geofence alerts, battery monitoring, and lost-pet mode — is built
            around one goal: keeping animals safe and reuniting them with the people who love them.
          </p>
          <ul className="space-y-3 mt-4 text-sm text-muted list-disc pl-5">
            <li>Pet-first, always — no vehicles, no health claims, no real-person likenesses.</li>
            <li>Collar-free tracking so snagged collars can never put a pet at risk.</li>
            <li>Geofence safe zones with alerts the moment a pet leaves home.</li>
            <li>Battery and signal monitoring so you’re never caught by surprise.</li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-border bg-card px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted">
            SpaceTrack · Founded by Vanessa Zamzow · Concept / Prototype · Not a medical device
          </p>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} SpaceTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
