'use client'

import { motion } from 'framer-motion'
import type { ChatMessage as ChatMessageType } from '@/types/player-ai'
import EvidenceCard from './EvidenceCard'

interface ChatMessageProps {
  message: ChatMessageType
  playerHeadshotUrl: string
  onPropClick?: (prop: any) => void
}

export default function ChatMessage({ message, playerHeadshotUrl, onPropClick }: ChatMessageProps) {
  const isUser = message.type === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0">
          <img
            src={playerHeadshotUrl}
            alt="AI Assistant"
            className="w-full h-full rounded-full object-cover border border-border/50"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234B5563"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E'
            }}
          />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-card/80 backdrop-blur-sm border border-border/50 text-foreground'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {/* AI Response Additional Info */}
          {!isUser && message.aiResponse && (
            <div className="mt-3 space-y-3">
              {/* Confidence Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Confidence:</span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    message.aiResponse.confidence === 'High'
                      ? 'bg-green-100 text-green-700'
                      : message.aiResponse.confidence === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {message.aiResponse.confidence}
                </span>
              </div>
              
              {/* Evidence Games */}
              {message.aiResponse.evidence && message.aiResponse.evidence.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Evidence from games:</p>
                  <div className="grid gap-2">
                    {message.aiResponse.evidence.map((evidence, idx) => (
                      <EvidenceCard
                        key={idx}
                        evidence={evidence}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Suggested Props */}
              {message.aiResponse.suggested_props && message.aiResponse.suggested_props.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Suggested prop bets:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.aiResponse.suggested_props.map((prop, idx) => (
                      <button
                        key={idx}
                        onClick={() => onPropClick?.(prop)}
                        className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-lg border border-primary/20 transition-colors"
                        title={prop.reason}
                      >
                        {prop.stat}: {prop.threshold}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Cached indicator */}
              {message.aiResponse.cached && (
                <div className="text-xs text-muted-foreground/70 italic">
                  ⚡ Cached response
                </div>
              )}
            </div>
          )}
        </div>
        
        <div
          className={`text-xs text-muted-foreground/70 mt-1 ${isUser ? 'text-right' : 'text-left'}`}
        >
          {message.timestamp.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 flex-shrink-0 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">You</span>
        </div>
      )}
    </motion.div>
  )
}
