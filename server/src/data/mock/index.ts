/**
 * data/mock/index.ts
 *
 * Barrel export for all mock data fixtures.
 * Import from this file rather than from individual fixture files so
 * that when the mock layer is replaced with real DB queries, only
 * data.service.ts needs to change — nothing else.
 */

export { mockTickets } from './tickets.js'
export { mockFlights } from './flights.js'
export { mockHotels } from './hotels.js'
