# PRD — One Piece Explorer

## 1. Pitch
A Hebrew RTL app that helps One Piece fans browse character names, images and descriptions from AniList.

## 2. Who it is for
Fans who want to discover characters and read their English descriptions. Descriptions may contain spoilers and source formatting.

## 3. Screens
- List: character names, available images and up to four explicitly labeled facts extracted from descriptions, with short cleaned-description excerpts as fallback, name search and a favorites filter; clearly label the limited collection.
- Details: selected character name, image and description beside the list on desktop and below it on mobile; instruction before selection.
- React Router supports direct character URLs and Back; unknown routes or IDs outside the loaded collection show a clear message.

## 4. Must-have features
1. Load up to 25 characters from AniList for the original One Piece anime, ordered by role, relevance and character ID, with loading, error and retry states.
2. Select a character and display its English name, available image and description, with Hebrew feedback for missing content.
3. Search loaded English names without case sensitivity; label search as limited to this collection and show no-results feedback within it.
4. Save, remove and filter favorites using localStorage.
5. Readable Hebrew RTL interface and system messages on desktop/mobile, with React Router navigation; source content remains English and LTR.

## 5. Acceptance criteria
- When I open the app, I see loading followed by up to 25 names/images and a visible limited-collection label; it never claims to include all One Piece characters.
- When I select a character or open its URL, I see its name, image and full cleaned description with preserved paragraphs, or missing-content feedback; Back restores selection.
- When I search “Luffy”, only matching loaded names appear; no matches means none in the loaded collection, not none in One Piece.
- When an HTTP, network, GraphQL or data error occurs, I see Hebrew error feedback and retry; recovery loads real AniList data without local fallback.
- Favorites survive reload and can be removed/filtered; mobile has no horizontal scrolling and a failed image does not break the page.

## 6. Not now
No second API, translation service, backend, accounts, additional franchise media, load-more feature or exhaustive character catalogue. No separate promises for job, abilities or Devil Fruit: these may occur in some descriptions only.

All course requirements and four bonuses remain: simple TypeScript, React Router, localStorage favorites and Vitest tests together in src/tests/ in task 8. Preserve prompt logging, basic checks, manual verification and one-task-at-a-time work.

## 7. Data
Only data source: https://graphql.anilist.co via browser fetch POST with a GraphQL query and variables, without a key, authentication or extra GraphQL library. Images use URLs supplied by AniList, including its image CDN, not a second data API.
Use verified AniList media ID 21: ONE PIECE, ANIME/TV, started in 1999. The live role/relevance/ID query returned Luffy, Zoro, Nami, Usopp and Sanji within its 25 records. Request its characters with page 1, perPage 25 and ROLE, RELEVANCE, ID ordering; read pageInfo.hasNextPage. Load at most 25 unique records, possibly fewer; do not fetch further pages. Show loaded count and whether more source records exist. This scope covers one AniList media entry, not the whole franchise.
Fields: id, name.full, image.large and description(asHtml: false); normalize to Character with id, name, imageUrl and description. Nullable/missing image and description are supported. Existing local samples remain historical files, never a production fallback. Verify actual schema, media identity, CORS and images in Chrome during task 4.




