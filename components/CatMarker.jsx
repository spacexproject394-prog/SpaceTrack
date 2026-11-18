"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";

// Battery-colored cat pin, drawn as an inline SVG (original artwork,
// not copied from any external site).
function energyColor(energy) {
  if (energy > 50) return "#059669"; // green
  if (energy > 20) return "#d97706"; // amber
  return "#dc2626"; // red
}

function catIcon(energy) {
  const color = energyColor(energy);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
    <ellipse cx="18" cy="32" rx="5" ry="2.5" fill="rgba(15,23,42,0.2)"/>
    <circle cx="18" cy="16" r="10" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
    <path d="M11 9 L9 2.5 L15.5 5.5 Z" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
    <path d="M25 9 L27 2.5 L20.5 5.5 Z" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="14.5" cy="15" r="1.4" fill="#ffffff"/>
    <circle cx="21.5" cy="15" r="1.4" fill="#ffffff"/>
  </svg>`;

  return L.divIcon({
    className: "cat-marker",
    html: svg,
    iconSize: [36, 36],
    iconAnchor: [18, 30],
    popupAnchor: [0, -28],
  });
}

export default function CatMarker({ pet }) {
  // The API exposes `battery`; the local demo data used `energy`.
  const energy = pet.battery ?? pet.energy ?? 0;
  const { location, name, implantId, signal, lastSeen } = pet;
  return (
    <Marker position={location} icon={catIcon(energy)}>
      <Popup>
        <div className="min-w-[170px]">
          <h3 className="text-base font-semibold">{name}</h3>
          <p className="text-xs text-slate-500">Implant {implantId}</p>
          <div className="mt-2 space-y-0.5 text-sm">
            <p>Battery: {energy}%</p>
            <p>Signal: {signal}</p>
            <p>Last seen: {lastSeen}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
