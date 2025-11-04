// Query types for the Query History feature

export type QueryType = 
  | 'AI Prediction - Player Prop'
  | 'AI Prediction - Game Outcome'
  | 'Player Stats'
  | 'Player Comparison'

// Base query details interface
export interface BaseQueryDetails {
  timestamp: string
}

// AI Prediction - Player Prop details
export interface PlayerPropQueryDetails extends BaseQueryDetails {
  playerName: string
  playerId: number
  team?: string
  propType: string
  threshold: number
  overUnder: 'over' | 'under'
  prediction: string
  confidence: 'High' | 'Medium' | 'Low'
  projectedValue?: number
  reasoning: string
  statsUsed?: string[]
}

// AI Prediction - Game Outcome details
export interface GameOutcomeQueryDetails extends BaseQueryDetails {
  team1: string
  team2: string
  winner: string
  scorePrediction?: string
  winProbability?: number
  confidence: 'High' | 'Medium' | 'Low'
  reasoning: string
  keyFactors?: string[]
  gameDate?: string
  liveScore?: {
    team1Score?: number
    team2Score?: number
    status?: string
  }
}

// Player Stats search details
export interface PlayerStatsQueryDetails extends BaseQueryDetails {
  playerName: string
  playerId: number
  team: string
  position?: string
  isActive: boolean
  headlineStats?: {
    pts: number
    ast: number
    reb: number
    pie: number
  }
}

// Player Comparison details
export interface PlayerComparisonQueryDetails extends BaseQueryDetails {
  player1: {
    name: string
    id: number
    team: string
  }
  player2: {
    name: string
    id: number
    team: string
  }
  season: string
  comparisonStats?: {
    points?: { player1: number; player2: number }
    assists?: { player1: number; player2: number }
    rebounds?: { player1: number; player2: number }
    [key: string]: any
  }
}

// Union type for all query details
export type QueryDetails = 
  | PlayerPropQueryDetails 
  | GameOutcomeQueryDetails 
  | PlayerStatsQueryDetails 
  | PlayerComparisonQueryDetails

// Main Query interface (matches Supabase schema)
export interface Query {
  id: string
  user_id: string
  query_type: QueryType
  details: QueryDetails
  created_at: string
}

// API response types
export interface QueryResponse {
  success: boolean
  query?: Query
  error?: string
}

export interface QueriesListResponse {
  success: boolean
  queries: Query[]
  count: number
  error?: string
}

// Analytics summary
export interface QueryAnalytics {
  totalQueries: number
  mostRecentDate?: string
  mostCommonType?: QueryType
  queryTypeCounts: Record<QueryType, number>
}

// Request body for creating a query
export interface CreateQueryRequest {
  query_type: QueryType
  details: QueryDetails
}
