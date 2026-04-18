'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  password: string
}

type Score = 0 | 1 | 2 | 3 | 4

const scoreConfig = {
  0: { label: '', color: 'bg-slate-200 dark:bg-slate-700', textColor: '' },
  1: { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' },
  2: { label: 'Fair', color: 'bg-amber-400', textColor: 'text-amber-500' },
  3: { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-500' },
  4: {
    label: 'Strong',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-500',
  },
} as const

function calcScore(p: string): Score {
  if (!p) return 0
  if (p.length < 8) return 1
  const hasUpper = /[A-Z]/.test(p)
  const hasNum = /[0-9]/.test(p)
  const hasSpec = /[^A-Za-z0-9]/.test(p)
  if (hasUpper && hasNum && hasSpec) return 4
  if (hasUpper && hasNum) return 3
  return 2
}

export function PasswordStrengthMeter({ password }: Props) {
  const score = useMemo(() => calcScore(password), [password])
  const cfg = scoreConfig[score]

  return (
    <AnimatePresence>
      {password.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className='overflow-hidden'
        >
          <div className='pt-2 space-y-1.5'>
            {/* Four segments */}
            <div className='flex gap-1'>
              {([1, 2, 3, 4] as const).map((i) => (
                <motion.div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${score >= i ? cfg.color : 'bg-slate-200 dark:bg-slate-700'}`}
                  animate={{ opacity: score >= i ? 1 : 0.3 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                />
              ))}
            </div>
            {/* Label */}
            {cfg.label && (
              <p className={`text-xs font-medium text-right ${cfg.textColor}`}>
                {cfg.label}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
