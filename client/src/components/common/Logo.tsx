'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  href?: string
}

const sizeMap = {
  sm: { iconSize: 24, text: 'text-lg', gap: 'gap-1.5' },
  md: { iconSize: 32, text: 'text-xl', gap: 'gap-2' },
  lg: { iconSize: 40, text: 'text-2xl', gap: 'gap-2.5' },
}

export function Logo({
  size = 'md',
  className,
  href = '/dashboard',
}: LogoProps) {
  const { iconSize, text, gap } = sizeMap[size]
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <Link href={href} className={cn('flex items-center group', gap, className)}>
      <Image src='/golaflyIcon.png' alt='Golafly logo' width={50} height={50} />
      <span
        className={cn('font-bold tracking-tight', text)}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {isDashboard ? (
          <>
            <span className='text-gray-900 dark:text-white'>Gola</span>
            <span className='text-yellow-600 dark:text-gold'>fly</span>
          </>
        ) : (
          <>
            <span className='text-white'>Gola</span>
            <span className='text-yellow-600 dark:text-gold'>fly</span>
          </>
        )}
      </span>
    </Link>
  )
}
