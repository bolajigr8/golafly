import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const cn = (...i: ClassValue[]) => twMerge(clsx(i))
export const formatPrice = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
export const formatDateShort = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
export const formatDateTime = (iso: string) =>
  `${formatDate(iso)} at ${formatTime(iso)}`
export const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2)
export const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max)}...` : text
export const getStatusColor = (s: 'available' | 'selling_fast' | 'sold_out') =>
  ({
    available:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    selling_fast:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    sold_out:
      'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  })[s]
export const getStatusLabel = (s: 'available' | 'selling_fast' | 'sold_out') =>
  ({
    available: 'Available',
    selling_fast: 'Selling Fast',
    sold_out: 'Sold Out',
  })[s]
export const getCategoryColor = (c: 'Standard' | 'Premium' | 'VIP') =>
  ({
    Standard:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    Premium: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    VIP: 'bg-gold/15 text-gold-dark dark:text-gold',
  })[c]
export const getFlightClassColor = (c: 'Economy' | 'Business' | 'First') =>
  ({
    Economy:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    Business: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    First: 'bg-gold/15 text-gold-dark dark:text-gold',
  })[c]
export const getStarArray = (stars: number) =>
  Array.from({ length: 5 }, (_, i) => i < stars)
export const getGreeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}
export const getFirstName = (name: string) => name.trim().split(' ')[0] ?? name
export const getOccupancyPercent = (avail: number, total: number) =>
  total === 0 ? 100 : Math.round(((total - avail) / total) * 100)
export const formatCompactNumber = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString()
