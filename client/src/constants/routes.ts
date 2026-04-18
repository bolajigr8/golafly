export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TICKETS: '/dashboard/tickets',
  FLIGHTS: '/dashboard/flights',
  HOTELS: '/dashboard/hotels',
} as const
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
