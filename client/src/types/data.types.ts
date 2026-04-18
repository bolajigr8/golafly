export interface Ticket {
  id: string
  homeTeam: string
  awayTeam: string
  stadium: string
  city: string
  country: string
  date: string
  kickoffTime: string
  competition: string
  category: 'Standard' | 'Premium' | 'VIP'
  section: string
  seat: string
  price: number
  currency: string
  availableSeats: number
  totalSeats: number
  status: 'available' | 'selling_fast' | 'sold_out'
  featured: boolean
}
export interface Flight {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  origin: { city: string; country: string; airport: string; code: string }
  destination: { city: string; country: string; airport: string; code: string }
  departure: string
  arrival: string
  duration: string
  stops: number
  class: 'Economy' | 'Business' | 'First'
  price: number
  currency: string
  seatsAvailable: number
  featured: boolean
}
export interface Hotel {
  id: string
  name: string
  brand: string
  city: string
  country: string
  address: string
  distanceToStadium: string
  stars: number
  rating: number
  reviewCount: number
  amenities: string[]
  checkIn: string
  checkOut: string
  nights: number
  pricePerNight: number
  currency: string
  roomType: string
  featured: boolean
}
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
export interface DashboardOverview {
  tickets: Ticket[]
  flights: Flight[]
  hotels: Hotel[]
}
export interface TicketQueryParams {
  page?: number
  limit?: number
  competition?: string
  status?: 'available' | 'selling_fast' | 'sold_out'
  category?: 'Standard' | 'Premium' | 'VIP'
  featured?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
export interface FlightQueryParams {
  page?: number
  limit?: number
  origin?: string
  destination?: string
  class?: 'Economy' | 'Business' | 'First'
  stops?: number
  featured?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
export interface HotelQueryParams {
  page?: number
  limit?: number
  city?: string
  stars?: number
  featured?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
