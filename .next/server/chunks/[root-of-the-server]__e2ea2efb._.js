module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},95448,e=>{"use strict";class t extends Error{statusCode;isRateLimitError;isTimeoutError;constructor(e,t,r,n){super(e),this.statusCode=t,this.isRateLimitError=r,this.isTimeoutError=n,this.name="AIClientError"}}class r{apiKey;siteUrl;appTitle;PRIMARY_MODEL="mistralai/mistral-small-3.1-24b-instruct:free";FALLBACK_MODEL="deepseek/deepseek-chat-v3.1:free";OPENROUTER_URL="https://openrouter.ai/api/v1/chat/completions";REQUEST_TIMEOUT=3e4;constructor(e){if(!e.apiKey)throw new t("OpenRouter API key is required");this.apiKey=e.apiKey,this.siteUrl=e.siteUrl||"http://localhost:3000",this.appTitle=e.appTitle||"StatSight AI"}async complete(e){let r=null;try{return console.log(`[AI Client] Attempting request with primary model: ${this.PRIMARY_MODEL}`),{content:await this.makeRequest(this.PRIMARY_MODEL,e),model_used:this.PRIMARY_MODEL,fallback_triggered:!1}}catch(e){if(console.error("[AI Client] Primary model failed:",(r=this.handleError(e)).message),!this.shouldFallback(r))throw r}try{return console.log(`[AI Client] Attempting request with fallback model: ${this.FALLBACK_MODEL}`),{content:await this.makeRequest(this.FALLBACK_MODEL,e),model_used:this.FALLBACK_MODEL,fallback_triggered:!0}}catch(n){let e=this.handleError(n);throw console.error("[AI Client] Fallback model also failed:",e.message),new t(`Both AI models failed. Primary: ${r?.message}. Fallback: ${e.message}`,e.statusCode)}}async makeRequest(e,r){let n=new AbortController,a=setTimeout(()=>n.abort(),this.REQUEST_TIMEOUT);try{let s=await fetch(this.OPENROUTER_URL,{method:"POST",headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json","HTTP-Referer":this.siteUrl,"X-Title":this.appTitle},body:JSON.stringify({model:e,messages:r.messages,temperature:r.temperature??.3,max_tokens:r.max_tokens??600,...r.response_format&&{response_format:r.response_format}}),signal:n.signal});if(clearTimeout(a),!s.ok){let e=await s.text(),r=e;try{let t=JSON.parse(e);r=t.error?.message||t.message||e}catch{}throw new t(r,s.status,429===s.status,!1)}let o=await s.json(),i=o.choices?.[0]?.message?.content;if(!i)throw new t("No content in AI response");return i}catch(e){if(clearTimeout(a),"AbortError"===e.name)throw new t(`Request timeout after ${this.REQUEST_TIMEOUT/1e3}s`,408,!1,!0);if(e instanceof t)throw e;throw new t(e.message||"Unknown error during AI request",500)}}shouldFallback(e){return e.isRateLimitError?(console.log("[AI Client] Rate limit detected, will attempt fallback"),!0):e.isTimeoutError?(console.log("[AI Client] Timeout detected, will attempt fallback"),!0):e.statusCode&&e.statusCode>=500?(console.log("[AI Client] Server error detected, will attempt fallback"),!0):!e.statusCode||!(e.statusCode>=400)||!(e.statusCode<500)||(console.log("[AI Client] Client error detected, will NOT attempt fallback"),!1)}handleError(e){return e instanceof t?e:"AbortError"===e.name?new t("Request timeout",408,!1,!0):new t(e.message||"Unknown error",e.statusCode||500)}}function n(e){let n=e||process.env.OPENROUTER_API_KEY;if(!n)throw new t("OPENROUTER_API_KEY environment variable is not set");return new r({apiKey:n,siteUrl:"http://localhost:3000",appTitle:"StatSight AI Predictions"})}function a(e,t){try{let r=e.match(/\{[\s\S]*\}/);if(r)return JSON.parse(r[0]);return console.warn("[AI Client] No JSON found in response, using fallback"),t}catch(e){return console.error("[AI Client] Error parsing JSON:",e),t}}e.s(["createAIClient",()=>n,"parseAIResponse",()=>a])},26904,e=>{"use strict";var t=e.i(47909),r=e.i(74017),n=e.i(96250),a=e.i(59756),s=e.i(61916),o=e.i(14444),i=e.i(37092),l=e.i(69741),c=e.i(16795),d=e.i(87718),u=e.i(95169),p=e.i(47587),h=e.i(66012),m=e.i(70101),f=e.i(26937),g=e.i(10372),w=e.i(93695);e.i(52474);var R=e.i(5232),y=e.i(89171),E=e.i(95448);async function A(e){try{let{question:t,context:r}=await e.json();if(!t||!r||!r.type||!r.originalPrediction)return y.NextResponse.json({success:!1,error:"Missing required fields: question, context.type, context.originalPrediction"},{status:400});let n=t.trim().substring(0,500),a=function(e,t){switch(e.type){case"player-prop":return function(e,t){let{originalPrediction:r,stats:n}=e;return`
ORIGINAL PREDICTION:
Player: ${r.playerName}
Prop Type: ${r.propType}
Threshold: ${r.overUnder} ${r.threshold}
AI Prediction: ${r.prediction}
Confidence: ${r.confidence}
Reasoning: ${r.reasoning}
Projected Value: ${r.projectedValue||"N/A"}
${r.statsUsed?`
Key Stats: ${r.statsUsed.join(", ")}`:""}

PLAYER STATISTICS:
${n?JSON.stringify(n,null,2):"Stats not available"}

USER FOLLOW-UP QUESTION:
${t}

INSTRUCTIONS:
Based on the original prediction and player statistics above, answer the user's follow-up question.
Keep your answer concise (2-4 sentences), data-driven, and consistent with the original prediction.
If the question asks for specific numbers or games, reference the statistics provided.

Response format (JSON):
{
  "answer": "Your concise answer here (2-4 sentences)",
  "confidence": "High|Medium|Low"
}
`}(e,t);case"game-outcome":return function(e,t){let{originalPrediction:r,stats:n}=e;return`
ORIGINAL PREDICTION:
Team 1: ${r.team1}
Team 2: ${r.team2}
Predicted Winner: ${r.winner}
Confidence: ${r.confidence}
Win Probability: ${r.winProbability||"N/A"}%
Score Prediction: ${r.scorePrediction||"N/A"}
Reasoning: ${r.reasoning}
${r.keyFactors?`
Key Factors:
${r.keyFactors.map(e=>`- ${e}`).join("\n")}`:""}

TEAM STATISTICS:
${n?JSON.stringify(n,null,2):"Stats not available"}

USER FOLLOW-UP QUESTION:
${t}

INSTRUCTIONS:
Based on the original game prediction and team statistics above, answer the user's follow-up question.
Keep your answer concise (2-4 sentences), data-driven, and consistent with the original prediction.
If the question asks about specific players or matchups, use the provided statistics.

Response format (JSON):
{
  "answer": "Your concise answer here (2-4 sentences)",
  "confidence": "High|Medium|Low"
}
`}(e,t);case"player-comparison":return function(e,t){let{stats:r,metadata:n}=e;return`
PLAYER COMPARISON CONTEXT:
${n?JSON.stringify(n,null,2):""}

PLAYER STATISTICS:
${r?JSON.stringify(r,null,2):"Stats not available"}

USER FOLLOW-UP QUESTION:
${t}

INSTRUCTIONS:
Based on the player comparison data above, answer the user's follow-up question.
Compare the two players directly, highlighting differences and similarities.
Keep your answer concise (2-4 sentences) and data-driven.

Response format (JSON):
{
  "answer": "Your concise comparison answer here (2-4 sentences)",
  "confidence": "High|Medium|Low"
}
`}(e,t);default:return`Context: ${JSON.stringify(e,null,2)}

User Question: ${t}

Provide a concise, data-driven answer.`}}(r,n);try{let e=(0,E.createAIClient)(),t=await e.complete({messages:[{role:"system",content:function(e){let t="You are an expert NBA analyst providing follow-up insights and analysis.";switch(e){case"player-prop":return`${t} You have already made a prop bet prediction and now the user is asking a follow-up question. Use the original prediction, confidence level, and player statistics to provide a detailed, consistent answer. Keep your response concise (2-4 sentences) and data-driven.`;case"game-outcome":return`${t} You have already predicted a game outcome and now the user is asking a follow-up question. Use the original prediction, team statistics, and key factors to provide a detailed, consistent answer. Keep your response concise (2-4 sentences) and data-driven.`;case"player-comparison":return`${t} You are comparing two NBA players and the user is asking a follow-up question. Use both players' statistics and performance data to provide a detailed comparison and answer. Keep your response concise (2-4 sentences) and data-driven.`;default:return`${t} Answer the user's follow-up question using the provided context and data.`}}(r.type)},{role:"user",content:a}],temperature:.3,max_tokens:600}),n=(0,E.parseAIResponse)(t.content,{answer:t.content.substring(0,500),confidence:"Medium"});return t.fallback_triggered&&console.log(`[AI Follow-up] Fallback model used: ${t.model_used}`),y.NextResponse.json({success:!0,answer:n.answer||t.content,confidence:n.confidence,modelUsed:t.model_used,fallbackTriggered:t.fallback_triggered})}catch(e){return console.error("AI Client Error:",e),y.NextResponse.json({success:!1,error:e.message||"AI service error"},{status:e.statusCode||500})}}catch(e){return console.error("Error in AI follow-up route:",e),y.NextResponse.json({success:!1,error:e instanceof Error?e.message:"Internal server error"},{status:500})}}e.s(["POST",()=>A],57333);var v=e.i(57333);let T=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/ai-followup/route",pathname:"/api/ai-followup",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/ai-followup/route.ts",nextConfigOutput:"",userland:v}),{workAsyncStorage:C,workUnitAsyncStorage:x,serverHooks:I}=T;function O(){return(0,n.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:x})}async function S(e,t,n){T.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/ai-followup/route";y=y.replace(/\/index$/,"")||"/";let E=await T.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!E)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:A,params:v,nextConfig:C,parsedUrl:x,isDraftMode:I,prerenderManifest:O,routerServerContext:S,isOnDemandRevalidate:N,revalidateOnlyGenerated:b,resolvedPathname:P,clientReferenceManifest:k,serverActionsManifest:U}=E,_=(0,l.normalizeAppPath)(y),$=!!(O.dynamicRoutes[_]||O.routes[P]),q=async()=>((null==S?void 0:S.render404)?await S.render404(e,t,x,!1):t.end("This page could not be found"),null);if($&&!I){let e=!!O.routes[P],t=O.dynamicRoutes[_];if(t&&!1===t.fallback&&!e){if(C.experimental.adapterPath)return await q();throw new w.NoFallbackError}}let L=null;!$||T.isDev||I||(L="/index"===(L=P)?"/":L);let M=!0===T.isDev||!$,j=$&&!M;U&&k&&(0,o.setReferenceManifestsSingleton)({page:y,clientReferenceManifest:k,serverActionsManifest:U,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:U})});let K=e.method||"GET",F=(0,s.getTracer)(),D=F.getActiveScopeSpan(),H={params:v,prerenderManifest:O,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:M,incrementalCache:(0,a.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:C.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n)=>T.onRequestError(e,t,n,S)},sharedContext:{buildId:A}},B=new c.NodeNextRequest(e),Y=new c.NodeNextResponse(t),J=d.NextRequestAdapter.fromNodeNextRequest(B,(0,d.signalFromNodeResponse)(t));try{let o=async e=>T.handle(J,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=F.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${K} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${K} ${y}`)}),i=!!(0,a.getRequestMeta)(e,"minimalMode"),l=async a=>{var s,l;let c=async({previousCacheEntry:r})=>{try{if(!i&&N&&b&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await o(a);e.fetchMetrics=H.renderOpts.fetchMetrics;let l=H.renderOpts.pendingWaitUntil;l&&n.waitUntil&&(n.waitUntil(l),l=void 0);let c=H.renderOpts.collectedTags;if(!$)return await (0,h.sendResponse)(B,Y,s,H.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(s.headers);c&&(t[g.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,n=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:N})},S),t}},d=await T.handleResponse({req:e,nextConfig:C,cacheKey:L,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:b,responseGenerator:c,waitUntil:n.waitUntil,isMinimalMode:i});if(!$)return null;if((null==d||null==(s=d.value)?void 0:s.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",N?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,m.fromNodeOutgoingHttpHeaders)(d.value.headers);return i&&$||u.delete(g.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,f.getCacheControlHeader)(d.cacheControl)),await (0,h.sendResponse)(B,Y,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};D?await l(D):await F.withPropagatedContext(e.headers,()=>F.trace(u.BaseServerSpan.handleRequest,{spanName:`${K} ${y}`,kind:s.SpanKind.SERVER,attributes:{"http.method":K,"http.target":e.url}},l))}catch(t){if(t instanceof w.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:_,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:N})}),$)throw t;return await (0,h.sendResponse)(B,Y,new Response(null,{status:500})),null}}e.s(["handler",()=>S,"patchFetch",()=>O,"routeModule",()=>T,"serverHooks",()=>I,"workAsyncStorage",()=>C,"workUnitAsyncStorage",()=>x],26904)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__e2ea2efb._.js.map