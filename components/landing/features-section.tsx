"use client"

import { Card } from "@/components/ui/card"
import { Brain, History, Lock, Download, TrendingUp, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const features = [
  {
    icon: Lock,
    title: "Secure Authentication",
    description: "Enterprise-grade security with encrypted login and signup. Your data is always protected.",
    color: "text-primary",
  },
  {
    icon: Brain,
    title: "AI-Powered Predictions",
    description: "Advanced machine learning models analyze thousands of data points to generate accurate predictions.",
    color: "text-accent",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Insights",
    description: "Get instant analysis and insights for any player or team with up-to-date statistics.",
    color: "text-chart-3",
  },
  {
    icon: History,
    title: "Query History",
    description: "Access your complete search history and review past predictions anytime, anywhere.",
    color: "text-chart-4",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get predictions in seconds with our optimized AI infrastructure and caching system.",
    color: "text-chart-5",
  },
  {
    icon: Download,
    title: "Export Results",
    description: "Download your predictions and analysis in multiple formats for easy sharing and reporting.",
    color: "text-primary",
  },
]

export function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
              }, index * 100)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="py-20 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-balance">
            Everything you need to make <span className="text-primary">winning predictions</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Powerful features designed for sports analysts, bettors, and enthusiasts who demand accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className={`p-6 sm:p-8 bg-card border-border hover:border-primary/50 transition-all duration-500 group cursor-pointer ${
                  visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-secondary flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-card-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
