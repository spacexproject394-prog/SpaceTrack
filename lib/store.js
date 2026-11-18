// SpaceTrack in-memory store + implant simulator.
// Prototype only: state is lost on server restart; swap for a real DB later
// (schema in the project README/roadmap).

const WORLD = {
  center: [40.7128, -74.006],
  span: 0.01, // ~1 km box around the center
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function jitter(pos, scale) {
  return [
    clamp(pos[0] + (Math.random() - 0.5) * scale, WORLD.center[0] - WORLD.span / 2, WORLD.center[0] + WORLD.span / 2),
    clamp(pos[1] + (Math.random() - 0.5) * scale, WORLD.center[1] - WORLD.span / 2, WORLD.center[1] + WORLD.span / 2),
  ];
}

const db = {
  users: [],
  pets: [
    {
      id: "1",
      ownerId: null,
      name: "Whiskers",
      breed: "Domestic Shorthair",
      implantId: "ST-001",
      reportingMode: "adaptive",
      battery: 85,
      signal: "Strong",
      vetContact: "",
      location: [40.713, -74.0055],
    },
    {
      id: "2",
      ownerId: null,
      name: "Mittens",
      breed: "Siamese",
      implantId: "ST-002",
      reportingMode: "eco",
      battery: 40,
      signal: "Weak",
      vetContact: "",
      location: [40.714, -74.008],
    },
  ],
  positions: [
    // history is newest-first
    { petId: "1", position: [40.713, -74.0055], at: Date.now() },
    { petId: "2", position: [40.714, -74.008], at: Date.now() },
  ],
  implants: [
    { serial: "ST-001", registered: true },
    { serial: "ST-002", registered: true },
  ],
  alerts: [], // { petId, kind: "geofence" | "battery", at, message }
  geofences: {}, // petId -> { center: [lat,lng], radius: meters }
};

// Haversine distance in meters between two [lat,lng] points.
function distMeters(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const geofenceAlertAt = {};

// Reporting cadence (seconds) per mode.
const CADENCE = { live: 5, adaptive: 30, eco: 120 };

// How far a pet can wander per tick (degrees).
const STEP = { live: 0.0008, adaptive: 0.0012, eco: 0.0025 };

// Battery drain per tick (percentage points).
const DRAIN = { live: 0.4, adaptive: 0.15, eco: 0.05 };

let lastTickAt = {};

export function getPets() {
  return db.pets.map(petView);
}

export function getPet(id) {
  const pet = db.pets.find((p) => p.id === id);
  return pet ? petView(pet) : null;
}

export function getPositions(petId) {
  return petId
    ? db.positions.filter((p) => p.petId === petId)
    : db.positions;
}

export function getAlerts() {
  return db.alerts;
}

function petView(pet) {
  return {
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    chipRegistration: pet.chipRegistration,
    chipRegistrationDate: pet.chipRegistrationDate,
    chipRegistrationLocation: pet.chipRegistrationLocation,
    photo: pet.photo,
    implantId: pet.implantId,
    reportingMode: pet.reportingMode,
    battery: Math.round(pet.battery),
    signal: pet.battery > 50 ? "Strong" : pet.battery > 20 ? "Fair" : "Weak",
    lastSeen: lastTickAt[pet.id]
      ? `${Math.round((Date.now() - lastTickAt[pet.id]) / 1000)}s ago`
      : "Just now",
    location: pet.location,
  };
}

export function registerImplant({ serial, petName, breed, vetContact }) {
  const implant = db.implants.find(
    (i) => i.serial === serial.toUpperCase().trim() && !i.registered
  );
  if (!implant) return null;

  const pet = {
    id: String(db.pets.length + 1 + Math.floor(Math.random() * 1000)),
    ownerId: null,
    name: petName,
    breed: breed || "",
    implantId: implant.serial,
    chipRegistration: chipRegistration || "",
    chipRegistrationDate: chipRegistrationDate || "",
    chipRegistrationLocation: chipRegistrationLocation || "",
    photo: photo || null,
    reportingMode: "adaptive",
    battery: 100,
    signal: "Strong",
    vetContact: vetContact || "",
    location: [...WORLD.center],
  };
  implant.registered = true;
  db.pets.push(pet);
  db.positions.push({ petId: pet.id, position: pet.location, at: Date.now() });
  return petView(pet);
}

// Advance the simulated world. Each tick moves every pet according to its
// reporting mode, drains the battery, and appends a position history entry.
export function tick() {
  const now = Date.now();
  for (const pet of db.pets) {
    const mode = CADENCE[pet.reportingMode] ? pet.reportingMode : "adaptive";
    pet.location = jitter(pet.location, STEP[mode]);
    pet.battery = Math.max(0, pet.battery - DRAIN[mode]);

    if (pet.battery <= 20) {
      db.alerts.push({
        petId: pet.id,
        kind: "battery",
        at: now,
        message: `${pet.name}'s implant battery is low (${Math.round(pet.battery)}%).`,
      });
    }

    // Safe-zone containment check (max one alert per minute per pet).
    const gf = db.geofences[pet.id];
    if (gf && distMeters(gf.center, pet.location) > gf.radius) {
      const last = geofenceAlertAt[pet.id] || 0;
      if (now - last > 60000) {
        geofenceAlertAt[pet.id] = now;
        db.alerts.push({
          petId: pet.id,
          kind: "geofence",
          at: now,
          message: `${pet.name} left the safe zone.`,
        });
      }
    }

    db.positions.push({ petId: pet.id, position: [...pet.location], at: now });
    lastTickAt[pet.id] = now;

    // Keep history bounded (200 entries per pet).
    const history = db.positions.filter((p) => p.petId === pet.id);
    if (history.length > 200) {
      db.positions = db.positions.filter(
        (p) => !(p.petId === pet.id && p.at === history[0].at)
      );
    }
  }
  // Keep the alerts feed bounded.
  if (db.alerts.length > 100) db.alerts = db.alerts.slice(-100);
}

// Triggered by the geofence API once it exists; exposed for completeness.
export function pushAlert(alert) {
  db.alerts.push({ at: Date.now(), ...alert });
}

export function getGeofence(petId) {
  return db.geofences[petId] || null;
}

export function setGeofence(petId, center, radius) {
  db.geofences[petId] = { center, radius };
}

export { CADENCE };
