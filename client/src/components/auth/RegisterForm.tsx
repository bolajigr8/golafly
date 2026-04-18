'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, Eye, EyeOff, Trophy, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { authService } from '@/services/auth.service'
import {
  registerSchema,
  type RegisterFormData,
} from '@/validators/auth.validators'
import { useAuth } from '@/context/AuthContext'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { FormField } from './FormField'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'

const inputBase =
  'w-full h-12 pl-10 pr-4 rounded-xl text-sm border transition-all duration-200 bg-white dark:bg-surface-dark placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold'
const inputError =
  'border-red-400 bg-red-50 dark:bg-red-900/10 focus:ring-red-300/30 focus:border-red-400'
const inputNormal = 'border-slate-200 dark:border-slate-700'

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { setUser } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const password = watch('password', '')

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setUser(data.data.user)
      toast.success('Welcome to Golafly! ', {
        description: 'Your account has been created.',
      })
      router.push(ROUTES.DASHBOARD)
    },
    onError: (error: {
      message: string
      errors?: { field: string; message: string }[]
    }) => {
      if (error.errors?.length) {
        error.errors.forEach(({ field, message }) =>
          setError(field as keyof RegisterFormData, { message }),
        )
      } else {
        toast.error(error.message)
      }
    },
  })

  const fields = [
    {
      name: 'fullName' as const,
      label: 'Full name',
      type: 'text',
      placeholder: 'John Doe',
      autoComplete: 'name',
      icon: User,
      extra: null,
    },
    {
      name: 'email' as const,
      label: 'Email address',
      type: 'email',
      placeholder: 'you@example.com',
      autoComplete: 'email',
      icon: Mail,
      extra: null,
    },
  ]

  const isPending = mutation.isPending

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className='bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-border-dark shadow-2xl p-6 md:p-8'
    >
      {/* Heading */}
      <div className='mb-7'>
        <div className='flex items-center gap-2 mb-1'>
          <h1
            className='text-2xl font-black text-foreground'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Create your account
          </h1>
          <Trophy size={20} className='text-gold' />
        </div>
        <p className='text-sm text-muted-foreground'>
          Join thousands of football fans worldwide
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit((d) => mutation.mutate(d))(e)
        }}
        className='space-y-4'
        noValidate
      >
        {/* Name + Email */}
        {fields.map(
          (
            { name, label, type, placeholder, autoComplete, icon: Icon },
            idx,
          ) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
            >
              <FormField label={label} error={errors[name]?.message} required>
                <div className='relative'>
                  <Icon
                    size={16}
                    className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground'
                  />
                  <input
                    {...register(name)}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={isPending}
                    className={cn(
                      inputBase,
                      errors[name] ? inputError : inputNormal,
                    )}
                  />
                </div>
              </FormField>
            </motion.div>
          ),
        )}

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.35 }}
        >
          <FormField label='Password' error={errors.password?.message} required>
            <div className='relative'>
              <Lock
                size={16}
                className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground'
              />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder='Create a strong password'
                autoComplete='new-password'
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
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <PasswordStrengthMeter password={password} />
          </FormField>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.35 }}
        >
          <button
            type='submit'
            disabled={isPending}
            className={cn(
              'w-full h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-bold',
              'bg-gold text-brand hover:bg-gold-light',
              'transition-all duration-200 shadow-sm hover:shadow-gold/30 hover:shadow-md',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
              'mt-2',
            )}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className='animate-spin' /> Creating account…
              </>
            ) : (
              'Create account'
            )}
          </button>
        </motion.div>
      </form>

      {/* Terms */}
      <p className='text-xs text-muted-foreground text-center mt-4'>
        By creating an account you agree to our{' '}
        <span className='underline cursor-pointer hover:text-foreground transition-colors'>
          Terms of Service
        </span>
      </p>

      {/* Sign in link */}
      <div className='flex items-center gap-3 my-5'>
        <div className='flex-1 h-px bg-border' />
        <span className='text-xs text-muted-foreground'>
          Already have an account?
        </span>
        <div className='flex-1 h-px bg-border' />
      </div>
      <Link
        href={ROUTES.LOGIN}
        className='flex items-center justify-center w-full h-11 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted hover:border-gold/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2'
      >
        Sign in instead
      </Link>
    </motion.div>
  )
}
