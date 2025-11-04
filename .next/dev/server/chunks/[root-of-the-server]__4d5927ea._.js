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
"[project]/app/api/ai-followup/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
        const { question, context } = body;
        // Validate required fields
        if (!question || !context || !context.type || !context.originalPrediction) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Missing required fields: question, context.type, context.originalPrediction'
            }, {
                status: 400
            });
        }
        // Sanitize user question
        const sanitizedQuestion = question.trim().substring(0, 500);
        // Build context-specific prompt
        const prompt = buildFollowUpPrompt(context, sanitizedQuestion);
        // Use unified AI client with automatic fallback
        try {
            const aiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAIClient"])();
            const aiResponse = await aiClient.complete({
                messages: [
                    {
                        role: 'system',
                        content: getSystemPrompt(context.type)
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
            const parsedResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAIResponse"])(aiResponse.content, {
                answer: aiResponse.content.substring(0, 500),
                confidence: 'Medium'
            });
            // Log which model was used
            if (aiResponse.fallback_triggered) {
                console.log(`[AI Follow-up] Fallback model used: ${aiResponse.model_used}`);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                answer: parsedResponse.answer || aiResponse.content,
                confidence: parsedResponse.confidence,
                modelUsed: aiResponse.model_used,
                fallbackTriggered: aiResponse.fallback_triggered
            });
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
        console.error('Error in AI follow-up route:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        }, {
            status: 500
        });
    }
}
/**
 * Get system prompt based on context type
 */ function getSystemPrompt(type) {
    const basePrompt = 'You are an expert NBA analyst providing follow-up insights and analysis.';
    switch(type){
        case 'player-prop':
            return `${basePrompt} You have already made a prop bet prediction and now the user is asking a follow-up question. Use the original prediction, confidence level, and player statistics to provide a detailed, consistent answer. Keep your response concise (2-4 sentences) and data-driven.`;
        case 'game-outcome':
            return `${basePrompt} You have already predicted a game outcome and now the user is asking a follow-up question. Use the original prediction, team statistics, and key factors to provide a detailed, consistent answer. Keep your response concise (2-4 sentences) and data-driven.`;
        case 'player-comparison':
            return `${basePrompt} You are comparing two NBA players and the user is asking a follow-up question. Use both players' statistics and performance data to provide a detailed comparison and answer. Keep your response concise (2-4 sentences) and data-driven.`;
        default:
            return `${basePrompt} Answer the user's follow-up question using the provided context and data.`;
    }
}
/**
 * Build context-specific prompt for follow-up questions
 */ function buildFollowUpPrompt(context, question) {
    switch(context.type){
        case 'player-prop':
            return buildPlayerPropFollowUpPrompt(context, question);
        case 'game-outcome':
            return buildGameOutcomeFollowUpPrompt(context, question);
        case 'player-comparison':
            return buildPlayerComparisonFollowUpPrompt(context, question);
        default:
            return `Context: ${JSON.stringify(context, null, 2)}\n\nUser Question: ${question}\n\nProvide a concise, data-driven answer.`;
    }
}
/**
 * Build player prop follow-up prompt
 */ function buildPlayerPropFollowUpPrompt(context, question) {
    const { originalPrediction, stats } = context;
    return `
ORIGINAL PREDICTION:
Player: ${originalPrediction.playerName}
Prop Type: ${originalPrediction.propType}
Threshold: ${originalPrediction.overUnder} ${originalPrediction.threshold}
AI Prediction: ${originalPrediction.prediction}
Confidence: ${originalPrediction.confidence}
Reasoning: ${originalPrediction.reasoning}
Projected Value: ${originalPrediction.projectedValue || 'N/A'}
${originalPrediction.statsUsed ? `\nKey Stats: ${originalPrediction.statsUsed.join(', ')}` : ''}

PLAYER STATISTICS:
${stats ? JSON.stringify(stats, null, 2) : 'Stats not available'}

USER FOLLOW-UP QUESTION:
${question}

INSTRUCTIONS:
Based on the original prediction and player statistics above, answer the user's follow-up question.
Keep your answer concise (2-4 sentences), data-driven, and consistent with the original prediction.
If the question asks for specific numbers or games, reference the statistics provided.

Response format (JSON):
{
  "answer": "Your concise answer here (2-4 sentences)",
  "confidence": "High|Medium|Low"
}
`;
}
/**
 * Build game outcome follow-up prompt
 */ function buildGameOutcomeFollowUpPrompt(context, question) {
    const { originalPrediction, stats } = context;
    return `
ORIGINAL PREDICTION:
Team 1: ${originalPrediction.team1}
Team 2: ${originalPrediction.team2}
Predicted Winner: ${originalPrediction.winner}
Confidence: ${originalPrediction.confidence}
Win Probability: ${originalPrediction.winProbability || 'N/A'}%
Score Prediction: ${originalPrediction.scorePrediction || 'N/A'}
Reasoning: ${originalPrediction.reasoning}
${originalPrediction.keyFactors ? `\nKey Factors:\n${originalPrediction.keyFactors.map((f)=>`- ${f}`).join('\n')}` : ''}

TEAM STATISTICS:
${stats ? JSON.stringify(stats, null, 2) : 'Stats not available'}

USER FOLLOW-UP QUESTION:
${question}

INSTRUCTIONS:
Based on the original game prediction and team statistics above, answer the user's follow-up question.
Keep your answer concise (2-4 sentences), data-driven, and consistent with the original prediction.
If the question asks about specific players or matchups, use the provided statistics.

Response format (JSON):
{
  "answer": "Your concise answer here (2-4 sentences)",
  "confidence": "High|Medium|Low"
}
`;
}
/**
 * Build player comparison follow-up prompt
 */ function buildPlayerComparisonFollowUpPrompt(context, question) {
    const { stats, metadata } = context;
    return `
PLAYER COMPARISON CONTEXT:
${metadata ? JSON.stringify(metadata, null, 2) : ''}

PLAYER STATISTICS:
${stats ? JSON.stringify(stats, null, 2) : 'Stats not available'}

USER FOLLOW-UP QUESTION:
${question}

INSTRUCTIONS:
Based on the player comparison data above, answer the user's follow-up question.
Compare the two players directly, highlighting differences and similarities.
Keep your answer concise (2-4 sentences) and data-driven.

Response format (JSON):
{
  "answer": "Your concise comparison answer here (2-4 sentences)",
  "confidence": "High|Medium|Low"
}
`;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4d5927ea._.js.map