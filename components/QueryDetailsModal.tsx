'use client'

import { useState } from 'react'
import type { 
  Query, 
  PlayerPropQueryDetails, 
  GameOutcomeQueryDetails, 
  PlayerStatsQueryDetails, 
  PlayerComparisonQueryDetails 
} from '@/types/query'

interface QueryDetailsModalProps {
  query: Query | null
  isOpen: boolean
  onClose: () => void
}

export default function QueryDetailsModal({ query, isOpen, onClose }: QueryDetailsModalProps) {
  const [showRawJSON, setShowRawJSON] = useState(false)

  if (!isOpen || !query) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getQueryTypeColor = (type: string) => {
    switch (type) {
      case 'AI Prediction - Player Prop':
        return 'bg-blue-100 text-blue-800'
      case 'AI Prediction - Game Outcome':
        return 'bg-purple-100 text-purple-800'
      case 'Player Stats':
        return 'bg-green-100 text-green-800'
      case 'Player Comparison':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidenceBadge = (confidence: 'High' | 'Medium' | 'Low') => {
    const colors = {
      High: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-orange-100 text-orange-800'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[confidence]}`}>
        {confidence} Confidence
      </span>
    )
  }

  const renderPlayerPropDetails = (details: PlayerPropQueryDetails) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Player</p>
          <p className="font-semibold text-foreground">{details.playerName}</p>
          {details.team && <p className="text-sm text-muted-foreground">{details.team}</p>}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Prop Type</p>
          <p className="font-semibold text-foreground capitalize">{details.propType}</p>
        </div>
      </div>

      <div className="bg-primary/10 rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-1">Prediction</p>
        <p className="text-xl font-bold text-foreground">
          {details.overUnder.toUpperCase()} {details.threshold} {details.propType}
        </p>
        {details.projectedValue && (
          <p className="text-sm text-muted-foreground mt-1">
            Projected: {details.projectedValue.toFixed(1)} {details.propType}
          </p>
        )}
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">AI Recommendation</p>
        <p className="text-lg font-semibold text-blue-600">{details.prediction}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Confidence</p>
        {getConfidenceBadge(details.confidence)}
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Analysis</p>
        <p className="text-foreground leading-relaxed">{details.reasoning}</p>
      </div>

      {details.statsUsed && details.statsUsed.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Key Statistics Used</p>
          <ul className="space-y-1">
            {details.statsUsed.map((stat, index) => (
              <li key={index} className="text-sm text-muted-foreground">• {stat}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )

  const renderGameOutcomeDetails = (details: GameOutcomeQueryDetails) => (
    <div className="space-y-4">
      <div className="bg-purple-500/10 rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-2">Matchup</p>
        <p className="text-xl font-bold text-foreground">
          {details.team1} vs {details.team2}
        </p>
        {details.gameDate && (
          <p className="text-sm text-muted-foreground mt-1">{details.gameDate}</p>
        )}
      </div>

      {details.liveScore && (
        <div className="bg-destructive/10 rounded-lg p-4 border-l-4 border-destructive">
          <p className="text-sm text-destructive font-semibold mb-1">
            {details.liveScore.status === 'live' ? '🔴 LIVE' : 'FINAL'}
          </p>
          <p className="text-foreground">
            {details.team1}: {details.liveScore.team1Score} | {details.team2}: {details.liveScore.team2Score}
          </p>
        </div>
      )}

      <div>
        <p className="text-sm text-muted-foreground mb-2">Predicted Winner</p>
        <p className="text-2xl font-bold text-purple-600">{details.winner}</p>
        {details.scorePrediction && (
          <p className="text-sm text-muted-foreground mt-1">Score: {details.scorePrediction}</p>
        )}
      </div>

      {details.winProbability && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Win Probability</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-secondary rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
                style={{ width: `${details.winProbability}%` }}
              ></div>
            </div>
            <span className="text-lg font-bold text-foreground">{details.winProbability}%</span>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm text-muted-foreground mb-2">Confidence</p>
        {getConfidenceBadge(details.confidence)}
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Analysis</p>
        <p className="text-foreground leading-relaxed">{details.reasoning}</p>
      </div>

      {details.keyFactors && details.keyFactors.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Key Factors</p>
          <ul className="space-y-1">
            {details.keyFactors.map((factor, index) => (
              <li key={index} className="text-sm text-muted-foreground">• {factor}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )

  const renderPlayerStatsDetails = (details: PlayerStatsQueryDetails) => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Player</p>
        <p className="text-2xl font-bold text-foreground">{details.playerName}</p>
        <p className="text-muted-foreground">{details.team}</p>
        {details.position && (
          <p className="text-sm text-muted-foreground mt-1">{details.position}</p>
        )}
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Status</p>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          details.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {details.isActive ? '● Active' : 'Inactive'}
        </span>
      </div>

      {details.headlineStats && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">Headline Stats</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-primary/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">PPG</p>
              <p className="text-xl font-bold text-blue-600">{details.headlineStats.pts.toFixed(1)}</p>
            </div>
            <div className="bg-green-500/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">RPG</p>
              <p className="text-xl font-bold text-green-600">{details.headlineStats.reb.toFixed(1)}</p>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">APG</p>
              <p className="text-xl font-bold text-purple-600">{details.headlineStats.ast.toFixed(1)}</p>
            </div>
            <div className="bg-orange-500/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">PIE</p>
              <p className="text-xl font-bold text-orange-600">{details.headlineStats.pie.toFixed(3)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderPlayerComparisonDetails = (details: PlayerComparisonQueryDetails) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary/10 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Player 1</p>
          <p className="text-lg font-bold text-foreground">{details.player1.name}</p>
          <p className="text-sm text-muted-foreground">{details.player1.team}</p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Player 2</p>
          <p className="text-lg font-bold text-foreground">{details.player2.name}</p>
          <p className="text-sm text-muted-foreground">{details.player2.team}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">Season</p>
        <p className="font-semibold text-foreground">{details.season}</p>
      </div>

      {details.comparisonStats && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">Comparison Stats</p>
          <div className="space-y-2">
            {Object.entries(details.comparisonStats).map(([key, value]) => {
              if (value && typeof value === 'object' && 'player1' in value && 'player2' in value) {
                return (
                  <div key={key} className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-2 capitalize">{key}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-600">
                        {typeof value.player1 === 'number' ? value.player1.toFixed(1) : value.player1}
                      </span>
                      <span className="text-xs text-muted-foreground/70">vs</span>
                      <span className="text-sm font-semibold text-green-600">
                        {typeof value.player2 === 'number' ? value.player2.toFixed(1) : value.player2}
                      </span>
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      )}
    </div>
  )

  const renderDetails = () => {
    switch (query.query_type) {
      case 'AI Prediction - Player Prop':
        return renderPlayerPropDetails(query.details as PlayerPropQueryDetails)
      case 'AI Prediction - Game Outcome':
        return renderGameOutcomeDetails(query.details as GameOutcomeQueryDetails)
      case 'Player Stats':
        return renderPlayerStatsDetails(query.details as PlayerStatsQueryDetails)
      case 'Player Comparison':
        return renderPlayerComparisonDetails(query.details as PlayerComparisonQueryDetails)
      default:
        return <p className="text-muted-foreground">Unknown query type</p>
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

        {/* Modal panel */}
        <div 
          className="relative inline-block align-bottom bg-card/95 backdrop-blur-md rounded-xl border border-border/50 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Query Details</h3>
                <p className="text-sm text-blue-100 mt-1">{formatDate(query.created_at)}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Query Type Badge */}
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getQueryTypeColor(query.query_type)}`}>
                {query.query_type}
              </span>
            </div>

            {/* Main Details */}
            <div className="mb-6">
              {renderDetails()}
            </div>

            {/* Raw JSON Toggle */}
            <div className="border-t pt-4">
              <button
                onClick={() => setShowRawJSON(!showRawJSON)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showRawJSON ? '▼ Hide' : '▶ Show'} Raw JSON
              </button>
              
              {showRawJSON && (
                <pre className="mt-3 p-4 bg-secondary/30 rounded-lg text-xs overflow-x-auto text-foreground">
                  {JSON.stringify(query, null, 2)}
                </pre>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-secondary/30 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
