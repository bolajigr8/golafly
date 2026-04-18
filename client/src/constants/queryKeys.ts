export const queryKeys = {
  auth: { me: ['auth', 'me'] as const },
  tickets: {
    all: ['tickets'] as const,
    list: (p?: Record<string, unknown>) => ['tickets', 'list', p] as const,
    detail: (id: string) => ['tickets', id] as const,
  },
  flights: {
    all: ['flights'] as const,
    list: (p?: Record<string, unknown>) => ['flights', 'list', p] as const,
    detail: (id: string) => ['flights', id] as const,
  },
  hotels: {
    all: ['hotels'] as const,
    list: (p?: Record<string, unknown>) => ['hotels', 'list', p] as const,
    detail: (id: string) => ['hotels', id] as const,
  },
  dashboard: { overview: ['dashboard', 'overview'] as const },
} as const
