# SpaceTrack — Interactive Elements & Features Manual
## Concept / Prototype | Founded by Vanessa Zamzow | All original artwork

---

## Table of Contents
1.  Dashboard ( `/` )
2.  Authentication ( `/auth/sign-up`, `/auth/log-in` )
3.  Implant Registration ( `/auth/register-implant` )
4.  Lost Pet Page ( `/lost-pet` )
5.  Pet Detail ( `/pet/[id]` )
6.  API Endpoints
7.  Simulator Behavior

---

## 1. Dashboard ( `/` )

| Element | Type | Function | State / Behavior |
|---|---|---|---|
| **Logo** (top-left) | SVG image | Returns to home; shows "SpaceTrack" wordmark + gold signal arcs + cream cat silhouette inside plum shield. Clickable. | Always visible; founder signature "Vanessa Zamzow" appears below wordmark on hover/focus. |
| **Reporting mode selector** | `<select>` | Toggle between Live / Adaptive / Eco reporting cadence. | Live: 5s ticks, batteries drain fastest; Eco: 120s ticks, slowest drain; Adaptive: 30s. |
| **Pet list items** | Clickable cards | Click to select a pet for detail view. | Selected pet gets `border-primary bg-primary/5`; unselected gets `border-border hover:bg-slate-50`. |
| **Device panel — Battery bar** | Progress bar | Shows selected pet's battery level. | Green >50%, Amber >20%, Red ≤20%. |
| **Device panel — Signal** | Text | Strong / Fair / Weak based on battery. | Auto-updates as battery changes. |
| **Device panel — Last report** | Text | "Just now", "2 min ago", etc. | Relative to current time; advances as simulator ticks. |
| **Device panel — Firmware** | Static text | "1.0.0". | Never changes. |
| **Device panel — Reporting mode** | Text | Capitalized mode name (Live/Adaptive/Eco). | Mirrors the selector above. |
| **Report lost** link | Button (rounded-accent) | Jumps to `/lost-pet?id=<petId>`. | Always enabled. |
| **Register implant** link | Button (bordered) | Jumps to `/auth/register-implant`. | Always enabled. |

---

## 2. Authentication Pages

### 2A. Sign‑up ( `/auth/sign-up` )

| Element | Type | Function |
|---|---|---|
| **Create Account** button | Primary submit | Submits form; if valid, shows alert "Account created! Please log in." and clears errors. |
| **Name** input | Text field | Required. Placeholder: "Full name". |
| **Email** input | Email field | Required. Placeholder: "you@email.com". |
| **Password** input | Password field | Required. Placeholder: "At least 6 characters". Minimum 6 chars enforced. |
| **Confirm Password** input | Password field | Required. Must match `password` field. |
| **Error banner** | Red bg-white text | Appears if passwords don't match or password < 6 chars. |
| **Login link** | Text link | `"Already have an account? Log in"` → `/auth/log-in`. |

### 2B. Log‑in ( `/auth/log-in` )

| Element | Type | Function |
|---|---|---|
| **Log In** button | Primary submit | Submits form; on success, shows alert "Logged in successfully!" and redirects (simulated). |
| **Email** input | Email field | Required. Placeholder: "you@email.com". |
| **Password** input | Password field | Required. Placeholder: "Enter your password". |
| **Error banner** | Red bg-white text | Appears if fields are empty. |
| **Register link** | Text link | `"Don't have an account? Create account"` → `/auth/sign-up`. |

### 2C. Register Implant ( `/auth/register-implant` )

| Element | Type | Function |
|---|---|---|
| **Register Implant** button | Primary submit | Validates serial number or QR code upload; on success, shows alert "Implant registered! A pet profile has been created." and adds pet to dashboard. |
| **Serial number** input | Text field | Placeholder: "ST-12345-ABCD". Optional if QR code is uploaded. |
| **QR code** section | File input + button | Upload a photo of the QR code (JPG/PNG/WebP). Visual preview + data URL stored in state. |
| **Pet name** input | Text field | Required. Placeholder: "Whiskers". |
| **Breed** input | Text field | Placeholder: "e.g., Domestic Shorthair, Siamese, Maine Coon". |
| **Vet contact** input | Text field | Placeholder: "Veterinary clinic name and phone". |
| **Error banner** | Red bg-white text | Appears if neither serial nor QR code provided. |
| **Back to log-in link** | Text link | `"Already have an implant? Log in"` → `/auth/log-in`. |

