'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { authService } from '@/services/auth.service'
import { loginSchema, type LoginFormData } from '@/validators/auth.validators'
import { useAuth } from '@/context/AuthContext'
import { FormField } from './FormField'
import { ROUTES } from '@/constants/routes'
import { getFirstName } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'

type LoginErrorType = 'user_not_found' | 'invalid_credentials' | 'generic'

function getErrorType(message: string): LoginErrorType {
  const m = message.toLowerCase()
  if (m.includes('not found') || m.includes('no account'))
    return 'user_not_found'
  if (m.includes('invalid') || m.includes('incorrect') || m.includes('wrong'))
    return 'invalid_credentials'
  return 'generic'
}

const shakeVariants = {
  idle: { x: 0 },
  shake: { x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.45 } },
}

const inputBase =
  'w-full h-12 pl-10 pr-4 rounded-xl text-sm border transition-all duration-200 bg-white dark:bg-[#0d1f14] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold'
const inputError = 'border-red-400 bg-red-50 dark:bg-red-900/10'
const inputNormal = 'border-slate-200 dark:border-slate-700'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [errorType, setErrorType] = useState<LoginErrorType | null>(null)
  const router = useRouter()
  const { setUser } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.data.user)
      toast.success(`Welcome back, ${getFirstName(data.data.user.fullName)}! `)
      router.push(ROUTES.DASHBOARD)
    },
    onError: (error: {
      message: string
      errors?: { field: string; message: string }[]
    }) => {
      const type = getErrorType(error.message)
      setErrorType(type)
      if (type === 'invalid_credentials') {
        setError('password', { message: 'Incorrect password' })
      } else if (type === 'generic') {
        if (error.errors?.length) {
          error.errors.forEach(({ field, message }) =>
            setError(field as keyof LoginFormData, { message }),
          )
        } else {
          toast.error(error.message)
          setErrorType(null)
        }
      }
    },
  })

  const isPending = mutation.isPending

  // Get register props so we can augment onChange without clobbering RHF's handler
  const emailRegisterProps = register('email')

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className='bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-white/8 shadow-2xl p-6 md:p-8'
    >
      <div className='mb-7'>
        <h1
          className='text-2xl font-black text-foreground mb-1'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Welcome back 👋
        </h1>
        <p className='text-sm text-muted-foreground'>
          Sign in to access your fan dashboard
        </p>
      </div>

      {/* User-not-found banner */}
      <AnimatePresence>
        {errorType === 'user_not_found' && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25 }}
            className='overflow-hidden mb-4'
          >
            <div className='flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'>
              <AlertTriangle
                size={15}
                className='text-amber-600 dark:text-amber-400 shrink-0 mt-0.5'
              />
              <div className='flex-1'>
                <p className='text-sm font-medium text-amber-800 dark:text-amber-300'>
                  No account found with this email.
                </p>
                <Link
                  href={ROUTES.REGISTER}
                  className='inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline mt-0.5'
                >
                  Create an account <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        // onSubmit={handleSubmit((d) => {
        //   setErrorType(null)
        //   mutation.mutate(d)
        // })}

        onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit((d) => {
            setErrorType(null)
            mutation.mutate(d)
          })(e)
        }}
        className='space-y-4'
        noValidate
      >
        {/* Email — augment RHF onChange to also clear error banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
        >
          <FormField
            label='Email address'
            error={errors.email?.message}
            required
          >
            <div className='relative'>
              <Mail
                size={16}
                className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground'
              />
              <input
                {...emailRegisterProps}
                type='email'
                placeholder='you@example.com'
                autoComplete='email'
                disabled={isPending}
                onChange={(e) => {
                  // Call RHF's handler first, then clear our banner state
                  void emailRegisterProps.onChange(e)
                  if (errorType) setErrorType(null)
                }}
                className={cn(
                  inputBase,
                  errors.email ? inputError : inputNormal,
                )}
              />
            </div>
          </FormField>
        </motion.div>

        {/* Password with shake on wrong credentials */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <FormField label='Password' error={errors.password?.message} required>
            <motion.div
              className='relative'
              variants={shakeVariants}
              animate={errorType === 'invalid_credentials' ? 'shake' : 'idle'}
            >
              <Lock
                size={16}
                className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground'
              />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                autoComplete='current-password'
                disabled={isPending}
                className={cn(
                  inputBase,
                  'pr-10',
                  errors.password ? inputError : inputNormal,
                )}
              />
              <button
                type='button'
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </motion.div>
          </FormField>
        </motion.div>

        {/* Remember me + Forgot */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className='flex items-center justify-between flex-wrap gap-2'
        >
          <label className='flex items-center gap-2 cursor-pointer group'>
            <input
              type='checkbox'
              className='w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-gold cursor-pointer'
              disabled={isPending}
            />
            <span className='text-sm text-muted-foreground group-hover:text-foreground transition-colors'>
              Remember me
            </span>
          </label>
          <span
            title='Coming soon'
            className='text-sm text-gold hover:text-gold-dark cursor-pointer transition-colors'
          >
            Forgot password?
          </span>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <button
            type='submit'
            disabled={isPending}
            className={cn(
              'w-full h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-bold mt-1',
              'bg-brand text-white hover:bg-brand-light',
              'transition-all duration-200 shadow-sm',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
            )}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className='animate-spin' /> Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </motion.div>
      </form>

      <div className='flex items-center gap-3 my-5'>
        <div className='flex-1 h-px bg-border' />
        <span className='text-xs text-muted-foreground'>
          Don&apos;t have an account?
        </span>
        <div className='flex-1 h-px bg-border' />
      </div>

      <Link
        href={ROUTES.REGISTER}
        className='flex items-center justify-center w-full h-11 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted hover:border-gold/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2'
      >
        Create an account
      </Link>
    </motion.div>
  )
}
