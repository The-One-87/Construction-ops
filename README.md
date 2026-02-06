# Construction Ops (Production Monorepo)

Multi-tenant Construction/Service Operations SaaS.

## Local Run (Docker)
1. Copy env templates:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env.local`
2. Start:
   - `docker compose up --build`

## Ports
- Frontend: http://localhost:3000
- Backend:  http://localhost:8000  (health: /api/health)
- Postgres: localhost:5432

## Demo accounts (only when SEED_DEMO=true)
- super-admin: admin@constructionops.com / admin123
- client: client@demo.com / client123
