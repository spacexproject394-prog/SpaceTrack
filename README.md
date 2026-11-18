# SpaceTrack

**Concept / Prototype** — a pet-tracking web platform for cats and other pets,
designed around a (simulated) implant device. All code, text, and icons in this
repository are original work created for SpaceTrack; nothing is copied from any
other site or product.

> SpaceTrack is a software prototype. It does not make medical or health claims.
> Body temperature, if ever added, is treated strictly as a device data point.

## Our story

SpaceTrack was founded by **Vanessa Zamzow**, who dedicated her life to keeping
animals safe. The implant was created to reduce the deaths of pets whose collars
get caught or snagged and who cannot reach help in time — the "big brain" behind
bringing the idea to life turned that mission into a working tracking platform.

**Logo:** original "Guardian Signal" emblem — a plum shield (protection), a cream
cat silhouette (the animals), and gold signal arcs (the implant connection),
with a gold implant dot. Palette: deep plum `#5E2A52` + gold `#D4A017`.

## Features

- **Live neighborhood map** (Leaflet + OpenStreetMap) with illustrated-style
  cat markers; marker color reflects battery level (green / amber / red)
- **Pet dashboard** — battery bar, signal, last report, reporting mode
  (Live / Adaptive / Eco), firmware info
- **Pet detail page** (`/pet/[id]`) — battery/signal/location cards, position
  history, and a **safe-zone (geofence) editor**
- **Geofences** — click the map to set a safe-zone center, drag the radius
  slider (50–1000 m), save; pets outside their zone trigger alerts
- **Alerts feed** — low-battery and "left the safe zone" alerts surface in a
  banner on the dashboard
- **Lost-pet page** (`/lost-pet?id=…`) — shareable link with pet details and a
  copy-to-clipboard button
- **Auth pages** — sign-up, log-in, implant registration (serial number or QR
  photo upload + pet profile)
- **Implant simulator** — the backend simulates pets wandering the
  neighborhood, draining batteries per reporting mode, and logging position
  history. Every API call advances the simulation one tick.
- **Live updates** — the dashboard polls `/api/positions` every 5 seconds
  (WebSocket is the production upgrade path)

## Tech stack

Next.js 14 (App Router) · React 18 · Leaflet + react-leaflet 1.9.4 ·
Tailwind CSS 3 · TypeScript-ready (JS files today)

## Getting started

```powershell
cd "C:\Users\BASQUIAT-PC\OneDrive\Documents\Default Project\SpaceTrack"
npm install
npm run dev
```

Open http://localhost:3000

The dev script binds to `0.0.0.0`, so other devices on the same network can
reach the app at `http://<your-lan-ip>:3000` (find it with `ipconfig` → IPv4).

## Accessing from a phone / sharing a public link

**Same Wi-Fi (phone on the same router):** open `http://<your-lan-ip>:3000`.
The layout is responsive — the map shortens, and the dashboard stacks into a
single column below the `sm` breakpoint.

**Public link (anyone, anywhere):** run a tunnel to the local server.

```powershell
# Cloudflare quick tunnel — no account needed, clean URL
cloudflared tunnel --url http://127.0.0.1:3000
# -> https://<random-words>.trycloudflare.com

# Or ngrok (requires a free account + authtoken from dashboard.ngrok.com)
ngrok config add-authtoken <YOUR_TOKEN>
ngrok http 3000
```

Share the printed HTTPS URL — it works from any country while the tunnel runs.

> Keep in mind that this is a development server with an in-memory simulator:
> restarting the dev server resets the demo pets, and stopping the tunnel ends the
> public URL. For a permanent link, deploy to Vercel instead.

## Routes

| Route | Purpose |
|---|---|
| `/` | Dashboard (live map, pet list, battery panel, alerts) |
| `/pet/[id]` | Pet detail + safe-zone editor + position history |
| `/auth/sign-up` | Create account |
| `/auth/log-in` | Log in |
| `/auth/register-implant` | Register implant + create pet profile |
| `/lost-pet?id=…` | Shareable lost-pet notice |

## API

| Endpoint | Method | Description |
|---|---|---|
| `/api/implants` | GET | List pets |
| `/api/implants` | POST | Register implant (`serial`, `petName`, `breed`, `vetContact`) |
| `/api/positions` | GET | Latest positions + history (+ `?petId=` filter); includes alerts |
| `/api/pets/[id]` | GET | Pet detail |
| `/api/geofences?petId=` | GET | Get a pet's safe zone |
| `/api/geofences` | POST | Save a safe zone (`petId`, `center: [lat,lng]`, `radius` 20–2000 m) |

## Simulator behavior

Defined in `lib/store.js`:

- **Movement** — random walk within a ~1 km box around the demo neighborhood
  center (New York City coordinates); step size depends on reporting mode
- **Battery drain** — Live 0.4%/tick, Adaptive 0.15%/tick, Eco 0.05%/tick
- **Reporting cadence** — Live 5 s, Adaptive 30 s, Eco 120 s
- **Alerts** — battery ≤ 20 %; geofence exit (at most one alert per minute)
- **History** — last 200 positions per pet, newest first

State is in-memory and resets when the server restarts.

## Database schema (target design)

```sql
users        (id, name, email, password_hash, created_at)
pets         (id, owner_id → users, name, breed, implant_id → implants,
              reporting_mode, vet_contact, created_at)
implants     (serial PK, registered, firmware_version)
positions    (id, pet_id → pets, lat, lng, battery, signal, recorded_at)
geofences    (id, pet_id → pets, center_lat, center_lng, radius_m, created_at)
alerts       (id, pet_id → pets, kind, message, created_at)
sightings    (id, pet_id → pets, reporter_name, reporter_contact,
              note, lat, lng, created_at)   -- lost-pet reports
sessions     (token, user_id → users, expires_at)
```

## Roadmap

- [x] Dashboard with live map + battery panel
- [x] Auth pages (sign-up / log-in / implant registration)
- [x] Lost-pet shareable page
- [x] Implant simulator + position history
- [x] Geofence editor + containment alerts
- [x] Live updates via polling
- [ ] Real database (PostgreSQL + Prisma) replacing the in-memory store
- [ ] WebSocket push instead of polling
- [ ] Account/session auth with hashed passwords
- [ ] Lost-pet sighting form + community reports
- [ ] Mobile app shell / PWA
