export function FlightSkeleton() {
  return (
    <div className='bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-white/8 p-5 animate-pulse'>
      <div className='flex items-start justify-between mb-4'>
        <div className='space-y-1.5'>
          <div className='h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded' />
          <div className='h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded' />
        </div>
        <div className='flex items-center gap-2'>
          <div className='h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full' />
          <div className='h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded' />
        </div>
      </div>
      <div className='flex items-center gap-4 my-5'>
        <div className='flex-1 space-y-2 text-center'>
          <div className='h-8 w-14 bg-slate-200 dark:bg-slate-700 rounded mx-auto' />
          <div className='h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mx-auto' />
          <div className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded mx-auto' />
        </div>
        <div className='flex-1 space-y-2 flex flex-col items-center'>
          <div className='h-px w-full bg-slate-200 dark:bg-slate-700' />
          <div className='h-3 w-14 bg-slate-200 dark:bg-slate-700 rounded' />
          <div className='h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded-full' />
        </div>
        <div className='flex-1 space-y-2 text-center'>
          <div className='h-8 w-14 bg-slate-200 dark:bg-slate-700 rounded mx-auto' />
          <div className='h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mx-auto' />
          <div className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded mx-auto' />
        </div>
      </div>
      <div className='flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/8'>
        <div className='h-3.5 w-40 bg-slate-200 dark:bg-slate-700 rounded' />
        <div className='h-11 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl' />
      </div>
    </div>
  )
}
