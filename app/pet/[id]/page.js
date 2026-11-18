"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-100 text-sm text-muted">
      Loading map…
    </div>
  ),
});

export default function PetDetailPage() {
  const params = useParams();
  const petId = params.id;

  const [pet, setPet] = useState(null);
  const [history, setHistory] = useState([]);
  const [geofence, setGeofence] = useState(null);
  const [radius, setRadius] = useState(200);
  const [center, setCenter] = useState(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const [petRes, gfRes, posRes] = await Promise.all([
        fetch(`/api/pets/${petId}`),
        fetch(`/api/geofences?petId=${petId}`),
        fetch(`/api/positions?petId=${petId}`),
      ]);
      const petData = await petRes.json();
      const gfData = await gfRes.json();
      const posData = await posRes.json();
      setPet(petData.pet);
      setHistory(posData.history ?? []);
      if (gfData.geofence) {
        setGeofence(gfData.geofence);
        setRadius(gfData.geofence.radius);
        setCenter(gfData.geofence.center);
      }
    } catch {
      // ignore network hiccups
    }
  };

  useEffect(() => {
    load();
  }, [petId]);

  const saveGeofence = async () => {
    if (!center) {
      setMessage("Click the map to choose the safe-zone center first.");
      return;
    }
    try {
      const res = await fetch("/api/geofences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId, center, radius }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Could not save the safe zone.");
        return;
      }
      setGeofence(data.geofence);
      setMessage("Safe zone saved. The implant will alert you if your pet leaves it.");
    } catch {
      setMessage("Network error — please try again.");
    }
  };

  if (!pet) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Loading pet…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div>
          <Link href="/" className="text-sm text-primary underline">
            ← Dashboard
          </Link>
          <h1 className="mt-1 text-xl font-bold">
            {pet.name} <span className="font-normal text-muted">· {pet.breed}</span>
          </h1>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Implant {pet.implantId}
        </span>
      </header>

      {pet.photo && (
        <div className="flex justify-center px-4">
          <img
            src={pet.photo}
            alt={`Photo of ${pet.name}`}
            className="rounded-xl border border-border w-full max-w-md object-cover h-48 shadow-sm"
          />
        </div>
      )}

      <main className="mx-auto max-w-4xl space-y-4 p-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted">Chip registration</p>
            <p className="mt-1 text-sm font-mono break-all">
              {pet.chipRegistration || "— not set —"}
            </p>
            <p className="mt-1 text-sm font-mono break-all">
              {pet.chipRegistrationDate ? new Date(pet.chipRegistrationDate).toLocaleDateString() : "— not set —"}
            </p>
            <p className="mt-1 text-sm font-mono break-all">
              {pet.chipRegistrationLocation || "— not set —"}
            </p>
            <p className="text-xs text-muted">Mandatory for pet passport</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted">Battery</p>
            <p className="mt-1 text-2xl font-bold">{pet.battery}%</p>
            <p className="text-xs text-muted">{pet.signal} signal</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted">Last report</p>
            <p className="mt-1 text-2xl font-bold">{pet.lastSeen}</p>
            <p className="text-xs text-muted capitalize">{pet.reportingMode} mode</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted">Location</p>
            <p className="mt-1 break-all text-sm font-mono">
              {pet.location[0].toFixed(5)}, {pet.location[1].toFixed(5)}
            </p>
            <Link href={`/lost-pet?id=${pet.id}`} className="text-xs text-primary underline">
              Report lost →
            </Link>
          </div>
        </div>

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-2 font-semibold">Safe zone</h2>
          <p className="mb-3 text-sm text-muted">
            {center
              ? "Click the map to move the center of the safe zone."
              : "Click the map to place the safe zone around your home or garden."}
          </p>
          <div className="h-[280px] overflow-hidden rounded-lg border border-border sm:h-[360px]">
            <MapView
              pets={[pet]}
              center={center ?? pet.location}
              zoom={center ? 16 : 15}
              geofence={geofence ?? (center ? { center, radius } : null)}
              onMapClick={(latlng) => setCenter(latlng)}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label htmlFor="radius" className="text-sm text-muted">
              Radius: {radius} m
            </label>
            <input
              id="radius"
              type="range"
              min="50"
              max="1000"
              step="10"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-56 accent-primary"
            />
            <button
              type="button"
              onClick={saveGeofence}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Save safe zone
            </button>
            <button
              type="button"
              onClick={() => setCenter(pet.location)}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-slate-50"
            >
              Center on {pet.name}
            </button>
          </div>
          {message && <p className="mt-2 text-sm text-primary">{message}</p>}
        </section>

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 font-semibold">Recent positions</h2>
          {history.length === 0 ? (
            <p className="text-sm text-muted">No history yet.</p>
          ) : (
            <ul className="max-h-64 space-y-1 overflow-y-auto font-mono text-xs">
              {history
                .slice()
                .reverse()
                .slice(0, 20)
                .map((entry, i) => (
                  <li key={i} className="flex justify-between border-b border-border/60 py-1">
                    <span>
                      {entry.position[0].toFixed(5)}, {entry.position[1].toFixed(5)}
                    </span>
                    <span className="text-muted">
                      {new Date(entry.at).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
