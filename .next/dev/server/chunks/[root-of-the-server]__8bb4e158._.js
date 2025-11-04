module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/ai-client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Unified AI Client for OpenRouter
 * Implements primary model with automatic fallback to secondary model
 * 
 * Primary Model: mistralai/mistral-small-3.1-24b-instruct:free
 * Fallback Model: deepseek/deepseek-chat-v3.1:free
 */ __turbopack_context__.s([
    "AIClient",
    ()=>AIClient,
    "AIClientError",
    ()=>AIClientError,
    "createAIClient",
    ()=>createAIClient,
    "parseAIResponse",
    ()=>parseAIResponse
]);
class AIClientError extends Error {
    statusCode;
    isRateLimitError;
    isTimeoutError;
    constructor(message, statusCode, isRateLimitError, isTimeoutError){
        super(message), this.statusCode = statusCode, this.isRateLimitError = isRateLimitError, this.isTimeoutError = isTimeoutError;
        this.name = 'AIClientError';
    }
}
class AIClient {
    apiKey;
    siteUrl;
    appTitle;
    // Model configuration
    PRIMARY_MODEL = 'mistralai/mistral-small-3.1-24b-instruct:free';
    FALLBACK_MODEL = 'deepseek/deepseek-chat-v3.1:free';
    OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
    // Timeout settings
    REQUEST_TIMEOUT = 30000 // 30 seconds
    ;
    constructor(config){
        if (!config.apiKey) {
            throw new AIClientError('OpenRouter API key is required');
        }
        this.apiKey = config.apiKey;
        this.siteUrl = config.siteUrl || 'http://localhost:3000';
        this.appTitle = config.appTitle || 'StatSight AI';
    }
    /**
   * Make a completion request with automatic fallback
   */ async complete(options) {
        let lastError = null;
        // Try primary model first
        try {
            console.log(`[AI Client] Attempting request with primary model: ${this.PRIMARY_MODEL}`);
            const content = await this.makeRequest(this.PRIMARY_MODEL, options);
            return {
                content,
                model_used: this.PRIMARY_MODEL,
                fallback_triggered: false
            };
        } catch (error) {
            lastError = this.handleError(error);
            console.error(`[AI Client] Primary model failed:`, lastError.message);
            // Don't fallback if it's not a recoverable error
            if (!this.shouldFallback(lastError)) {
                throw lastError;
            }
        }
        // Try fallback model
        try {
            console.log(`[AI Client] Attempting request with fallback model: ${this.FALLBACK_MODEL}`);
            const content = await this.makeRequest(this.FALLBACK_MODEL, options);
            return {
                content,
                model_used: this.FALLBACK_MODEL,
                fallback_triggered: true
            };
        } catch (error) {
            const fallbackError = this.handleError(error);
            console.error(`[AI Client] Fallback model also failed:`, fallbackError.message);
            // If both models fail, throw combined error
            throw new AIClientError(`Both AI models failed. Primary: ${lastError?.message}. Fallback: ${fallbackError.message}`, fallbackError.statusCode);
        }
    }
    /**
   * Make a request to OpenRouter API
   */ async makeRequest(model, options) {
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), this.REQUEST_TIMEOUT);
        try {
            const response = await fetch(this.OPENROUTER_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': this.siteUrl,
                    'X-Title': this.appTitle
                },
                body: JSON.stringify({
                    model,
                    messages: options.messages,
                    temperature: options.temperature ?? 0.3,
                    max_tokens: options.max_tokens ?? 600,
                    ...options.response_format && {
                        response_format: options.response_format
                    }
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            // Handle non-OK responses
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = errorText;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.error?.message || errorJson.message || errorText;
                } catch  {
                // Use raw text if JSON parse fails
                }
                throw new AIClientError(errorMessage, response.status, response.status === 429, false);
            }
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            if (!content) {
                throw new AIClientError('No content in AI response');
            }
            return content;
        } catch (error) {
            clearTimeout(timeoutId);
            // Handle abort/timeout
            if (error.name === 'AbortError') {
                throw new AIClientError(`Request timeout after ${this.REQUEST_TIMEOUT / 1000}s`, 408, false, true);
            }
            // Re-throw if already AIClientError
            if (error instanceof AIClientError) {
                throw error;
            }
            // Wrap other errors
            throw new AIClientError(error.message || 'Unknown error during AI request', 500);
        }
    }
    /**
   * Determine if we should attempt fallback based on error type
   */ shouldFallback(error) {
        // Fallback on rate limits, timeouts, and server errors
        if (error.isRateLimitError) {
            console.log('[AI Client] Rate limit detected, will attempt fallback');
            return true;
        }
        if (error.isTimeoutError) {
            console.log('[AI Client] Timeout detected, will attempt fallback');
            return true;
        }
        if (error.statusCode && error.statusCode >= 500) {
            console.log('[AI Client] Server error detected, will attempt fallback');
            return true;
        }
        // Don't fallback on client errors (400, 401, 403, etc.)
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
            console.log('[AI Client] Client error detected, will NOT attempt fallback');
            return false;
        }
        // Fallback on unknown errors
        return true;
    }
    /**
   * Convert various error types to AIClientError
   */ handleError(error) {
        if (error instanceof AIClientError) {
            return error;
        }
        if (error.name === 'AbortError') {
            return new AIClientError('Request timeout', 408, false, true);
        }
        return new AIClientError(error.message || 'Unknown error', error.statusCode || 500);
    }
}
function createAIClient(apiKey) {
    const key = apiKey || process.env.OPENROUTER_API_KEY;
    if (!key) {
        throw new AIClientError('OPENROUTER_API_KEY environment variable is not set');
    }
    return new AIClient({
        apiKey: key,
        siteUrl: ("TURBOPACK compile-time value", "http://localhost:3000") || 'http://localhost:3000',
        appTitle: 'StatSight AI Predictions'
    });
}
function parseAIResponse(content, fallback) {
    try {
        // Try to extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        // If no JSON found, return fallback
        console.warn('[AI Client] No JSON found in response, using fallback');
        return fallback;
    } catch (error) {
        console.error('[AI Client] Error parsing JSON:', error);
        return fallback;
    }
}
}),
"[project]/app/api/ai-comparison/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai-client.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { player1, player2 } = body;
        // Validate inputs
        if (!player1 || !player2) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Both players are required'
            }, {
                status: 400
            });
        }
        if (!player1.full_name || !player2.full_name) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid player data'
            }, {
                status: 400
            });
        }
        // Build the comparison prompt
        const prompt = buildComparisonPrompt(player1, player2);
        // Create AI client with automatic fallback
        const aiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAIClient"])();
        // Call AI with the comparison prompt
        const aiResponse = await aiClient.complete({
            messages: [
                {
                    role: 'system',
                    content: `You are an expert NBA analyst specializing in player comparisons. 
Analyze two players' statistics and provide detailed, objective comparisons across multiple dimensions.
Be specific with numbers and provide clear reasoning for each comparison.
Your analysis should be balanced, data-driven, and help users understand the strengths of each player.`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1500
        });
        // Parse the AI response
        const analysis = parseAIResponse(aiResponse.content, player1, player2, aiResponse.model_used, aiResponse.fallback_triggered);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error('AI Comparison API Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message || 'Failed to generate comparison analysis'
        }, {
            status: 500
        });
    }
}
/**
 * Build a comprehensive prompt for player comparison
 */ function buildComparisonPrompt(player1, player2) {
    return `
Compare these two NBA players and provide a detailed analysis:

PLAYER 1: ${player1.full_name}
Team: ${player1.team?.name || 'N/A'}
Position: ${player1.position}
Height: ${player1.height} | Weight: ${player1.weight} lbs

Current Season Stats (Per Game):
- Points: ${player1.recent_season?.points?.toFixed(1) || player1.headline_stats?.pts?.toFixed(1) || 'N/A'}
- Rebounds: ${player1.recent_season?.rebounds?.toFixed(1) || player1.headline_stats?.reb?.toFixed(1) || 'N/A'}
- Assists: ${player1.recent_season?.assists?.toFixed(1) || player1.headline_stats?.ast?.toFixed(1) || 'N/A'}
- Field Goal %: ${player1.recent_season?.field_goal_pct ? (player1.recent_season.field_goal_pct * 100).toFixed(1) : player1.career_stats?.field_goal_pct ? (player1.career_stats.field_goal_pct * 100).toFixed(1) : 'N/A'}%
- Three Point %: ${player1.recent_season?.three_point_pct ? (player1.recent_season.three_point_pct * 100).toFixed(1) : player1.career_stats?.three_point_pct ? (player1.career_stats.three_point_pct * 100).toFixed(1) : 'N/A'}%
- Free Throw %: ${player1.recent_season?.free_throw_pct ? (player1.recent_season.free_throw_pct * 100).toFixed(1) : player1.career_stats?.free_throw_pct ? (player1.career_stats.free_throw_pct * 100).toFixed(1) : 'N/A'}%

Career Stats (Per Game):
- Points: ${player1.career_stats?.points?.toFixed(1) || 'N/A'}
- Rebounds: ${player1.career_stats?.rebounds?.toFixed(1) || 'N/A'}
- Assists: ${player1.career_stats?.assists?.toFixed(1) || 'N/A'}
- Steals: ${player1.career_stats?.steals?.toFixed(1) || 'N/A'}
- Blocks: ${player1.career_stats?.blocks?.toFixed(1) || 'N/A'}
- Games Played: ${player1.career_stats?.games_played || 'N/A'}

---

PLAYER 2: ${player2.full_name}
Team: ${player2.team?.name || 'N/A'}
Position: ${player2.position}
Height: ${player2.height} | Weight: ${player2.weight} lbs

Current Season Stats (Per Game):
- Points: ${player2.recent_season?.points?.toFixed(1) || player2.headline_stats?.pts?.toFixed(1) || 'N/A'}
- Rebounds: ${player2.recent_season?.rebounds?.toFixed(1) || player2.headline_stats?.reb?.toFixed(1) || 'N/A'}
- Assists: ${player2.recent_season?.assists?.toFixed(1) || player2.headline_stats?.ast?.toFixed(1) || 'N/A'}
- Field Goal %: ${player2.recent_season?.field_goal_pct ? (player2.recent_season.field_goal_pct * 100).toFixed(1) : player2.career_stats?.field_goal_pct ? (player2.career_stats.field_goal_pct * 100).toFixed(1) : 'N/A'}%
- Three Point %: ${player2.recent_season?.three_point_pct ? (player2.recent_season.three_point_pct * 100).toFixed(1) : player2.career_stats?.three_point_pct ? (player2.career_stats.three_point_pct * 100).toFixed(1) : 'N/A'}%
- Free Throw %: ${player2.recent_season?.free_throw_pct ? (player2.recent_season.free_throw_pct * 100).toFixed(1) : player2.career_stats?.free_throw_pct ? (player2.career_stats.free_throw_pct * 100).toFixed(1) : 'N/A'}%

Career Stats (Per Game):
- Points: ${player2.career_stats?.points?.toFixed(1) || 'N/A'}
- Rebounds: ${player2.career_stats?.rebounds?.toFixed(1) || 'N/A'}
- Assists: ${player2.career_stats?.assists?.toFixed(1) || 'N/A'}
- Steals: ${player2.career_stats?.steals?.toFixed(1) || 'N/A'}
- Blocks: ${player2.career_stats?.blocks?.toFixed(1) || 'N/A'}
- Games Played: ${player2.career_stats?.games_played || 'N/A'}

---

Provide a comprehensive comparison in the following JSON format:
{
  "verdict": "A one-sentence overall verdict on who is better or if they excel in different areas",
  "confidence": "High" | "Medium" | "Low",
  "scoringWinner": "player1" | "player2" | "tie",
  "scoringReasoning": "Brief explanation comparing their scoring abilities",
  "reboundingWinner": "player1" | "player2" | "tie",
  "reboundingReasoning": "Brief explanation comparing their rebounding",
  "playmakingWinner": "player1" | "player2" | "tie",
  "playmakingReasoning": "Brief explanation comparing their playmaking/assists",
  "defenseWinner": "player1" | "player2" | "tie",
  "defenseReasoning": "Brief explanation comparing their defensive impact (steals + blocks)",
  "efficiencyWinner": "player1" | "player2" | "tie",
  "efficiencyReasoning": "Brief explanation comparing their shooting efficiency",
  "keyInsights": ["insight 1", "insight 2", "insight 3"]
}

Respond ONLY with valid JSON. Use the actual statistics provided to support your analysis.
`;
}
/**
 * Parse the AI response and structure it properly
 */ function parseAIResponse(content, player1, player2, modelUsed, fallbackTriggered) {
    try {
        // Try to extract JSON from the response
        let jsonContent = content.trim();
        // Remove markdown code blocks if present
        if (jsonContent.startsWith('```json')) {
            jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonContent.startsWith('```')) {
            jsonContent = jsonContent.replace(/```\n?/g, '');
        }
        const parsed = JSON.parse(jsonContent);
        // Extract stats for display
        const player1Stats = {
            points: player1.recent_season?.points || player1.headline_stats?.pts || 0,
            rebounds: player1.recent_season?.rebounds || player1.headline_stats?.reb || 0,
            assists: player1.recent_season?.assists || player1.headline_stats?.ast || 0,
            steals: player1.career_stats?.steals || 0,
            blocks: player1.career_stats?.blocks || 0,
            fg_pct: player1.recent_season?.field_goal_pct || player1.career_stats?.field_goal_pct || 0
        };
        const player2Stats = {
            points: player2.recent_season?.points || player2.headline_stats?.pts || 0,
            rebounds: player2.recent_season?.rebounds || player2.headline_stats?.reb || 0,
            assists: player2.recent_season?.assists || player2.headline_stats?.ast || 0,
            steals: player2.career_stats?.steals || 0,
            blocks: player2.career_stats?.blocks || 0,
            fg_pct: player2.recent_season?.field_goal_pct || player2.career_stats?.field_goal_pct || 0
        };
        return {
            success: true,
            player1Name: player1.full_name,
            player2Name: player2.full_name,
            verdict: parsed.verdict || 'Both players have unique strengths',
            confidence: parsed.confidence || 'Medium',
            scoringComparison: {
                winner: parsed.scoringWinner || 'tie',
                reasoning: parsed.scoringReasoning || 'Similar scoring output',
                player1Score: player1Stats.points,
                player2Score: player2Stats.points
            },
            reboundingComparison: {
                winner: parsed.reboundingWinner || 'tie',
                reasoning: parsed.reboundingReasoning || 'Comparable rebounding stats',
                player1Rebounds: player1Stats.rebounds,
                player2Rebounds: player2Stats.rebounds
            },
            playmaking: {
                winner: parsed.playmakingWinner || 'tie',
                reasoning: parsed.playmakingReasoning || 'Similar assist numbers',
                player1Assists: player1Stats.assists,
                player2Assists: player2Stats.assists
            },
            defense: {
                winner: parsed.defenseWinner || 'tie',
                reasoning: parsed.defenseReasoning || 'Comparable defensive impact',
                player1Defense: `${player1Stats.steals.toFixed(1)} stl, ${player1Stats.blocks.toFixed(1)} blk`,
                player2Defense: `${player2Stats.steals.toFixed(1)} stl, ${player2Stats.blocks.toFixed(1)} blk`
            },
            efficiency: {
                winner: parsed.efficiencyWinner || 'tie',
                reasoning: parsed.efficiencyReasoning || 'Similar shooting efficiency',
                player1FG: player1Stats.fg_pct,
                player2FG: player2Stats.fg_pct
            },
            keyInsights: parsed.keyInsights || [
                'Both players bring valuable skills to their teams',
                'Statistical comparison shows competitive performance',
                'Each player excels in different aspects of the game'
            ],
            modelUsed,
            fallbackTriggered
        };
    } catch (error) {
        console.error('Error parsing AI response:', error);
        // Fallback response with basic stats comparison
        return createFallbackComparison(player1, player2, modelUsed, fallbackTriggered);
    }
}
/**
 * Create a fallback comparison if AI parsing fails
 */ function createFallbackComparison(player1, player2, modelUsed, fallbackTriggered) {
    const p1Points = player1.recent_season?.points || player1.headline_stats?.pts || 0;
    const p2Points = player2.recent_season?.points || player2.headline_stats?.pts || 0;
    const p1Rebounds = player1.recent_season?.rebounds || player1.headline_stats?.reb || 0;
    const p2Rebounds = player2.recent_season?.rebounds || player2.headline_stats?.reb || 0;
    const p1Assists = player1.recent_season?.assists || player1.headline_stats?.ast || 0;
    const p2Assists = player2.recent_season?.assists || player2.headline_stats?.ast || 0;
    return {
        success: true,
        player1Name: player1.full_name,
        player2Name: player2.full_name,
        verdict: 'Both players demonstrate strong performance in their respective roles',
        confidence: 'Medium',
        scoringComparison: {
            winner: p1Points > p2Points ? 'player1' : p2Points > p1Points ? 'player2' : 'tie',
            reasoning: `${player1.full_name} averages ${p1Points.toFixed(1)} PPG vs ${player2.full_name}'s ${p2Points.toFixed(1)} PPG`,
            player1Score: p1Points,
            player2Score: p2Points
        },
        reboundingComparison: {
            winner: p1Rebounds > p2Rebounds ? 'player1' : p2Rebounds > p1Rebounds ? 'player2' : 'tie',
            reasoning: `${player1.full_name} averages ${p1Rebounds.toFixed(1)} RPG vs ${player2.full_name}'s ${p2Rebounds.toFixed(1)} RPG`,
            player1Rebounds: p1Rebounds,
            player2Rebounds: p2Rebounds
        },
        playmaking: {
            winner: p1Assists > p2Assists ? 'player1' : p2Assists > p1Assists ? 'player2' : 'tie',
            reasoning: `${player1.full_name} averages ${p1Assists.toFixed(1)} APG vs ${player2.full_name}'s ${p2Assists.toFixed(1)} APG`,
            player1Assists: p1Assists,
            player2Assists: p2Assists
        },
        defense: {
            winner: 'tie',
            reasoning: 'Both players contribute defensively to their teams',
            player1Defense: `${(player1.career_stats?.steals || 0).toFixed(1)} stl, ${(player1.career_stats?.blocks || 0).toFixed(1)} blk`,
            player2Defense: `${(player2.career_stats?.steals || 0).toFixed(1)} stl, ${(player2.career_stats?.blocks || 0).toFixed(1)} blk`
        },
        efficiency: {
            winner: 'tie',
            reasoning: 'Shooting efficiency is comparable between both players',
            player1FG: player1.recent_season?.field_goal_pct || player1.career_stats?.field_goal_pct || 0,
            player2FG: player2.recent_season?.field_goal_pct || player2.career_stats?.field_goal_pct || 0
        },
        keyInsights: [
            'Statistical comparison based on available season and career data',
            'Both players bring unique skills and strengths to their teams',
            'Performance metrics show competitive abilities across multiple categories'
        ],
        modelUsed,
        fallbackTriggered
    };
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8bb4e158._.js.map