'use client'

import { useState, useEffect } from 'react'
import { Info, X, Github, Globe, Mail } from 'lucide-react'

export function InfoButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  if (!mounted) return null

  return (
    <>
      {/* Floating Info Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 group"
        aria-label="About this project"
      >
        <Info className="w-6 h-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
          style={{ animation: 'fadeIn 0.3s ease-in-out' }}
        />
      )}

      {/* Info Card */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50 overflow-hidden transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideInScale 0.3s ease-out' }}
          >
            {/* Glow effect */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
            
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-border/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-foreground mb-1">About This Project</h2>
                  <p className="text-sm text-muted-foreground">StatSight</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors duration-200"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div className="space-y-3">
                <p className="text-sm text-foreground leading-relaxed">
                  StatSight is a sports betting analytics web app built to learn how to integrate AI features into full-stack web applications.
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  It helps users explore player statistics, compare performances, and view AI-assisted game insights.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This project was developed in under 20 hours as a personal learning experience and portfolio project.
                </p>
              </div>

              {/* Built With */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Built With</h3>
                <div className="flex flex-wrap gap-2">
                  {['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Supabase'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-xs font-medium bg-secondary/50 text-foreground rounded-lg border border-border/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connect Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Connect</h3>
                <div className="space-y-2">
                  {/* GitHub */}
                  <a
                    href="https://github.com/sam65999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-border/20 hover:border-border/40 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Github className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">GitHub</p>
                      <p className="text-xs text-muted-foreground truncate">@sam65999</p>
                    </div>
                    <svg className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  {/* Portfolio */}
                  <a
                    href="https://samsportfolio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-border/20 hover:border-border/40 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Portfolio</p>
                      <p className="text-xs text-muted-foreground truncate">samsportfolio.com</p>
                    </div>
                    <svg className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:samuelraidev@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-border/20 hover:border-border/40 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <p className="text-xs text-muted-foreground truncate">samuelr.aidev@gmail.com</p>
                    </div>
                    <svg className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-secondary/20 border-t border-border/30">
              <p className="text-xs text-center text-muted-foreground">
                Built with Next.js, Tailwind & Framer Motion
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  )
}