---

## 3. Lost Pet Page ( `/lost-pet` )

| Element | Type | Function |
|---|---|---|
| **Copy link** button | Secondary (rounded-md bg-primary) | Copies the current shareable URL to clipboard; shows "Copied!" transient text. |
| **Share link** input | Read-only text field | Contains `https://<tunnel>/lost-pet?id=<petId>`. |
| **Pet name** | H2 | Displayed at top (e.g., "Whiskers is missing"). |
| **Missing since** | Text | Relative date/time from simulated `escapedAt`. |
| **Implant badge** | Pill badge (bg-amber-100 text-amber-800) | Shows implant ID (e.g., "ST-001"). |
| **Location** | Text | "Last known location: 40.7128, -74.0060". |
| **Share instructions** | Body text | "Share this link with friends, family, or shelters to help find your pet." |
| **Back to home** | Link | "← Dashboard" in header. |

---

## 4. Pet Detail ( `/pet/[id]` )

| Element | Type | Function |
|---|---|---|
| **Back** link | Header link | `"← Dashboard"` returns to dashboard. |
| **Pet name + breed** | H1 + small text | e.g., "Whiskers · Domestic Shorthair". |
| **Battery card** | Rounded card | Shows `%` and signal strength (Strong/Fair/Weak). |
| **Signal card** | Rounded card | Shows signal quality. |
| **Last report card** | Rounded card | Shows timestamp. |
| **Reporting mode** | Text | Capitalized (Live/Adaptive/Eco). |
| **Location card** | Text | Latitude/longitude + link to open in maps (simulated). |
| **Lost pet link** | Button | `"Report lost →"` → `/lost-pet?id=<petId>`. |
| **Safe‑zone editor** | Map + controls | Click map to set center; radius slider (50–1000 m); "Save safe zone" button. Saves to `POST /api/geofences`. |
| **Recent positions** | Collapsible list | Last 20 position entries (timestamp + lat/lng). Auto‑updates each time the API is polled. |
| **Safe‑zone status** | Subtle teal circle on map | Renders if a geofence is set for this pet. |

### 4A. Safe‑Zone Editor (within Pet Detail)

| Element | Type | Function |
|---|---|---|
| **Map** | Leaflet + OpenStreetMap | Neighborhood view with pet marker + geofence circle. |
| **Radius slider** | HTML `<input type="range">` | Min 50 m, Max 1000 m, step 10 m. Updates `radius` state. |
| **Save safe zone** button | Primary submit | Calls `POST /api/geofences` with `{petId, center: [lat,lng], radius}`. On success, shows transient message "Safe zone saved." |
| **Center on pet** button | Secondary | Recaps map center to the pet's current location. |
| **Message banner** | Text (primary/secondary) | "Click the map to choose the safe‑zone center first." or "Safe zone saved." or error text. |

---

## 5. API Endpoints (Server‑side)

| Endpoint | Method | Params / Body | Response | Description |
|---|---|---|---|---|
| `/api/positions` | GET | `?petId=` (optional) | `{pets: [...], history: [...]}` | Returns latest positions for all pets (or one). Each call **advances the simulator one tick** (pets move, batteries drain, new history entry). |
| `/api/pets/[id]` | GET | `id` in URL | `{pet: {...}}` | Returns full pet detail (battery, signal, location, implantId, reportingMode, lastSeen). Also advances simulator. |
| `/api/implants` | GET | none | `{pets: [...]}` | Lists all registered pets. |
| `/api/implants` | POST | `{serial, petName, breed, vetContact}` | `{pet: {...}}` | Registers a new implant by serial number. If serial already registered, returns error. |
| `/api/geofences` | GET | `?petId=` (optional) | `{geofence: {center, radius} \| null}` | Returns a pet's safe‑zone, if one has been saved. |
| `/api/geofences` | POST | `{petId, center: [lat,lng], radius}` | `{geofence: {center, radius}}` | Saves/updates a pet's safe zone. Validation: radius must be 20–2000 meters, center must be valid lat/lng. |
| `/api/positions?petId=X` | GET | `petId=X` | Same shape as `/api/positions` but filtered. | Useful for per‑pet detail page. |

