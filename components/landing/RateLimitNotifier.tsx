'use client'

import { useState, useEffect } from 'react'

export function RateLimitNotifier() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div 
          className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 flex items-start gap-4 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex-shrink-0">
            <svg 
              className="w-6 h-6 text-blue-500" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Free Project Notice
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Since this is a free project, the AI may be rate limited. If that happens, please try again later.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
