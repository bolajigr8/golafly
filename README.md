# Golafly — Fan Experience Platform (Assessment)

A full-stack football fan platform built as a technical assessment. Handles authentication, protected routing, and a fan dashboard with match tickets, flights, and hotel listings.

---

## What's Inside

```
golafly/
├── client/     Next.js 16 frontend
└── server/     Express + TypeScript backend
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm — `npm install -g pnpm`
- A free MongoDB Atlas account
- Git

---

### 1. Clone and install

```bash
git clone https://github.com/yourusername/golafly.git
cd golafly

# Install root dependencies (concurrently for running both servers)
pnpm install
```

---

### 2. Backend setup

```bash
cd server
pnpm install
cp .env.example .env
```

Open `.env` and fill in:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=          # from MongoDB Atlas (see below)
JWT_SECRET=           # any random string, 32+ characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

**MongoDB URI:**
For faster reviews, my online database connection string can be used (Wouldnt ever try this for a production application)

MONGODB_URI=mongodb+srv://micbol:Micbol2017@meetup-cluster.ee1nrx0.mongodb.net/golafly?appName=golafly

```bash
# Start the backend
pnpm dev
# Running on http://localhost:5000
```

---

### 3. Frontend setup

```bash
cd ../client
pnpm install
cp .env.example .env.local
```

Open `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
pnpm dev
# Running on http://localhost:3000
```

## Live Demo

|              | URL                                     |
| ------------ | --------------------------------------- |
| Frontend     | https://golafly-eight.vercel.app        |
| Backend API  | https://golafly.onrender.com            |
| Health Check | https://golafly.onrender.com/api/health |

> Render's free tier spins down after inactivity — if the first request is slow, give it 20–30 seconds to wake up. Everything after that is fast.

---

## Key Features

### Authentication

Most assessment submissions store the JWT in `localStorage`. I don't. The token lives in an `httpOnly` cookie, JavaScript can't access it, which kills the entire XSS attack surface. The backend sets it with `secure`, `sameSite: strict`, and a proper expiry.

On top of that, I implemented **token blacklisting**. When a user logs out, the token gets stored in a MongoDB collection with a TTL index. MongoDB auto-deletes it when the token expires, no cron jobs, no manual cleanup, zero operational overhead.
This would be replaced by access and refresh tokens in a real product

### Route protection

I use Next.js Edge Middleware to check for the cookie server-side before the page even renders. No flash of protected content, no `useEffect` redirect. On top of that, the dashboard layout is a React Server Component that fetches the current user and passes it down, so there's no loading spinner on the user's name either.

### Separation of concerns that can actually scale

The backend follows a strict service → controller → route pattern. Controllers are thin, they call a service and send a response. All business logic lives in services. The mock data is structured so that swapping it for real MongoDB queries only requires changing the service functions controllers and routes stay untouched.

### Validation on both ends

Zod schemas live on the backend and are mirrored on the frontend. Form errors match server errors exactly. The backend also validates environment variables at startup.

### Design that respects the brief

The Golafly colours (`#001c10` and `#e6b810`) are used as a real design system. Light and dark mode was done intentionally to try and score points above other applicants. The ticket cards look like actual tickets. The flight cards look like a booking UI.

---

## Tech Decisions at a Glance

| Decision           | What we chose              | Why                                      |
| ------------------ | -------------------------- | ---------------------------------------- |
| Auth storage       | httpOnly cookie            | Eliminates XSS token theft               |
| Token invalidation | MongoDB TTL index          | Zero-ops logout blacklisting             |
| Env validation     | Zod at startup             | Fail fast, typed config everywhere       |
| Route protection   | Next.js middleware + RSC   | No client flash, server-verified         |
| Data fetching      | TanStack Query v5          | Caching, stale-time, no redundant calls  |
| Validation         | Zod — backend and frontend | Single source of truth for rules         |
| Architecture       | Service/controller split   | Swap mock for DB without touching routes |

---

## Deployment

- **Backend → Render**: root directory `server`
- **Frontend → Vercel**: root directory `client`

Health check endpoint: `GET /api/health` confirms server status, database connection, uptime, and version.
