import { NextResponse } from "next/server";
import { getPet, tick } from "@/lib/store";

export async function GET(_request, { params }) {
  tick();
  const pet = getPet(params.id);
  if (!pet) {
    return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  }
  return NextResponse.json({ pet });
}
