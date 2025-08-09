# Tecomon Aufgabe – Widgets Dashboard (Next.js + Fastify + MongoDB)

Dieses Projekt besteht aus:

- Frontend (Next.js, SWR) im Ordner `frontend/`
- Backend (Fastify, MongoDB/Mongoose, Zod) im Ordner `backend/`
- Wetterdaten via [Open-Meteo](https://open-meteo.com/) mit TTL-In-Memory-Cache

## 📦 Projektstruktur

```txt
/project-root
├── frontend/         -> Next.js Frontend (Dashboard)
│   ├── pages/
│   ├── components/
│   └── utils/
├── backend/          -> Node.js Backend (mit Fastify)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/     -> Wetterdaten-Logik inkl. Caching
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🚀 Setup-Anleitung

### Voraussetzungen

- Node.js v22+
- MongoDB lokal
- NPM

### 1. Backend starten

```bash
# Ins Backend wechseln
cd backend

# Env setzen
cp .env.example .env

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

> Beispiel `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/widgets
PORT=5000
```

### 2. Frontend starten

```bash
# Ins Frontend wechseln
cd ../frontend

# Env setzen
cp .env.example .env

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## 🔍 Funktionale Anforderungen

### Frontend (Dashboard)

- Widgets für beliebige Städte erstellen (z. B. Berlin, Hamburg, Paris)
- Live-Wetter pro Widget (Auto-Refresh Intervall ist über `.env` einstellbar)
- Widgets löschen
- Keine Authentifizierung

### Backend (API + MongoDB)

- REST-API: Widgets erstellen, abrufen und löschen
- MongoDB speichert: `_id`, `location`, `createdAt`
- Wetterdaten via Open-Meteo:
  - Geocoding API zur Ermittlung von Koordinaten
  - Forecast API für aktuelle Wetterdaten
  - In-Memory-Cache (TTL 5 Minuten) auf Location-Basis

## 🧾 API-Vorschlag

| Methode | Endpoint                | Beschreibung                              |
| ------: | ----------------------- | ----------------------------------------- |
|     GET | `/widgets`              | Liste aller gespeicherten Widgets         |
|    POST | `/widgets`              | Neues Widget erstellen (`{ location }`)   |
|  DELETE | `/widgets/:id`          | Widget löschen                            |
|     GET | `/weather?location=XYZ` | Wetterdaten für eine Location (mit Cache) |

Beispiele:

- `GET /widgets` → `[ { "_id": "...", "location": "Berlin", "createdAt": "..." } ]`
- `POST /widgets` Body `{ "location": "Berlin" }` → `201 Created`
- `DELETE /widgets/ID`
- `GET /weather?location=Berlin` → Wetterdaten (Temperatur, Wind, Feuchte)

## 🏗️ Architekturüberblick

- UI: Next.js (Pages Router), SWR für Datenfetching und Revalidierung
- API: Fastify mit Zod-Validierung, CORS aktiviert
- Datenbank: MongoDB via Mongoose, einfaches `Widget`-Schema
- Wetter-Service:
  - `geocoding-api.open-meteo.com` → lat/lon aus Stadtname
  - `api.open-meteo.com` → aktuelle Wetterdaten
  - `TTLCache` (Map-basiert) für Caching
- Entkopplung: Widgets-Endpunkte und Wetter-Endpunkt sind getrennt

## 🔒 Hinweise & Best Practices

- Validierung: Zod in Routen (`POST /widgets`, Query-Checks)
- Fehlerbehandlung: Fastify-Sensible (`res.badRequest`, `res.notFound`)
- CORS: Standardkonfiguration für lokale Entwicklung
- Konfiguration: `.env` Dateien, keine Secrets commiten
- Caching Klasse: Wurde nur zur Demonstration selbst entwickelt
- Scaling: Für mehrere Instanzen Cache durch Redis ersetzen
- Tests sind nicht enthalten (z.B. Jest, Supertest, Cucumber)

## ✅ Nächste Schritte

- UI-Verbesserung/Styling
- E2E-Tests (z. B. Playwright)
- Docker-Compose für MongoDB/Apps
- Rate-Limiting am Backend
- Optional: Persistenter Cache (Redis) statt In-Memory
- OpenAPI File erstellen
