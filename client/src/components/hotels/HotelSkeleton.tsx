export function HotelSkeleton() {
  return (
    <div className='bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-white/8 overflow-hidden animate-pulse'>
      <div className='h-36 sm:h-44 bg-slate-200 dark:bg-slate-700' />
      <div className='p-5 space-y-3'>
        <div className='space-y-1.5'>
          <div className='h-4 w-44 bg-slate-200 dark:bg-slate-700 rounded' />
          <div className='h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded' />
          <div className='flex gap-0.5 mt-1'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className='w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded-sm'
              />
            ))}
          </div>
        </div>
        <div className='space-y-1.5'>
          <div className='h-3 w-full bg-slate-200 dark:bg-slate-700 rounded' />
          <div className='h-3 w-36 bg-slate-200 dark:bg-slate-700 rounded' />
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-lg' />
          <div className='h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded' />
        </div>
        <div className='flex gap-1.5 flex-wrap'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-full'
            />
          ))}
        </div>
        <div className='space-y-1'>
          <div className='h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded' />
          <div className='h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded' />
        </div>
        <div className='flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/8'>
          <div className='space-y-1'>
            <div className='h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded' />
            <div className='h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded' />
          </div>
          <div className='h-11 w-24 bg-slate-200 dark:bg-slate-700 rounded-xl' />
        </div>
      </div>
    </div>
  )
}
