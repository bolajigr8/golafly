import { QueryClient, MutationCache } from '@tanstack/react-query'
import { toast } from 'sonner'

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // If the mutation has its own onError, let it handle it
      if (mutation.options.onError) return

      const e = error as { message?: string; status?: number }
      if (e.status !== 401) toast.error(e.message ?? 'Something went wrong.')
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        const e = error as { status?: number }
        if (e.status === 401 || e.status === 403) return false
        return failureCount < 1
      },
      refetchOnWindowFocus: false,
    },
  },
})
