import { NextResponse } from "next/server";
import { getGeofence, setGeofence } from "@/lib/store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const petId = searchParams.get("petId");
  if (!petId) {
    return NextResponse.json({ error: "petId is required" }, { status: 400 });
  }
  return NextResponse.json({ geofence: getGeofence(petId) });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { petId, center, radius } = body;

  const validCenter =
    Array.isArray(center) &&
    center.length === 2 &&
    typeof center[0] === "number" &&
    typeof center[1] === "number";
  const validRadius =
    typeof radius === "number" && radius >= 20 && radius <= 2000;

  if (!petId || !validCenter || !validRadius) {
    return NextResponse.json(
      {
        error:
          "petId, center as [lat,lng] and radius (20–2000 meters) are required",
      },
      { status: 400 }
    );
  }

  setGeofence(petId, center, radius);
  return NextResponse.json({ geofence: getGeofence(petId) });
}
