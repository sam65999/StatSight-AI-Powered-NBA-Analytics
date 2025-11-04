export interface GameEvidence {
  date: string
  points?: number
  rebounds?: number
  assists?: number
  opponent: string
  note?: string
  [key: string]: any // Allow other stat fields
}

export interface SuggestedProp {
  stat: string
  threshold: string
  reason: string
}

export interface PlayerAIResponse {
  success: boolean
  playerId: number
  playerName: string
  question: string
  answer: string
  confidence: 'High' | 'Medium' | 'Low'
  evidence: GameEvidence[]
  suggested_props: SuggestedProp[]
  ai_placeholder: boolean
  cached?: boolean
  error?: string
}

export interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  aiResponse?: PlayerAIResponse
}

export interface PlayerAIData {
  id: number
  full_name: string
  position: string
  height: string
  weight: string
  team: any
  is_active: boolean
  headline_stats?: any
  career_stats?: any
  season_average?: any
  season_games?: any[]
}