**Simulator behavior (per tick, triggered by any API call):**
- Each pet performs a random‑walk step (step size depends on reporting mode).
- Battery drains: Live 0.4%/tick, Adaptive 0.15%/tick, Eco 0.05%/tick.
- Low‑battery alert (≤20%) posted to `/api/positions` response `alerts` array.
- Geofence exit check: if a pet has a saved zone and its location moves outside the radius, one alert per minute is posted.
- Position history is kept to 200 entries per pet (newest first).

---

## 6. Simulator Behavior (Detailed)

| Mode | Tick interval (seconds) | Battery drain per tick | Max wander distance (per tick) |
|---|---|---|---|
| **Live** | 5 | 0.4% | Largest step |
| **Adaptive** | 30 | 0.15% | Medium step |
| **Eco** | 120 | 0.05% | Smallest step |

- **Every API call** (`/api/positions`, `/api/pets/[id]`, `/api/geofences` POST) triggers **one tick** of the simulator.
- The dashboard polls `/api/positions` **every 5 seconds** (client‑side `setInterval`), so the simulator advances naturally even without manual API calls.
- Batteries start at 100% for newly registered implants.
- The public link (`trycloudflare.com`) reflects the same state as `localhost:3000` because both hit the same in‑memory store.

---

## 7. UI Elements Summary (All Pages)

| Element | Appearance | Used On |
|---|---|---|
| **Primary button** | Rounded, bg-primary text-white hover:bg-primary-dark | Sign‑up, log‑in, register‑implant, save safe zone, report lost |
| **Secondary button** | Rounded, border border-border hover:bg-slate-50 | Back to dashboard, center on pet, register‑implant back link |
| **Danger/Error banner** | bg-red-100 text-red-800 p-3 rounded mb-4 | Validation errors on forms |
| **Success message** | bg-primary/10 text-primary p-3 rounded mb-4 | "Account created!", "Safe zone saved." |
| **Pill badge** | Small rounded tag (bg-amber-100 text-amber-800) | Implant ID on lost‑pet page |
| **Progress bar** | H-full rounded-full bg-slate-100 with bg-emerald/amber/red inner div | Battery level on dashboard + pet detail |
| **Compassrose select** | Rounded select with options Live/Adaptive/Eco | Dashboard header |
| **Range input** | Thin slider with min/max labels | Safe‑zone radius editor |
| **Toggle switches** | Rounded toggle (on/off) | Not used currently, reserved for future features |

---

## 8. Responsive Behaviour

| Breakpoint | Changes |
|---|---|
| **`sm` (640px+)** | Dashboard map height increases from 280px → 320px; pet detail map height 360px → 420px. |
| **`md` (768px+) | Two‑column layout on dashboard: map left, pet list + device panel right. |
| **`lg` (1024px+) | Full‑width map; pet detail sidebar fully visible; geofence slider full width. |
| **Phone (portrait)** | Map height constrains to 280px (dashboard) / 320px (pet detail). Single‑column stack; all buttons full‑width. The public link works identically — the Cloudflare tunnel renders the responsive layout in any browser. |

---

## 9. Accessibility & Notes

- **Focus-visible** rings are `2px solid var(--primary)` (plum `#5E2A52`) on all interactive elements.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` suppresses all animations and auto‑polling; the simulator stops ticking.
- **No external assets**: All SVG icons, logos, and cat markers are drawn inline in the codebase — nothing is copied from other sites (per the project rule).
- **Data is in‑memory**: The simulator and API store live only for the lifetime of the dev server/tunnel. Restarting the server resets all pet positions, batteries, and geofences.
- **Body temperature** is not currently exposed as a data point; the implant tracks only location, battery, and signal.

---

*End of manual — generated from the live SpaceTrack codebase (v1.0.0, Next.js 14.2.35, React 18.3.1).*