import { Trophy, Ticket, Plane, Building2 } from 'lucide-react'
import { Logo } from '@/components/common/Logo'

const features = [
  { icon: Ticket, text: 'Match Tickets Worldwide' },
  { icon: Plane, text: 'Fan Travel Packages' },
  { icon: Building2, text: 'Stadium-Side Hotels' },
]

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div
        className='hidden md:flex md:w-2/5 flex-col justify-between p-10 relative overflow-hidden'
        style={{ background: '#001c10' }}
      >
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(230,184,16,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className='relative z-10'>
          <Logo size='lg' href='/' />
        </div>
        <div className='relative z-10 space-y-10'>
          <div>
            <p className='text-[11px] font-bold uppercase tracking-[0.2em] text-gold/70 mb-3'>
              Fan Experience Platform
            </p>
            <h2
              className='text-3xl xl:text-4xl font-black text-white leading-tight'
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Your World.
              <br />
              Your Game.
              <br />
              <span className='text-gold'>Your Stage.</span>
            </h2>
          </div>
          <ul className='space-y-5'>
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className='flex items-center gap-4'>
                <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 shrink-0'>
                  <Icon size={18} className='text-gold' />
                </div>
                <span className='text-white/80 text-sm font-medium'>
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className='relative z-10'>
          <p className='text-[10px] text-white/25 uppercase tracking-widest'>
            © 2026 Golafly
          </p>
        </div>
        <Trophy
          size={220}
          className='absolute -bottom-8 -right-8 text-gold opacity-[0.06] pointer-events-none'
        />
      </div>

      <div className='flex-1 flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#0a1f12] p-4 md:p-8 relative'>
        <div className='md:hidden mb-8'>
          <div
            className='inline-flex items-center gap-2 px-4 py-2 rounded-xl'
            style={{ background: '#001c10' }}
          >
            <Logo size='md' href='/' />
          </div>
        </div>
        <div className='w-full max-w-md'>{children}</div>
        <p className='md:hidden mt-6 text-xs text-muted-foreground'>
          © 2026 Golafly · Fan Experience Platform
        </p>
      </div>
    </div>
  )
}
