import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description: string
  icon: LucideIcon
  action?: { label: string; onClick: () => void }
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-60 text-center py-12 px-6',
        className,
      )}
    >
      <div className='flex items-center justify-center w-24 h-24 rounded-full bg-gold/10 mb-5'>
        <Icon size={40} className='text-gold/60' />
      </div>
      <h3
        className='text-lg font-bold text-slate-900 dark:text-white mb-2'
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h3>
      <p className='text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-5'>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className='px-5 py-2.5 rounded-xl bg-gold text-brand text-sm font-semibold hover:bg-gold-light transition-colors'
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
