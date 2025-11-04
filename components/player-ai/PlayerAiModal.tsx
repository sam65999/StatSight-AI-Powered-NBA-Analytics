'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Player } from '@/types/player'
import type { ChatMessage as ChatMessageType, PlayerAIResponse } from '@/types/player-ai'
import ChatMessage from './ChatMessage'

interface PlayerAiModalProps {
  isOpen: boolean
  onClose: () => void
  player: Player
  seasonGames?: any[]
}

export default function PlayerAiModal({ isOpen, onClose, player, seasonGames = [] }: PlayerAiModalProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sessionId = useRef(Math.random().toString(36).substring(7))

  const playerHeadshotUrl = `https://cdn.nba.com/headshots/nba/latest/260x190/${player.id}.png`

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      
      // Send welcome message if first time opening
      if (messages.length === 0) {
        const welcomeMessage: ChatMessageType = {
          id: 'welcome',
          type: 'ai',
          content: `Hi! I'm your AI analyst for ${player.full_name}. I can answer questions about their recent performance, stats, consistency, and more. What would you like to know?`,
          timestamp: new Date()
        }
        setMessages([welcomeMessage])
      }
    }
  }, [isOpen, player.full_name, messages.length])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleSendMessage = async () => {
    const question = inputValue.trim()
    if (!question || isLoading) return

    // Add user message
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      // Prepare player data
      const playerData = {
        id: player.id,
        full_name: player.full_name,
        position: player.position,
        height: player.height,
        weight: player.weight,
        team: player.team,
        is_active: player.is_active,
        headline_stats: player.headline_stats,
        career_stats: player.career_stats,
        season_average: player.recent_season,
        season_games: seasonGames
      }

      // Call API
      const response = await fetch('/api/player-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: player.id,
          playerData,
          userQuestion: question,
          sessionId: sessionId.current
        }),
      })

      const data: PlayerAIResponse = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get AI response')
      }

      // Add AI response message
      const aiMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.answer,
        timestamp: new Date(),
        aiResponse: data
      }
      setMessages(prev => [...prev, aiMessage])

    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err.message || 'Failed to get response. Please try again.')
      
      // Add error message
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Sorry, I encountered an error: ${err.message || 'Unknown error'}. Please try asking your question again.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handlePropClick = (prop: any) => {
    // Pre-fill input with prop question
    setInputValue(`Should I bet ${prop.threshold} ${prop.stat}?`)
    inputRef.current?.focus()
  }

  const contextSize = seasonGames.length

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative bg-card/95 backdrop-blur-md rounded-xl shadow-2xl border border-border/50 w-full max-w-3xl max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-4 p-6 border-b border-border/50">
            <img
              src={playerHeadshotUrl}
              alt={player.full_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent && !parent.querySelector('.fallback')) {
                  const fallback = document.createElement('div')
                  fallback.className = 'fallback w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-2xl border-2 border-blue-500 shadow-md'
                  fallback.textContent = `${player.first_name.charAt(0)}${player.last_name.charAt(0)}`
                  parent.appendChild(fallback)
                }
              }}
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">
                Ask AI about {player.full_name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  {player.position} · {player.team.name}
                </span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
                  {contextSize} games loaded
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-secondary/20">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                playerHeadshotUrl={playerHeadshotUrl}
                onPropClick={handlePropClick}
              />
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 flex-shrink-0">
                  <img
                    src={playerHeadshotUrl}
                    alt="AI Assistant"
                    className="w-full h-full rounded-full object-cover border border-border/50"
                  />
                </div>
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="px-6 py-3 bg-red-50 border-t border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about consistency, matchups, prop bets..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-secondary/50 border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                maxLength={500}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Send'
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send · Esc to close
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
