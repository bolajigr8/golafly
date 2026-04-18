'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary]', error, info)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className='flex flex-col items-center justify-center min-h-[400px] p-8 text-center'>
          <div className='flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/20 mb-4'>
            <AlertTriangle size={24} className='text-red-500' />
          </div>
          <h2
            className='text-lg font-bold text-slate-900 dark:text-white mb-2'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Something went wrong
          </h2>
          <p className='text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5'>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            onClick={this.handleRetry}
            className='px-5 py-2.5 rounded-xl bg-gold text-brand text-sm font-semibold hover:bg-gold-light transition-colors'
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
