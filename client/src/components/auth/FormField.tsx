'use client'

import { AnimatePresence, motion } from 'framer-motion'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({
  label,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className='space-y-1.5'>
      <label className='block text-sm font-medium text-foreground'>
        {label}
        {required && <span className='text-gold ml-0.5'>*</span>}
      </label>
      {children}
      <AnimatePresence mode='wait'>
        {error && (
          <motion.p
            key={error}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className='text-sm text-red-500 flex items-center gap-1'
          >
            <span aria-hidden>⚠</span> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
