export function TicketSkeleton() {
  return (
    <div className='relative bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-white/8 overflow-hidden p-5 animate-pulse'>
      <div className='absolute left-0 top-0 bottom-0 w-1.5 bg-slate-200 dark:bg-slate-700 rounded-l-2xl' />

      {/* Header */}
      <div className='flex items-start justify-between mb-3 pl-2'>
        <div className='h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-full' />
        <div className='h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full' />
      </div>

      {/* Teams */}
      <div className='flex items-center justify-center gap-3 my-4 pl-2'>
        <div className='h-6 flex-1 bg-slate-200 dark:bg-slate-700 rounded-lg' />
        <div className='h-5 w-8 bg-slate-200 dark:bg-slate-700 rounded' />
        <div className='h-6 flex-1 bg-slate-200 dark:bg-slate-700 rounded-lg' />
      </div>

      {/* Meta */}
      <div className='space-y-2 pl-2 mb-4'>
        <div className='h-3.5 w-48 bg-slate-200 dark:bg-slate-700 rounded' />
        <div className='h-3.5 w-36 bg-slate-200 dark:bg-slate-700 rounded' />
      </div>

      {/* Divider */}
      <div className='h-px w-full bg-slate-200 dark:bg-slate-700 my-4 mx-2' />

      {/* Stub */}
      <div className='pl-2 space-y-3'>
        <div className='flex justify-between'>
          <div className='space-y-1.5'>
            <div className='h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded' />
            <div className='h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded' />
          </div>
          <div className='text-right space-y-1.5'>
            <div className='h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded' />
            <div className='h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded' />
          </div>
        </div>
        <div className='h-11 w-full bg-slate-200 dark:bg-slate-700 rounded-xl' />
      </div>
    </div>
  )
}
