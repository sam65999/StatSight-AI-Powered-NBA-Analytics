'use client'

import type { GameEvidence } from '@/types/player-ai'

interface EvidenceCardProps {
  evidence: GameEvidence
  onClick?: () => void
}

export default function EvidenceCard({ evidence, onClick }: EvidenceCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-secondary/30 border border-border/50 rounded-lg p-3 hover:bg-secondary/50 hover:border-primary/50 transition-all text-left w-full"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          {evidence.date ? new Date(evidence.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }) : 'N/A'}
        </span>
        <span className="text-xs font-semibold text-primary">
          vs {evidence.opponent}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-1">
        {evidence.points !== undefined && (
          <div>
            <div className="text-xs text-muted-foreground">PTS</div>
            <div className="text-lg font-bold text-foreground">{evidence.points}</div>
          </div>
        )}
        {evidence.rebounds !== undefined && (
          <div>
            <div className="text-xs text-muted-foreground">REB</div>
            <div className="text-lg font-bold text-foreground">{evidence.rebounds}</div>
          </div>
        )}
        {evidence.assists !== undefined && (
          <div>
            <div className="text-xs text-muted-foreground">AST</div>
            <div className="text-lg font-bold text-foreground">{evidence.assists}</div>
          </div>
        )}
      </div>
      
      {evidence.note && (
        <p className="text-xs text-muted-foreground mt-2 italic">
          {evidence.note}
        </p>
      )}
    </button>
  )
}
