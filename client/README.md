# Golafly — Frontend

Next.js 16 fan dashboard for the Golafly platform. Authentication, protected routing, and three data sections tickets, flights, hotels with filtering, pagination, and dark mode.

---

## Setup

```bash
cd client
pnpm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000
pnpm dev
```

Opens on `http://localhost:3000`. Backend must be running first.

---

## Folder Structure

```
client/src/
├── app/
│   ├── layout.tsx              Root layout — fonts, all providers, Toaster
│   ├── page.tsx                Redirects to /dashboard
│   ├── globals.css
│   ├── (auth)/
│   │   ├── layout.tsx          Split layout — brand panel left, form right
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── dashboard/
│       ├── layout.tsx          RSC — reads cookie, server-fetches user, redirects if bad
│       ├── page.tsx            Overview — welcome banner + featured items
│       ├── tickets/page.tsx    Full tickets list with filters + pagination
│       ├── flights/page.tsx
│       └── hotels/page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx        TanStack mutation, distinct error states, shake animation
│   │   ├── RegisterForm.tsx     Password strength meter, field stagger, auto-login on success
│   │   └── PasswordStrengthMeter.tsx  4-segment bar, Framer Motion stagger per segment
│   ├── dashboard/
│   │   ├── DashboardShell.tsx   Client wrapper — syncs RSC user to AuthContext
│   │   ├── Sidebar.tsx          Desktop nav, gold active state, user section + logout
│   │   ├── MobileSidebar.tsx    shadcn Sheet drawer, closes on nav
│   │   ├── Header.tsx           Breadcrumb, theme toggle, bell badge, user chip
│   │   └── WelcomeBanner.tsx    Gradient hero card, time-based greeting, decorative trophy
│   ├── tickets/
│   │   ├── TicketCard.tsx       Real ticket aesthetic — perforated divider, sold-out overlay
│   │   ├── TicketSkeleton.tsx   Pulse skeleton matching card layout exactly
│   │   └── TicketFilters.tsx    URL-param filters, mobile bottom sheet
│   ├── flights/
│   │   ├── FlightCard.tsx       IATA codes, dashed flight path, stops badge
│   │   ├── FlightSkeleton.tsx
│   │   └── FlightFilters.tsx
│   ├── hotels/
│   │   ├── HotelCard.tsx        Gradient image placeholder, star rating, amenity pills
│   │   ├── HotelSkeleton.tsx
│   │   └── HotelFilters.tsx
│   └── common/
│       ├── Logo.tsx             Trophy icon + Gola(white)fly(gold) text
│       ├── ThemeToggle.tsx      Sun/Moon icons, next-themes
│       ├── PageHeader.tsx       Title + icon + optional actions slot
│       ├── Pagination.tsx       Ellipsis logic, scroll-to-top on change
│       ├── EmptyState.tsx       Icon + title + description + optional CTA
│       └── ErrorBoundary.tsx    Class component, retry button
├── context/
│   └── AuthContext.tsx          user state, logout, getMe on mount, setUser
├── hooks/
│   ├── useUser.ts               Safe — throws if no user (only use inside dashboard)
│   ├── useTickets.ts            useQuery wrapping ticketsService
│   ├── useFlights.ts
│   ├── useHotels.ts
│   └── useDashboardOverview.ts
├── lib/
│   ├── axios.ts                 withCredentials, 401 interceptor, structured error re-throw
│   ├── queryClient.ts           staleTime 5min, retry 1, global mutation error toast
│   └── utils.ts                 cn, formatPrice, formatDate, getInitials, getGreeting, etc.
├── services/                    Plain async functions — NOT hooks
│   ├── auth.service.ts
│   ├── tickets.service.ts
│   ├── flights.service.ts
│   ├── hotels.service.ts
│   └── dashboard.service.ts
├── types/
│   ├── auth.types.ts            User, AuthResponse, ApiErrorResponse
│   └── data.types.ts            Ticket, Flight, Hotel, PaginationMeta, ApiResponse<T>
├── validators/
│   └── auth.validators.ts       Zod — mirrors backend schemas exactly
├── constants/
│   ├── routes.ts                ROUTES const — no magic strings anywhere
│   └── queryKeys.ts             TanStack Query key factory
└── middleware.ts                Edge middleware — cookie check, redirects
```

---

## Assessment Requirements

**Sign Up / Sign In with validation**
Both forms use `react-hook-form` + Zod with `mode: 'onBlur'` validation only fires when a user leaves a field, not on every keystroke. Password field has a live strength meter. Error messages from the backend map directly to the correct fields using `setError`. The validation rules on the frontend are identical to the backend Zod schemas.

**Authentication handling and error states**
Login distinguishes between two failure types: "User not found" shows an amber banner above the form with a link to register. "Wrong password" shows a red error on the password field and shakes the input. Everything else falls back to a toast. These aren't the same error they shouldn't look the same.

**Stay logged in**
The JWT cookie has a 7-day `maxAge`. On every page load, the dashboard layout reads the cookie server-side and fetches the user before rendering anything. `AuthContext` also calls `getMe()` on mount to rehydrate client state after a page refresh. If either fails, the user is redirected to login.

**Protect dashboard route**
Three layers: Edge Middleware checks the cookie exists before the page renders. The dashboard verifies the user via the API. `AuthContext` handles reactive logout. Accessing `/dashboard` without a cookie never reaches the page component.

**UI/UX — Golafly branding**
`#001c10` and `#e6b810` are extended as Tailwind tokens (`bg-brand`, `text-gold`). They're applied consistently across the sidebar, active states, badges, buttons, and accent elements.

**Mobile responsive**
Built mobile-first — 375px is the baseline. The sidebar becomes a slide-out Sheet on mobile. Filter bars collapse to a "Filters" button that opens a bottom Sheet. Cards stack single column on mobile, then 2-column on tablet, 3-column on desktop. All touch targets are at minimum 44×44px. Forms work correctly with mobile keyboards.

**Dark mode**
Every component has `dark:` Tailwind variants. Dark card background is `#0d1f14`it's a green-tinted dark that matches the brand. The sidebar stays the same brand green in both modes. Dark mode is user-controlled via a sun/moon toggle in the header, using next-themes.

---

## Architecture Decisions

### Services are functions, hooks are wrappers

`ticketsService.getAll()` is a plain async function. `useTickets()` is a hook that wraps it in a `useQuery` call. Components import hooks, hooks import services, services import the axios instance. Nothing reaches across layers. Changing the HTTP client, the caching strategy, or the API endpoint only touches one file.

### Filter state lives in the URL

The tickets, flights, and hotels pages use `useSearchParams` and `router.replace()` for all filter state. This means filtered views are bookmarkable, shareable, and the browser back button works correctly. The page filter doesn't reset if you open a ticket in a new tab. It also means the filter state survives a hard refresh.

### TanStack Query config

`staleTime: 5 minutes` match data doesn't change during a user session, so refetching the same page on every navigation is wasteful. `retry: 1` if an API call fails, try once more, then show the error state. `refetchOnWindowFocus: false` prevents jarring background refreshes mid-demo.

### Animation is functional, not decorative

---

## What would have done with more time

```
//  Social login (Google OAuth)  passport.js on backend, next-auth on frontend
//  Real booking flow  payment integration (Stripe, paypal)
//  Notifications  mark the bell badge as real data
//  Profile page  avatar upload, password change
//  Search  global search across tickets, flights, hotels
//  Better UI Design
```
