# Golafly API — Backend

Express + TypeScript REST API handling authentication and fan dashboard data for the Golafly platform.

---

## Setup

```bash
cd server
pnpm install
cp .env.example .env
# Fill in .env (see root README for MongoDB Atlas steps)
pnpm dev
```

Server starts on `http://localhost:5000`.

To verify it's working: `GET http://localhost:5000/api/health`

---

## Folder Structure

```
server/
└── src/
    ├── server.ts                   Entry point — starts HTTP server, graceful shutdown
    ├── app.ts                      Express app factory — all middleware registered here
    ├── config/
    │   ├── env.ts                  Zod-validated env vars — typed `env` object used everywhere
    │   └── database.ts             Mongoose connect with retry logic (5 attempts, 5s apart)
    ├── models/
    │   ├── User.ts                 User schema — bcrypt pre-save hook, comparePassword method
    │   └── BlacklistedToken.ts     TTL index — MongoDB auto-deletes on token expiry
    ├── schemas/
    │   ├── auth.schema.ts          Zod schemas for register/login request bodies
    │   └── query.schema.ts         Zod schemas for ticket/flight/hotel query params
    ├── services/
    │   ├── auth.service.ts         registerUser, loginUser, logoutUser, getCurrentUser
    │   ├── token.service.ts        signToken, verifyToken, blacklistToken, isTokenBlacklisted
    │   └── data.service.ts         Filter, sort, paginate logic for all mock data
    ├── controllers/
    │   ├── auth.controller.ts      Thin — calls service, sends response
    │   └── data.controller.ts      Thin — same pattern
    ├── routes/
    │   ├── auth.routes.ts          /api/auth/*
    │   └── data.routes.ts          /api/tickets, /api/flights, /api/hotels, /api/dashboard
    ├── middleware/
    │   ├── auth.middleware.ts       verifyToken — blacklist check + attaches req.user
    │   ├── validate.middleware.ts   Zod factory — validates req.body, returns field errors
    │   ├── rateLimiter.middleware.ts authLimiter (5/15min), apiLimiter, globalLimiter, strictAuthLimiter
    │   └── error.middleware.ts      Global handler — ApiError, Mongoose errors, JWT errors, SyntaxError
    ├── utils/
    │   ├── ApiError.ts             Custom error class with static factories (badRequest, notFound, etc.)
    │   ├── asyncHandler.ts         Wraps async controllers — no try/catch in every controller
    │   └── response.ts             sendSuccess / sendError — consistent response shape
    ├── data/mock/
    │   ├── tickets.ts              12 real fixtures, dates from April 20 2026
    │   ├── flights.ts              12 routes connecting football cities
    │   └── hotels.ts               12 hotels near major stadiums
    └── types/
        ├── express.d.ts            Extends Request with req.user: { id, email }
        └── data.types.ts           Ticket, Flight, Hotel, PaginationMeta, PaginatedResponse<T>
```

---

## API Reference

### Auth Routes

| Method | Path                 | Auth   | Body                            |
| ------ | -------------------- | ------ | ------------------------------- |
| POST   | `/api/auth/register` | No     | `{ fullName, email, password }` |
| POST   | `/api/auth/login`    | No     | `{ email, password }`           |
| POST   | `/api/auth/logout`   | Cookie | —                               |
| GET    | `/api/auth/me`       | Cookie | —                               |

**Register response:**

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "createdAt": "..."
    }
  }
}
```

**Error response (field validation):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Must contain at least one uppercase letter"
    }
  ]
}
```

On success, the JWT is set as an `httpOnly` cookie it's not returned in the response body.

---

### Data Routes (all require auth cookie)

**Paginated response shape:**

```json
{
  "success": true,
  "message": "Tickets fetched successfully",
  "data": {
    "items": [...],
    "meta": {
      "total": 12,
      "page": 1,
      "limit": 6,
      "totalPages": 2,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### Health Check

```
GET /api/health
```

```json
{
  "status": "ok",
  "environment": "production",
  "timestamp": "2026-04-20T10:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "version": "1.0.0"
}
```

---

## Design Decisions

### httpOnly cookies over localStorage

Storing JWTs in localStorage means any injected script can steal them. `httpOnly` cookies are inaccessible to JavaScript entirely — XSS attacks can't touch the token. Combined with `sameSite: strict`, CSRF is also mitigated without a separate token.

### MongoDB TTL index for logout

When a user logs out, their valid token needs to be invalidated immediately. The options are: a Redis blocklist, a database table, or a cron job that periodically cleans up. We use a MongoDB collection with a TTL index `expireAfterSeconds: 0` on an `expires` field set to the token's expiry date. MongoDB's background process deletes the document automatically when the time comes. No extra infrastructure, no cron jobs, no drift between the token's real expiry and when it gets cleaned up.

### Zod at the environment level

Most apps fail when they hit a missing env var mid-request. I validated the entire `process.env` at startup using Zod. If anything is missing or malformed, the server refuses to start and logs exactly what's wrong. The `env` object exported from `config/env.ts` is fully typed no `process.env.WHATEVER` scattered through the codebase.

### Service/controller separation for mock → real DB migration

Controllers have no business logic they call a service function and send a response. The data services work on in-memory arrays right now. When this moves to a real database, only the service functions change. Routes, controllers, middleware, and response shapes stay exactly the same. This is the architecture you'd build if you knew the product was going to grow.

### Rate limiting per route category

Three separate rate limiters: `authLimiter` (5 requests per 15 minutes on login/register slows brute force), `apiLimiter` (100 per 15 minutes on data routes), and `globalLimiter` (200 per 15 minutes across everything). All return JSON not the default HTML page that breaks frontend error handling.

---

## With more time

```
//  Email verification  integrate Resend or SendGrid in auth.service.ts
//  Refresh token rotation for longer sessions without re-login
//  Winston structured logging for production log aggregation (Datadog, Logtail)
//  Mongoose models for Tickets, Flights, Hotels when replacing mock data
//  Password reset flow using strictAuthLimiter (already set up, 3/hour)
```

---

## Deployment (Render)
