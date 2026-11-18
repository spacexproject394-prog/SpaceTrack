import { NextResponse } from "next/server";
import { getPositions, getPets, getAlerts, tick } from "@/lib/store";

// Latest position for every pet (or one pet via ?petId=).
// Each call also advances the simulator one tick so the demo stays live.
tick();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const petId = searchParams.get("petId");

  const positions = getPositions(petId);
  const latest = {};
  for (const entry of positions) {
    if (!latest[entry.petId] || entry.at > latest[entry.petId].at) {
      latest[entry.petId] = entry;
    }
  }

  const pets = getPets().map((pet) => ({
    ...pet,
    location: latest[pet.id]?.position ?? pet.location,
  }));

  const alerts = getAlerts()
    .filter((a) => !petId || a.petId === petId)
    .slice(-20);

  return NextResponse.json({ pets, history: positions, alerts });
}
