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
"[project]/app/api/player-ai/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai-client.ts [app-route] (ecmascript)");
;
;
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes
;
// Rate limiting: simple in-memory store (use Redis in production)
const rateLimitStore = new Map();
const RATE_LIMIT_MAX = 20 // requests per window
;
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
;
async function POST(request) {
    try {
        const body = await request.json();
        const { playerId, playerData, userQuestion, sessionId } = body;
        // Validate required fields
        if (!playerId || !playerData || !userQuestion) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Missing required fields: playerId, playerData, userQuestion'
            }, {
                status: 400
            });
        }
        // Rate limiting check
        const rateLimitKey = sessionId || playerId.toString();
        const now = Date.now();
        const rateLimitData = rateLimitStore.get(rateLimitKey);
        if (rateLimitData) {
            if (now < rateLimitData.resetTime) {
                if (rateLimitData.count >= RATE_LIMIT_MAX) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        success: false,
                        error: 'Rate limit exceeded. Please wait a moment before asking another question.'
                    }, {
                        status: 429
                    });
                }
                rateLimitData.count++;
            } else {
                // Reset the rate limit window
                rateLimitStore.set(rateLimitKey, {
                    count: 1,
                    resetTime: now + RATE_LIMIT_WINDOW
                });
            }
        } else {
            rateLimitStore.set(rateLimitKey, {
                count: 1,
                resetTime: now + RATE_LIMIT_WINDOW
            });
        }
        // Check cache
        const cacheKey = `${playerId}-${userQuestion.toLowerCase().trim()}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                cached: true,
                ...cachedData.response
            });
        }
        // Sanitize user input to prevent prompt injection
        const sanitizedQuestion = sanitizeUserInput(userQuestion);
        // Build the structured prompt
        const prompt = buildPlayerAIPrompt(playerData, sanitizedQuestion);
        // Use unified AI client with automatic fallback
        try {
            const aiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAIClient"])();
            const aiResponse = await aiClient.complete({
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert NBA analyst. Use ONLY the provided playerData to answer questions. If you need to generalize beyond the data, mark it explicitly as inference. Keep responses concise and support claims with evidence from playerData. Always respond in valid JSON format.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 800,
                response_format: {
                    type: 'json_object'
                }
            });
            // Parse AI response with fallback
            const parsedResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAIResponse"])(aiResponse.content, {
                answer: 'Unable to provide answer',
                confidence: 'Low',
                evidence: [],
                suggested_props: [],
                ai_placeholder: false
            });
            // Validate and ensure required fields
            const validatedResponse = {
                answer: parsedResponse.answer || 'Unable to provide answer',
                confidence: parsedResponse.confidence || 'Medium',
                evidence: Array.isArray(parsedResponse.evidence) ? parsedResponse.evidence : [],
                suggested_props: Array.isArray(parsedResponse.suggested_props) ? parsedResponse.suggested_props : [],
                ai_placeholder: false
            };
            // Log which model was used
            if (aiResponse.fallback_triggered) {
                console.log(`[Player AI] Fallback model used: ${aiResponse.model_used}`);
            }
            const responseData = {
                success: true,
                playerId,
                playerName: playerData.full_name,
                question: sanitizedQuestion,
                ...validatedResponse,
                modelUsed: aiResponse.model_used,
                fallbackTriggered: aiResponse.fallback_triggered
            };
            // Cache the response
            cache.set(cacheKey, {
                response: responseData,
                timestamp: now
            });
            // Clean up old cache entries periodically
            if (cache.size > 100) {
                const entries = Array.from(cache.entries());
                entries.forEach(([key, value])=>{
                    if (now - value.timestamp > CACHE_DURATION) {
                        cache.delete(key);
                    }
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(responseData);
        } catch (aiError) {
            console.error('AI Client Error:', aiError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: aiError.message || 'AI service error'
            }, {
                status: aiError.statusCode || 500
            });
        }
    } catch (error) {
        console.error('Error in player AI route:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        }, {
            status: 500
        });
    }
}
/**
 * Sanitize user input to prevent prompt injection
 */ function sanitizeUserInput(input) {
    // Remove potentially harmful characters and limit length
    return input.replace(/[<>{}[\]]/g, '') // Remove brackets and braces
    .trim().substring(0, 500) // Limit to 500 characters
    ;
}
/**
 * Build the structured prompt for OpenRouter
 */ function buildPlayerAIPrompt(playerData, userQuestion) {
    // Prepare season games data
    const seasonGames = playerData.season_games || [];
    const last10Games = seasonGames.slice(-10);
    const last5Games = seasonGames.slice(-5);
    // Calculate recent form
    const recentForm = calculateRecentForm(last5Games);
    const prompt = `
[PLAYER_DATA_JSON]
${JSON.stringify({
        player: {
            id: playerData.id,
            full_name: playerData.full_name,
            position: playerData.position,
            height: playerData.height,
            weight: playerData.weight,
            team: playerData.team,
            is_active: playerData.is_active
        },
        season_aggregates: playerData.headline_stats || playerData.season_average || {},
        career_stats: playerData.career_stats || {},
        recent_form: recentForm,
        season_games: last10Games.map((game)=>({
                date: game.date || game.game_date,
                opponent: game.opponent || game.matchup,
                points: game.pts || game.points,
                rebounds: game.reb || game.rebounds,
                assists: game.ast || game.assists,
                steals: game.stl || game.steals,
                blocks: game.blk || game.blocks,
                minutes: game.min || game.minutes,
                plus_minus: game.plus_minus,
                fg_pct: game.fg_pct,
                three_pct: game.fg3_pct
            }))
    }, null, 2)}

QUESTION: ${userQuestion}

INSTRUCTIONS: 
- Analyze the player data above to answer the question
- Only use the provided data for factual claims about this player
- If you need to make assumptions or generalizations, mark them as "inference"
- Cite specific games or aggregates when supporting a claim
- Be concise (1-4 sentences)
- Output MUST be valid JSON with these fields:
  {
    "answer": "Your natural-language response (1-4 sentences)",
    "confidence": "High|Medium|Low",
    "evidence": [
      {"date":"2025-01-15","points":32,"opponent":"GSW","note":"Career high this season"},
      ...up to 3 most relevant games
    ],
    "suggested_props": [
      {"stat":"points","threshold":"over 30","reason":"Averaging 32 PPG in last 5 games"}
    ] (optional, only if relevant to the question),
    "ai_placeholder": false
  }

Example questions and expected behavior:
- "Is he consistent?" → Analyze variance in recent games
- "How does he perform against strong teams?" → Look at opponent data
- "Should I bet over 25 points?" → Compare threshold to recent averages and trends
`;
    return prompt;
}
/**
 * Calculate recent form statistics
 */ function calculateRecentForm(games) {
    if (!games || games.length === 0) {
        return {
            games_played: 0,
            avg_points: 0,
            avg_rebounds: 0,
            avg_assists: 0
        };
    }
    const stats = games.reduce((acc, game)=>{
        acc.points += game.pts || game.points || 0;
        acc.rebounds += game.reb || game.rebounds || 0;
        acc.assists += game.ast || game.assists || 0;
        return acc;
    }, {
        points: 0,
        rebounds: 0,
        assists: 0
    });
    return {
        games_played: games.length,
        avg_points: (stats.points / games.length).toFixed(1),
        avg_rebounds: (stats.rebounds / games.length).toFixed(1),
        avg_assists: (stats.assists / games.length).toFixed(1)
    };
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__421f098f._.js.map