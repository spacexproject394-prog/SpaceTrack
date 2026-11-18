import { NextResponse } from "next/server";
import { getPets, registerImplant, tick } from "@/lib/store";

// Advance the simulated world on each request so the dashboard "moves"
// without needing a background worker in dev.
tick();

export async function GET() {
  return NextResponse.json({ pets: getPets() });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { serial, petName, breed, vetContact, chipRegistration, chipRegistrationDate, chipRegistrationLocation, photo } = body;

  if (!serial || !petName) {
    return NextResponse.json(
      { error: "serial and petName are required" },
      { status: 400 }
    );
  }

  const pet = registerImplant({ serial, petName, breed, vetContact, chipRegistration, chipRegistrationDate, chipRegistrationLocation, photo });
  if (!pet) {
    return NextResponse.json(
      { error: "Unknown or already-registered serial number" },
      { status: 404 }
    );
  }
  return NextResponse.json({ pet }, { status: 201 });
}
