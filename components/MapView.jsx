"use client";

import { MapContainer, TileLayer, Circle, useMapEvents } from "react-leaflet";
import CatMarker from "./CatMarker";

// Forwards Leaflet click events up to the parent component.
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick?.([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function MapView({ pets, center, zoom = 15, geofence, onMapClick }) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geofence && (
        <Circle
          center={geofence.center}
          radius={geofence.radius}
          pathOptions={{ color: "#5E2A52", fillColor: "#5E2A52", fillOpacity: 0.08 }}
        />
      )}
      {pets.map((pet) => (
        <CatMarker key={pet.id} pet={pet} />
      ))}
      {onMapClick && <ClickHandler onMapClick={onMapClick} />}
    </MapContainer>
  );
}
