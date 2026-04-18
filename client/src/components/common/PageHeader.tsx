import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  actions?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
      <div className='flex items-center gap-3'>
        {Icon && (
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 dark:bg-gold/10 shrink-0'>
            <Icon size={20} className='text-gold' />
          </div>
        )}
        <div>
          <h1
            className='text-xl sm:text-2xl font-bold text-slate-900 dark:text-white'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h1>
          {description && (
            <p className='text-sm text-slate-500 dark:text-slate-400 mt-0.5'>
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className='flex items-center gap-2'>{actions}</div>}
    </div>
  )
}
