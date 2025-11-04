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
"[project]/app/api/ai-predict-player/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
        const { playerName, playerStats, propType, threshold, overUnder, opponent } = body;
        if (!playerName || !playerStats || !propType) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields: playerName, playerStats, propType'
            }, {
                status: 400
            });
        }
        if (threshold === undefined || threshold === null) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Threshold value is required'
            }, {
                status: 400
            });
        }
        if (!overUnder || overUnder !== 'over' && overUnder !== 'under') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Over/Under direction is required'
            }, {
                status: 400
            });
        }
        // Build the AI prompt
        const prompt = buildPlayerPropPrompt(playerName, playerStats, propType, threshold, overUnder, opponent);
        // Use unified AI client with automatic fallback
        try {
            const aiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAIClient"])();
            const aiResponse = await aiClient.complete({
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert NBA statistician and analyst. You provide data-driven predictions based on player performance statistics. Always respond in JSON format with prediction, confidence, reasoning, statsUsed, and projectedValue fields.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 600
            });
            // Parse AI response with fallback
            const prediction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAIResponse"])(aiResponse.content, {
                prediction: 'Unable to determine',
                confidence: 'Medium',
                reasoning: aiResponse.content,
                statsUsed: [],
                projectedValue: threshold
            });
            // Log which model was used
            if (aiResponse.fallback_triggered) {
                console.log(`[Player Prop] Fallback model used: ${aiResponse.model_used}`);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                playerName,
                propType,
                threshold,
                overUnder,
                opponent,
                ...prediction,
                modelUsed: aiResponse.model_used,
                fallbackTriggered: aiResponse.fallback_triggered
            });
        } catch (aiError) {
            console.error('AI Client Error:', aiError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: aiError.message || 'AI service error'
            }, {
                status: aiError.statusCode || 500
            });
        }
    } catch (error) {
        console.error('Error in AI prediction route:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : 'Internal server error'
        }, {
            status: 500
        });
    }
}
function buildPlayerPropPrompt(playerName, playerStats, propType, threshold, overUnder, opponent) {
    const recentGames = playerStats.recentGames || [];
    const seasonAvg = playerStats.seasonAverage || {};
    // Calculate recent form
    const last5Games = recentGames.slice(0, 5);
    const last5Avg = last5Games.length > 0 ? last5Games.reduce((sum, game)=>sum + (game[propType] || 0), 0) / last5Games.length : 0;
    const prompt = `
Analyze ${playerName}'s performance and predict if they will go ${overUnder.toUpperCase()} ${threshold} ${propType} in their upcoming game${opponent ? ` against ${opponent}` : ''}.

PLAYER STATISTICS:
- Season Average ${propType}: ${seasonAvg[propType] || 0}
- Last 5 Games Average ${propType}: ${last5Avg.toFixed(1)}
- Games Played: ${seasonAvg.gamesPlayed || 0}

RECENT GAME-BY-GAME PERFORMANCE (Last 10 Games):
${recentGames.slice(0, 10).map((game, idx)=>`Game ${idx + 1}: ${game[propType] || 0} ${propType} vs ${game.opponent || 'Unknown'} (${game.result || 'N/A'})`).join('\n')}

PROP BET:
- Line: ${overUnder.toUpperCase()} ${threshold} ${propType}

ANALYSIS FACTORS:
1. How does the threshold (${threshold}) compare to season average (${seasonAvg[propType] || 0})?
2. How does it compare to recent 5-game average (${last5Avg.toFixed(1)})?
3. Recent form trend (improving/declining)
4. Consistency of performance across recent games
5. ${opponent ? `Historical performance against ${opponent}` : 'Overall matchup difficulty'}
6. Home/away split if applicable

Based on this data, provide a prediction in the following JSON format:
{
  "prediction": "${overUnder.charAt(0).toUpperCase() + overUnder.slice(1)} ${threshold}" or explain if you disagree,
  "confidence": "High" or "Medium" or "Low",
  "reasoning": "2-4 sentence explanation based on the stats provided. Specifically address why ${playerName} will or won't hit ${overUnder} ${threshold} ${propType}.",
  "statsUsed": ["key stat 1", "key stat 2", "key stat 3"],
  "projectedValue": number (your projected stat value for this game)
}

Be specific and data-driven. Only use the statistics provided above. Make sure to directly address the ${overUnder} ${threshold} line.
`;
    return prompt;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9ae545a7._.js.map