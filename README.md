# Karthikeyan Ajith Portfolio

The existing portfolio is a vanilla HTML/CSS/JavaScript site, built as a static Vite frontend. Its API is an Express and TypeScript service. The React files are retained as the original unused scaffold; the live portfolio page and its interactions remain the vanilla implementation.

## Project layout

```text
frontend/   Static portfolio, images, CSS, browser JavaScript, and Vite config
backend/    Express API, routes, contact model/controller, database config, and JSON fallback
```

## Local development

Install dependencies from the repository root with `npm install`. Run the services in separate terminals:

```sh
npm run dev:backend
npm run dev:frontend
```

The backend listens on port 5000 by default. The frontend listens on port 5173 and proxies `/api` requests to the backend during development. Set `FRONTEND_URL=http://localhost:5173` in `backend/.env` (see `backend/.env.example`). Set `VITE_API_URL` in `frontend/.env` for deployment; use the backend origin without a trailing slash. Leave it blank for local development.

## Render deployment

Deploy two services from this repository:

### Frontend: Static Site

- Root Directory: `frontend`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Environment: `VITE_API_URL=https://karthikeyan-ajith-portfolio-backend.onrender.com`

### Backend: Web Service

- Root Directory: `backend`
- Build Command: `npm ci && npm run build`
- Start Command: `npm start`
- Environment: `FRONTEND_URL=https://karthikeyan-ajith-portfolio-uxty.onrender.com`, plus `MONGODB_URI` and SMTP values as needed
- Health check path: `/health`

`MONGODB_URI` is optional for local development: without it, contact messages are stored in `backend/data/contacts.json`. Render's local filesystem is ephemeral, so configure MongoDB for contact records that must survive service restarts or redeploys. Configure all four SMTP values on Render to send notification emails. Without SMTP settings, production still stores submissions and returns promptly, but skips email notification. The Ethereal test-email fallback is for local development only.

## API routes

- `GET /api/about`
- `GET /api/skills`
- `GET /api/projects`
- `POST /api/contact`
- `GET /health`

Contact submissions are private and are not exposed through a read endpoint. The local JSON file is ignored by Git; use MongoDB for durable production storage because Render's local filesystem is ephemeral.

The contact form submits to `POST /api/contact`. The portfolio loads its About, Skills, and Projects data from the corresponding GET endpoints.
