# 🚰 FlowGuard Backend

FlowGuard ist eine Backend-Anwendung zur Simulation und Verwaltung von Wasserinfrastruktur – insbesondere Hydranten, Wasserdruck sowie Leck- und Reparaturszenarien.

Dieses Projekt wurde als praxisnahes Demo-System entwickelt, um reale Anwendungsfälle im Bereich Wasserinfrastruktur digital abzubilden und zu visualisieren.

---

## 🌐 Live Demo

Frontend (öffentlich verfügbar):  
👉 https://flowguard.softmaster.at/

---

## 🎯 Ziel des Projekts

Ziel war es, innerhalb kurzer Zeit ein funktionierendes End-to-End-System zu entwickeln, das:

- reale Infrastruktur-Daten modelliert
- Simulationen (z. B. Leaks, Druckveränderungen) ermöglicht
- als Grundlage für Visualisierung und interne Tools dienen kann

Das Projekt ist bewusst als **MVP (Minimum Viable Product)** umgesetzt und kann weiter in Richtung Production-System ausgebaut werden.

---

## ⚙️ Tech Stack

### Backend
- **NestJS** (TypeScript)
- **PostgreSQL** mit **TimescaleDB**
- **Redis** (Caching / Performance)
- **Docker**
- **REST API**

### Infrastruktur
- Deployment über **Render.com**
- Environment-Konfiguration über `.env`
- Redis & PostgreSQL über sichere Credentials

---

## 🧩 Features

### 🔧 Hydranten-Management
- CRUD (Create, Read, Update, Delete)
- Geodaten-basierte Speicherung
- Verwaltung über API

### 💧 Simulation
- Simulation von:
  - Wasserdruck
  - Leaks
  - Reparaturen
- Zeitbasierte Daten (TimescaleDB vorbereitet)

### 🛠 Admin-Funktionalität
- Admin-Rolle vorgesehen
- Verwaltung von Hydranten und Systemzuständen

### ⚡ Performance
- Redis für Caching integriert
- Vorbereitung für skalierbare Architektur

---

## 🏗️ Architektur (High-Level)

Das System folgt einer modularen Backend-Struktur:
src/
├── auth/
├── hydrants/
├── simulation/
├── users/



**Prinzipien:**
- Trennung von Controller / Service / Data Layer
- Erweiterbare Modulstruktur
- API-first Design

---

## 🔐 Sicherheit

- Environment Variablen (`.env`) für sensible Daten
- Datenbank-Zugänge geschützt
- Redis-Zugriff über Token abgesichert
- Vorbereitung für Role-Based Access (Admin)

---

## 🚀 Getting Started

### Voraussetzungen
- Node.js
- Docker (optional)
- PostgreSQL
- Redis

---

### Installation

```bash
git clone https://github.com/SoftmasterAT/FlowGuard-backend.git
cd FlowGuard-backend
npm install
```

### Environment konfigurieren
.env Datei erstellen:
```text
DATABASE_URL=your_postgres_url
REDIS_URL=your_redis_url
PORT=3000
```

### Starten
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🐳 Docker
```
docker-compose up --build
```

## 📡 API
Die API basiert auf REST-Prinzipien.

Beispiele:

- GET /hydrants
- POST /hydrants
- PATCH /hydrants/:id
- DELETE /hydrants/:id

## 🧪 Testing
Aktuell sind noch keine automatisierten Tests implementiert.

Geplante Erweiterungen:

- Unit Tests (Service Layer)
- Integration Tests
- API Tests


## 📚 Dokumentation
- Code ist mit JSDoc dokumentiert
- API-Dokumentation kann erweitert werden (z. B. Swagger)

## 👨‍💻 Autor

Nodar Abramishvili (Softmaster)

GitHub: https://github.com/SoftmasterAT
Projekt: FlowGuard