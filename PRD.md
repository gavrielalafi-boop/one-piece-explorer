# PRD — One Piece Explorer

## 1. Pitch
A Hebrew RTL app for exploring a selected collection of up to 150 One Piece characters from AniList. Display: “גלו אוסף נבחר של עד 150 דמויות מעולם One Piece.”

## 2. Who it is for
Fans who want to discover characters and read their English descriptions, which may contain spoilers. This is a selected collection, not a complete franchise catalogue or the developer's personal favorites.

## 3. Screens
- List: heading and search, then LTR range buttons (1–25, 26–50, etc.) based on currently filtered records, then only the selected page's cards. At most 25 cards per UI page; page changes preserve the heading/search. List URLs use /?page=2; / means page 1.
- Details at /characters/:id: name, image and full safe description near the top, with return restoring search, favorites filter and list page. Support direct entry, refresh and Back/Forward.

## 4. Must-have features
1. Fetch full character records from media 21 using async/await in useEffect, sequentially loading up to six API pages of 25; stop early when hasNextPage is false. Append to a single characters array in App state and display the first 25 immediately.
2. Show progressive loaded count and a partial-collection notice while loading. If a request fails, retain successful records and retry the failed page. No separate index/cache or static JSON source/fallback.
3. Search all loaded name.full values with trim and case-insensitive substring matching; combine with favorites-only filtering before slicing into 25-card pages. New search/filter changes start on page 1; clearing search retains the favorites filter.
4. Keep selectedCharacterId, searchQuery, favoriteIds and favoritesOnly in mounted App, passing data/callbacks through props. Persist only favorite IDs in localStorage; separate favorite buttons never select or navigate.
5. Keep Hebrew RTL controls, English LTR descriptions, fixed-size images with loading=lazy, accessible keyboard controls and plain CSS. Next design stage: blue One Piece logo without a treasure map, dark colorful background, uniform Flexbox cards with flex-wrap and a fixed footer reading “© 2026 Gavriel Alafi | Design & Development”.

## 5. Acceptance criteria
- First 25 characters appear without waiting for 150; at most six successful API pages are appended, with unique IDs and progress. Partial data is never called complete; completion means the selected scope is loaded, not the whole source.
- Range buttons reflect current filtered results; only up to 25 cards appear; Router restores page on Back/Forward. Invalid pages show feedback and normalize safely without duplicate navigation.
- Search/favorites work across all loaded records and never trigger API calls. Returning from details restores list context. Direct IDs resolve from the same array as loading progresses; missing IDs get outside-selected-collection feedback only after successful completion.
- HTTP/network/JSON/GraphQL/data failures retain prior records and offer retry from the failed page. Cancellation prevents stale appends; 429 respects Retry-After without parallel or repeated-request loops.
- Favorites persist across refresh with malformed/unavailable-storage feedback and in-memory use; image failures show placeholders and names/descriptions decode numeric and common named entities into safe plain text without URLs, clickable links or injected HTML. Fixed footer never covers content/focus at narrow widths.

## 6. Not now
No libraries beyond existing dependencies, separate index/cache, full-source download, additional API/backend/translation, or project JSON data source/fallback. Use basic TypeScript, fetch, async/await, useEffect/useState, props, array operations and React Router. Preserve completed tasks 1–7 as history. Task 8 (Vitest in src/tests/ and submission documentation) waits until the collection expansion and subsequent design are implemented and manually verified. This edit implements neither data changes nor design.

## 7. Data
Only https://graphql.anilist.co via direct browser fetch, without a key or GraphQL library. Media ID 21 is the original One Piece TV anime. Request Media.characters(page:1..6, perPage:25, sort:[ROLE,RELEVANCE,ID]), pageInfo.hasNextPage and id/name.full/image.large/description(asHtml:false). Normalize basic Character records and validate/deduplicate IDs before appending. Use loaded lengths and hasNextPage, not total/lastPage, for decisions. Up to six successful GraphQL requests per app mount, plus necessary failed-request retries; navigation/search/favorites add none. Keep records only in App memory; refresh starts fresh live loading. Use source-supplied CDN images lazily. Historical samples remain unused. The previous complete-collection/index proposal is superseded by this bounded scope selected after the user's syllabus review.

## Visual design refinement (2026-10-11) — completed after user review
The approved current design replaces the previous right-image/left-facts card presentation: cards now contain a top 100×140 image or matching placeholder, an English LTR/center-aligned name below on the same center axis as the image, and a separate favorite button at the bottom. Full cleaned descriptions remain on the character route. A dark black/navy theme uses gold, turquoise and red accents. The list uses Flexbox with flex-wrap: five columns at wide widths, four/three/two as space narrows and one on very small screens; search and favorites precede range buttons. Preserve all state, props, live loading, pagination and routes.
Header.tsx presents the local blue src/assets/one-piece-logo.png (800×292, preserved aspect ratio, alt="One Piece") above the secondary accessible One Piece Explorer heading on a dark gradient, without a treasure map. Footer.tsx displays the fixed required copyright text. The PNG source and unverified usage permission are documented in README; this is an unofficial educational project, and credit/disclaimers do not grant permission. The old Wikimedia SVG and original treasure-map SVG have been removed after confirming no code references. Local design assets are images/SVG, never character JSON. CSS reserves footer clearance and retains visible keyboard focus, RTL controls, LTR source text, readable details and fixed image dimensions. Stage B is completed following user approval; task 8 remains open.

Presentation refinement: show only short initial loading and 'טוען דמויות נוספות…' during partial loading, errors/retry and match count; remove request/API-page counters and completion announcements from both routes. Remove the search-scope paragraph and its aria-describedby reference. Below the list show 'מוצג אוסף נבחר של עד 150 דמויות.' Range buttons read '1 עד 25', '26 עד 50', etc., with the first range on the right and ascending endpoints. Technical request information stays in development documentation. Header uses the user-requested blue PNG; unverified usage permission is documented in README. No treasure-map asset remains.
