"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "../components/Logo";

// Leaflet touches `window` at import time, so the map must load client-side only.
const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-100 text-sm text-muted">
      Loading neighborhood map…
    </div>
  ),
});

const INITIAL_PETS = [
  {
    id: "1",
    name: "Whiskers",
    breed: "Domestic Shorthair",
    implantId: "ST-001",
    reportingMode: "adaptive",
    battery: 85,
    signal: "Strong",
    lastSeen: "Just now",
    location: [40.713, -74.0055],
  },
  {
    id: "2",
    name: "Mittens",
    breed: "Siamese",
    implantId: "ST-002",
    reportingMode: "eco",
    battery: 40,
    signal: "Weak",
    lastSeen: "2 min ago",
    location: [40.714, -74.008],
  },
];

export default function DashboardPage() {
  const [pets, setPets] = useState(INITIAL_PETS);
  const [alerts, setAlerts] = useState([]);
  const [selectedId, setSelectedId] = useState("1");
  const [reportingMode, setReportingMode] = useState("adaptive");

  const selected = pets.find((p) => p.id === selectedId) ?? pets[0];

  // Live updates: poll the API every 5 seconds. Each poll also advances the
  // simulator server-side, so pets wander and batteries drain over time.
  // (WebSocket would replace this polling in production.)
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/positions");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setPets(data.pets);
        setAlerts(data.alerts ?? []);
      } catch {
        // Network hiccup — keep the last known state.
      }
    };

    load();
    const timer = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="SpaceTrack home">
            <Logo size={34} founder />
          </Link>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Concept / Prototype
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/about" className="rounded-md px-3 py-1.5 text-muted hover:bg-primary/10 hover:text-primary">
              About
            </Link>
            <Link href="/auth/register-implant" className="rounded-md px-3 py-1.5 text-muted hover:bg-primary/10 hover:text-primary">
              Register Implant
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <label htmlFor="reporting-mode" className="text-sm text-muted">
              Reporting
            </label>
            <select
              id="reporting-mode"
              value={reportingMode}
              onChange={(e) => setReportingMode(e.target.value)}
              className="rounded-md border border-border bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="live">Live</option>
              <option value="adaptive">Adaptive</option>
              <option value="eco">Eco</option>
            </select>
          </div>
        </div>
      </header>

      {alerts.length > 0 && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2">
          <ul className="mx-auto max-w-6xl space-y-1 text-sm text-amber-900">
            {alerts.slice(-3).map((alert, i) => (
              <li key={i}>⚠ {alert.message}</li>
            ))}
          </ul>
        </div>
      )}

      <main className="mx-auto grid max-w-6xl gap-4 p-4 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="h-[320px] w-full overflow-hidden rounded-xl border border-border shadow-sm sm:h-[420px]">
            <MapView pets={pets} center={selected.location} />
          </div>
          <p className="mt-2 text-xs text-muted">
            Live neighborhood view · markers show each pet&apos;s battery level ·
            updates every 5 seconds
          </p>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Your pets
            </h2>
            <ul className="space-y-2">
              {pets.map((pet) => (
                <li key={pet.id}>
                  <div
                    className={`rounded-lg border px-3 py-2 transition-colors ${
                      pet.id === selectedId
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-slate-50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(pet.id)}
                      className="w-full text-left"
                    >
                      <span className="block font-medium">{pet.name}</span>
                      <span className="block text-xs text-muted">
                        {pet.breed} · battery {pet.battery}%
                      </span>
                    </button>
                    <Link
                      href={`/pet/${pet.id}`}
                      className="mt-1 inline-block text-xs text-primary underline"
                    >
                      Details & safe zone →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Device · {selected.implantId}
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-muted">Battery</span>
                  <span>{selected.battery}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      selected.battery > 50
                        ? "bg-emerald-500"
                        : selected.battery > 20
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${selected.battery}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Signal</span>
                <span>{selected.signal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Last report</span>
                <span>{selected.lastSeen}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Reporting mode</span>
                <span className="capitalize">{reportingMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Firmware</span>
                <span>1.0.0</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm text-sm">
            <p className="mb-2 font-medium">Actions</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/lost-pet?id=${selected.id}`}
                className="rounded-md bg-accent px-3 py-1.5 font-medium text-white hover:opacity-90"
              >
                Report lost
              </Link>
              <Link
                href="/auth/register-implant"
                className="rounded-md border border-border px-3 py-1.5 hover:bg-slate-50"
              >
                Register implant
              </Link>
            </div>
          </div>
        </aside>
      </main>

      <footer className="border-t border-border bg-card px-4 py-6">
        <div className="mx-auto max-w-6xl text-sm text-muted">
          <p>
            <strong className="text-foreground">Our story.</strong> SpaceTrack was
            founded by{" "}
            <strong className="text-foreground">Vanessa Zamzow</strong>, who
            dedicated her life to keeping animals safe. The implant exists to
            prevent the deaths of pets whose collars get caught or snagged and who
            cannot reach help in time — so no animal is lost before someone can
            find them.
          </p>
          <p className="mt-2 text-xs">
            SpaceTrack is a concept / prototype. Body temperature, if ever
            included, is treated strictly as a device data point — no medical or
            health claims.
          </p>
        </div>
      </footer>
    </div>
  );
}
