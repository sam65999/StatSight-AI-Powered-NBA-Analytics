"use client"

import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Check current auth status
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogin = () => {
    router.push('/login')
  }

  const handleSignUp = () => {
    router.push('/login')
  }

  const handleDashboard = () => {
    router.push('/dashboard')
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">StatSight</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost" 
              className="text-foreground hover:text-primary hidden sm:inline-flex"
              onClick={() => scrollToSection('features')}
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              className="text-foreground hover:text-primary hidden sm:inline-flex"
              onClick={() => scrollToSection('how-it-works')}
            >
              How It Works
            </Button>
            
            {loading ? (
              // Loading state
              <div className="w-24 h-10 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              // Logged in - Show "Go to Dashboard" button
              <Button 
                className="bg-primary hover:bg-primary/90 text-sm sm:text-base"
                onClick={handleDashboard}
              >
                Go to Dashboard
              </Button>
            ) : (
              // Logged out - Show "Log In" and "Sign Up" buttons
              <>
                <Button 
                  variant="outline" 
                  className="text-sm sm:text-base bg-transparent"
                  onClick={handleLogin}
                >
                  Log In
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-sm sm:text-base"
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
