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
"[project]/app/api/google-upcoming-games/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const teamQuery = searchParams.get('team') || 'NBA';
        const serpApiKey = process.env.SERPAPI_KEY;
        if (!serpApiKey) {
            // Fallback: Use alternative method without API key
            return await fetchGamesWithoutKey(teamQuery);
        }
        // Use SerpApi to fetch NBA games from Google Sports
        const serpApiUrl = new URL('https://serpapi.com/search.json');
        serpApiUrl.searchParams.append('engine', 'google');
        serpApiUrl.searchParams.append('q', `${teamQuery} NBA games schedule`);
        serpApiUrl.searchParams.append('api_key', serpApiKey);
        serpApiUrl.searchParams.append('gl', 'us');
        serpApiUrl.searchParams.append('hl', 'en');
        const response = await fetch(serpApiUrl.toString());
        if (!response.ok) {
            throw new Error(`SerpApi error: ${response.status}`);
        }
        const data = await response.json();
        // Parse sports results from Google
        const games = parseGoogleSportsResults(data, teamQuery);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            count: games.length,
            games: games,
            source: 'google_serpapi'
        });
    } catch (error) {
        console.error('Error fetching games from Google:', error);
        // Fallback to mock data or alternative source
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch games',
            games: []
        }, {
            status: 500
        });
    }
}
// Fallback method using direct Google scraping (no API key needed)
async function fetchGamesWithoutKey(teamQuery) {
    try {
        // Use Google Sports widget URL
        const searchQuery = encodeURIComponent(`${teamQuery} NBA games`);
        const googleUrl = `https://www.google.com/search?q=${searchQuery}&hl=en`;
        const response = await fetch(googleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const html = await response.text();
        // Parse HTML for sports widget data
        const games = parseGoogleSportsHTML(html, teamQuery);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            count: games.length,
            games: games,
            source: 'google_direct'
        });
    } catch (error) {
        console.error('Fallback fetch error:', error);
        // Return sample upcoming games as last resort
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            count: 3,
            games: getSampleUpcomingGames(teamQuery),
            source: 'sample_data'
        });
    }
}
function parseGoogleSportsResults(data, teamQuery) {
    const games = [];
    try {
        // SerpApi returns sports results in 'sports_results' key
        if (data.sports_results && data.sports_results.games) {
            data.sports_results.games.forEach((game, index)=>{
                const isLive = game.status?.includes('Live') || game.stage?.includes('Live');
                const isFinal = game.status?.includes('Final') || game.stage?.includes('FT');
                games.push({
                    game_id: game.game_id || `google_${Date.now()}_${index}`,
                    team1: {
                        name: game.teams?.[0]?.name || game.team1 || 'Team 1',
                        logo_url: game.teams?.[0]?.thumbnail || getTeamLogoUrl(game.teams?.[0]?.name || ''),
                        score: game.teams?.[0]?.score
                    },
                    team2: {
                        name: game.teams?.[1]?.name || game.team2 || 'Team 2',
                        logo_url: game.teams?.[1]?.thumbnail || getTeamLogoUrl(game.teams?.[1]?.name || ''),
                        score: game.teams?.[1]?.score
                    },
                    date: game.date || game.start_time || new Date().toISOString().split('T')[0],
                    time: game.time || extractTime(game.start_time),
                    status: isFinal ? 'final' : isLive ? 'live' : 'scheduled',
                    venue: game.venue,
                    tournament: game.tournament || 'NBA'
                });
            });
        }
        // Also check for game_spotlight (featured games)
        if (data.game_spotlight) {
            const spotlight = data.game_spotlight;
            games.unshift({
                game_id: `spotlight_${Date.now()}`,
                team1: {
                    name: spotlight.first_team?.name || 'Team 1',
                    logo_url: spotlight.first_team?.thumbnail || '',
                    score: spotlight.first_team?.score
                },
                team2: {
                    name: spotlight.second_team?.name || 'Team 2',
                    logo_url: spotlight.second_team?.thumbnail || '',
                    score: spotlight.second_team?.score
                },
                date: spotlight.date || new Date().toISOString().split('T')[0],
                time: spotlight.time,
                status: spotlight.stage?.includes('Live') ? 'live' : spotlight.stage?.includes('Final') ? 'final' : 'scheduled',
                venue: spotlight.venue,
                tournament: spotlight.league || 'NBA'
            });
        }
    } catch (parseError) {
        console.error('Error parsing Google sports results:', parseError);
    }
    return games;
}
function parseGoogleSportsHTML(html, teamQuery) {
    const games = [];
    try {
        // Look for sports widget data in script tags
        const scriptMatches = html.match(/<script[^>]*>window\._sdata\s*=\s*(\{[\s\S]*?\});/i);
        if (scriptMatches && scriptMatches[1]) {
            const sportsData = JSON.parse(scriptMatches[1]);
            // Parse nested sports data structure
            // This is a simplified parser - actual structure varies
            if (sportsData.games) {
                sportsData.games.forEach((game, index)=>{
                    games.push({
                        game_id: `parsed_${index}`,
                        team1: {
                            name: game.home_team || 'Home Team',
                            logo_url: game.home_logo || '',
                            score: game.home_score
                        },
                        team2: {
                            name: game.away_team || 'Away Team',
                            logo_url: game.away_logo || '',
                            score: game.away_score
                        },
                        date: game.date || new Date().toISOString().split('T')[0],
                        time: game.time,
                        status: game.status || 'scheduled'
                    });
                });
            }
        }
    } catch (parseError) {
        console.error('Error parsing HTML:', parseError);
    }
    return games.length > 0 ? games : getSampleUpcomingGames(teamQuery);
}
function getSampleUpcomingGames(teamQuery) {
    // Generate sample games for demonstration
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const teams = [
        {
            name: 'Los Angeles Lakers',
            abbr: 'LAL',
            id: '1610612747'
        },
        {
            name: 'Boston Celtics',
            abbr: 'BOS',
            id: '1610612738'
        },
        {
            name: 'Golden State Warriors',
            abbr: 'GSW',
            id: '1610612744'
        },
        {
            name: 'Miami Heat',
            abbr: 'MIA',
            id: '1610612748'
        },
        {
            name: 'Milwaukee Bucks',
            abbr: 'MIL',
            id: '1610612749'
        },
        {
            name: 'Phoenix Suns',
            abbr: 'PHX',
            id: '1610612756'
        }
    ];
    // Find team match
    const matchedTeam = teams.find((t)=>teamQuery.toLowerCase().includes(t.name.toLowerCase()) || teamQuery.toLowerCase().includes(t.abbr.toLowerCase())) || teams[0];
    const otherTeams = teams.filter((t)=>t.name !== matchedTeam.name);
    return [
        {
            game_id: `sample_${Date.now()}_1`,
            team1: {
                name: matchedTeam.name,
                logo_url: `https://cdn.nba.com/logos/nba/${matchedTeam.id}/global/L/logo.svg`,
                score: undefined
            },
            team2: {
                name: otherTeams[0].name,
                logo_url: `https://cdn.nba.com/logos/nba/${otherTeams[0].id}/global/L/logo.svg`,
                score: undefined
            },
            date: today.toISOString().split('T')[0],
            time: '7:30 PM ET',
            status: 'scheduled',
            venue: 'Crypto.com Arena',
            tournament: 'NBA'
        },
        {
            game_id: `sample_${Date.now()}_2`,
            team1: {
                name: otherTeams[1].name,
                logo_url: `https://cdn.nba.com/logos/nba/${otherTeams[1].id}/global/L/logo.svg`,
                score: undefined
            },
            team2: {
                name: matchedTeam.name,
                logo_url: `https://cdn.nba.com/logos/nba/${matchedTeam.id}/global/L/logo.svg`,
                score: undefined
            },
            date: tomorrow.toISOString().split('T')[0],
            time: '8:00 PM ET',
            status: 'scheduled',
            venue: 'TD Garden',
            tournament: 'NBA'
        }
    ];
}
function getTeamLogoUrl(teamName) {
    // Map common team names to NBA logo URLs
    const teamMap = {
        'lakers': '1610612747',
        'celtics': '1610612738',
        'warriors': '1610612744',
        'heat': '1610612748',
        'bucks': '1610612749',
        'suns': '1610612756',
        'nets': '1610612751',
        'knicks': '1610612752',
        'clippers': '1610612746',
        'mavericks': '1610612742',
        'nuggets': '1610612743',
        'bulls': '1610612741'
    };
    const key = teamName.toLowerCase().split(' ').pop() || '';
    const teamId = teamMap[key] || '1610612740';
    return `https://cdn.nba.com/logos/nba/${teamId}/global/L/logo.svg`;
}
function extractTime(dateTimeString) {
    if (!dateTimeString) return undefined;
    try {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    } catch  {
        return undefined;
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6bce6fd5._.js.map