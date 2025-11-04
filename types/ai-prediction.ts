export interface PlayerPropPrediction {
  success: boolean
  playerName: string
  propType: string
  threshold?: number
  overUnder?: 'over' | 'under'
  opponent?: string
  prediction: string
  confidence: 'High' | 'Medium' | 'Low'
  reasoning: string
  statsUsed: string[]
  projectedValue: number
}

export interface GameOutcomePrediction {
  success: boolean
  team1: string
  team2: string
  gameDate?: string
  winner: string
  confidence: 'High' | 'Medium' | 'Low'
  reasoning: string
  scorePrediction: string
  keyFactors: string[]
  winProbability: number
}

export interface PlayerSeasonStats {
  success: boolean
  playerId: number
  playerName: string
  season: string
  seasonAverage: {
    gamesPlayed: number
    points: number
    rebounds: number
    assists: number
    steals: number
    blocks: number
    minutes: number
    fieldGoalPct: number
    threePointPct: number
    freeThrowPct: number
  }
  recentGames: Array<{
    gameId: string
    date: string
    opponent: string
    points: number
    rebounds: number
    assists: number
    steals: number
    blocks: number
    minutes: number
    fieldGoals: string
    threePointers: string
    freeThrows: string
    result: 'W' | 'L'
  }>
  last5Average: {
    points: number
    rebounds: number
    assists: number
    steals: number
    blocks: number
  }
}

export interface TeamStats {
  teamId: number
  teamName: string
  abbreviation: string
  wins: number
  losses: number
  winPct: number
  pointsPerGame: number
  pointsAllowed: number
  reboundsPerGame: number
  assistsPerGame: number
  stealsPerGame: number
  blocksPerGame: number
  turnoversPerGame: number
  fieldGoalPct: number
  threePointPct: number
  freeThrowPct: number
  gamesPlayed: number
  rank: number
}

export interface TeamInfo {
  id: number
  full_name: string
  abbreviation: string
  nickname: string
  city: string
  state?: string
  year_founded?: number
  logo_url?: string
}

export interface UpcomingGame {
  game_id: string
  game_date: string
  game_time: string
  home_team: TeamInfo
  visitor_team: TeamInfo
  matchup: string
}

export interface UpcomingGamesResponse {
  success: boolean
  count: number
  games: UpcomingGame[]
}

// Google Sports API types
export interface GoogleSportsTeam {
  name: string
  logo_url: string
  score?: number
}

export interface GoogleSportsGame {
  game_id: string
  team1: GoogleSportsTeam
  team2: GoogleSportsTeam
  date: string
  time?: string
  status: 'scheduled' | 'live' | 'final'
  venue?: string
  tournament?: string
}

export interface GoogleGamesResponse {
  success: boolean
  count: number
  games: GoogleSportsGame[]
  source: 'google_serpapi' | 'google_direct' | 'sample_data'
}

export interface TeamStatsResponse {
  success: boolean
  season: string
  teams: TeamStats[]
}

export interface TeamsListResponse {
  success: boolean
  teams: TeamInfo[]
}

// Prop type options for player predictions
export type PropType = 'points' | 'rebounds' | 'assists' | 'steals' | 'blocks' | 'minutes'

export const PROP_TYPES: { value: PropType; label: string }[] = [
  { value: 'points', label: 'Points' },
  { value: 'rebounds', label: 'Rebounds' },
  { value: 'assists', label: 'Assists' },
  { value: 'steals', label: 'Steals' },
  { value: 'blocks', label: 'Blocks' },
  { value: 'minutes', label: 'Minutes' },
]

// AI Player Comparison types
export interface PlayerComparisonAnalysis {
  success: boolean
  player1Name: string
  player2Name: string
  verdict: string // e.g., "Player 1 is the better overall player" or "Both players excel in different areas"
  confidence: 'High' | 'Medium' | 'Low'
  scoringComparison: {
    winner: string // player1, player2, or "tie"
    reasoning: string
    player1Score: number
    player2Score: number
  }
  reboundingComparison: {
    winner: string
    reasoning: string
    player1Rebounds: number
    player2Rebounds: number
  }
  playmaking: {
    winner: string
    reasoning: string
    player1Assists: number
    player2Assists: number
  }
  defense: {
    winner: string
    reasoning: string
    player1Defense: string // Combined steals + blocks metric
    player2Defense: string
  }
  efficiency: {
    winner: string
    reasoning: string
    player1FG: number
    player2FG: number
  }
  keyInsights: string[]
  modelUsed?: string
  fallbackTriggered?: boolean
}

export interface AIComparisonRequest {
  player1: any // Player object
  player2: any // Player object
}

export interface AIComparisonResponse {
  success: boolean
  analysis?: PlayerComparisonAnalysis
  error?: string
}
