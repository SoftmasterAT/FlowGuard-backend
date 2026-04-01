# FlowGuard Backend 🚰

FlowGuard is a smart water infrastructure monitoring system that simulates hydrant pressure and provides real-time analytics.

## 🧠 Features

* Hydrant pressure simulation
* Time-series data storage (TimescaleDB)
* REST API for frontend integration
* Redis-based event handling (optional)
* Leak simulation & repair

## 🛠 Tech Stack

* NestJS
* PostgreSQL (TimescaleDB)
* Redis
* Docker

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start services (local)

```bash
docker-compose up -d
```

### 3. Run backend

```bash
npm run start:dev
```

## 🌱 Seed Data

Initial hydrant data is generated via:

```bash
npm run seed
```

## 🌍 Deployment

Backend is deployed on Render.com
Frontend is hosted separately.

## 📌 Notes

* Coordinates in seed data can be adjusted to real locations.
* Pressure values are simulated.

---

## 👤 Author

FlowGuard Project by Softmaster
