# ImPrinta — Corporate Website

Production-ready corporate website with Next.js 15 frontend, FastAPI backend, and admin panel.

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, TailwindCSS, Framer Motion, next-intl
- **Backend:** FastAPI, SQLAlchemy 2, Alembic, PostgreSQL, JWT Auth
- **Infrastructure:** Docker, Docker Compose, Nginx, Let's Encrypt Ready

## Quick Start

```bash
docker compose up -d
```

Website: http://localhost
API Docs: http://localhost:8000/api/docs
Admin Panel: http://localhost/uz/admin/login

## Admin Credentials

- Username: `imprinta`
- Password: `admin3322`

## Languages

- Uzbek (default)
- Russian
- English

## Project Structure

```
├── frontend/          # Next.js 15 app
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/# UI components
│   │   ├── lib/       # API client
│   │   ├── i18n/      # Internationalization
│   │   └── styles/    # Global styles
│   └── messages/      # Translation files
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── api/       # REST endpoints
│   │   ├── core/      # Config, DB, Security
│   │   ├── models/    # SQLAlchemy models
│   │   └── services/  # Business logic
│   └── migrations/    # Alembic migrations
├── nginx/             # Reverse proxy config
├── docker-compose.yml
└── .env
```

## Features

- Responsive design (mobile-first)
- Light/Dark theme with LocalStorage persistence
- Framer Motion animations
- Glassmorphism UI
- Full admin CRUD panel
- JWT authentication with refresh tokens
- Image upload with WebP conversion
- PostgreSQL with UUID primary keys
- Alembic migrations
- Seed data
- SEO meta management
- Contact form with database storage
- Rate limiting ready
- CORS configured
- Security headers via Nginx

## Environment Variables

Copy `.env` and adjust values for production. Critical changes:
- `SECRET_KEY` — use a strong random key
- `POSTGRES_PASSWORD` — use a strong password
- `BACKEND_CORS_ORIGINS` — set your domain

## Production Deployment

1. Update `.env` with production values
2. Update `nginx/conf.d/default.conf` with your domain
3. Set up Let's Encrypt certificates
4. Run `docker compose up -d`
