export interface Team {
  id: number | null
  name: string
  abbreviation: string
  city: string
}

export interface HeadlineStats {
  pts: number
  ast: number
  reb: number
  pie: number
}

export interface CareerStats {
  games_played: number
  games_started: number
  minutes: number
  points: number
  assists: number
  rebounds: number
  steals: number
  blocks: number
  field_goal_pct: number
  three_point_pct: number
  free_throw_pct: number
}

export interface SeasonStats {
  season: string
  team: string
  games_played: number
  points: number
  assists: number
  rebounds: number
  field_goal_pct: number
  three_point_pct: number
  free_throw_pct: number
}

export interface Player {
  id: number
  first_name: string
  last_name: string
  full_name: string
  is_active: boolean
  position: string
  height: string
  weight: string
  birthdate: string
  school: string
  country: string
  draft_year: string | number
  draft_round: string | number
  draft_number: string | number
  jersey: string | number
  headshot_url?: string
  team: Team
  headline_stats: HeadlineStats
  career_stats: CareerStats
  recent_season: SeasonStats
  seasons?: any[]  // Full season history
}

export interface PlayerResponse {
  success: boolean
  count: number
  data: Player[]
}

export interface PlayerSuggestion {
  id: number
  full_name: string
  first_name: string
  last_name: string
  is_active: boolean
  headshot_url?: string
  team_abbreviation?: string | null
}

export interface PlayerSearchResponse {
  success: boolean
  count: number
  data: PlayerSuggestion[]
}
