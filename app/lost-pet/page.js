"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

export default function LostPetPage() {
  const [pet, setPet] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Read ?id= from the URL on the client (safe for SSR).
    const params = new URLSearchParams(window.location.search);
    const petId = params.get("id") || "1";

    // Simulated fetch — will be replaced by /api/pets/[id] later.
    setPet({
      id: petId,
      name: "Whiskers",
      implantId: "ST-001",
      missingSince: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
      lastKnownLocation: "40.7128, -74.0060",
    });
  }, []);

  useEffect(() => {
    if (pet) {
      setShareLink(`${window.location.origin}/lost-pet?id=${pet.id}`);
    }
  }, [pet]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — user can still select the text manually.
    }
  };

  if (!pet) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Loading pet information…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" aria-label="SpaceTrack home">
            <Logo size={34} />
          </Link>
          <h1 className="text-xl font-bold">Lost Pet Notice</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">{pet.name} is missing</h2>
              <p className="text-sm text-muted">Missing since {pet.missingSince}</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              Implant {pet.implantId}
            </span>
          </div>

          <div className="mt-4 flex h-48 items-center justify-center rounded-lg bg-slate-100 text-sm text-muted">
            Last known location: {pet.lastKnownLocation}
          </div>
          <p className="mt-1 text-xs text-muted">Last known location (map coming soon)</p>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-2 font-medium">Share this page</h3>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={copyLink}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Share this link with neighbours, friends, or local shelters so they can
            see the pet&apos;s details and report sightings.
          </p>
        </div>

        <p className="mt-4 text-sm text-muted">
          If you have seen this pet, please contact the owner or a local shelter.
          Location data on this page is simulated demo data.
        </p>
      </main>
    </div>
  );
}
