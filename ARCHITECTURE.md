# Architecture — One Piece Explorer

Planning only. Tasks 1–2 use JavaScript; task 3 explicitly converts existing files to simple TypeScript. Router and Vitest are introduced in tasks 6 and 8. Use plain CSS and built-in fetch; no server, database, UI or state-management libraries.

## Planned final files and responsibilities

| File | Responsibility |
|---|---|
| src/main.tsx | Mount React; provide BrowserRouter from task 6. |
| src/App.tsx | Own data, selectedCharacterId state, request state, search and favorites; synchronize selection with routes, compose list/details and fetch in useEffect. |
| src/App.css, src/index.css | Adapt existing styles for Hebrew RTL, visible focus and responsive layout. |
| src/types.ts | Task 4 Character: numeric id, English name, nullable imageUrl and description; normalize AniList name.full and image.large. Remove separate crew/fruit/job fields from the live model; props types stay in component files. |
| src/data/characters.sample.json | At least five samples for tasks 1–2; retain after API integration. |
| src/components/Header.tsx | Heading and home link. |
| src/components/SearchBar.tsx | Controlled search and favorites-only control. |
| src/components/CharacterList.tsx | Map cards with unique character ID keys. |
| src/components/CharacterCard.tsx | English name, available AniList image with missing/broken-image feedback, selection, active indication and later separate favorite toggle. |
| src/components/CharacterImage.tsx | Shared image and unavailable-image feedback; remount by URL to reset failed-image state. |
| src/components/CharacterDetails.tsx | English name/image/description, Hebrew missing-content feedback and instruction before selection; render source text safely as described below. |
| src/components/StatusMessage.tsx | Loading, error/retry, no-results and unknown-route/ID feedback. |
| src/tests/App.test.tsx | Focused Vitest selection/navigation and API error/retry tests with mocked network. |
| package.json and configuration files | Future minimal TypeScript, Router and Vitest setup; preserve existing scripts and add checks. |
| README.md | Separate run/check instructions and API source sections; end with five Hebrew sentences explaining App selection state and data flow through props to CharacterDetails in task 8. |
| AGENTS.md, PROMPTS.md | Working rules and prompt history; preserve hook and logging script. |
| PRD.md, PRD.he.md, ARCHITECTURE.md, tasks.md | Scope, matching translation, architecture and ordered tasks. |

Before task 3, React files use .jsx. Each component has its own file under src/components/. TypeScript conversion preserves behavior and adds basic types without advanced abstractions.

## Component tree

```text
BrowserRouter (from task 6)
  App
    Header
    SearchBar
    StatusMessage (when applicable)
    CharacterList
      CharacterCard (one per character)
    CharacterDetails
```

From task 6, / shows SearchBar and CharacterList; /characters/:id shows only CharacterDetails and a return-to-list button, with details near the top rather than below a long list. App stays mounted across both routes and owns searchQuery, data and selection. The side-by-side layout from task 5 is superseded by separate route views.

## State and props

App owns characters, searchQuery, requestStatus (idle/loading/success/error), errorMessage, favoriteIds and favoritesOnly as features are introduced. Task 2 adds nullable selectedCharacterId state in App; task 6 retains it and synchronizes it with the /characters/:id route. selectedCharacter and visibleCharacters are derived values. App finds selectedCharacter by its state ID and passes that character through props to CharacterDetails.

Data flows down through props; callbacks such as onSelect, onSearchChange, onToggleFavorite and onRetry flow up. Children do not mutate props. Fetch in useEffect POSTs a GraphQL query and variables directly to https://graphql.anilist.co without a key or extra library. Check HTTP status, JSON, GraphQL errors (including HTTP 200 with errors) and runtime data shape using unknown, not any; reject partial data accompanied by errors. Abort obsolete requests with AbortController and prevent stale state updates; cancellation is not a displayed error. Retry starts a new request. Keep selectedCharacterId in App; derive details from loaded records, without fallback to sample data.

## Routes and persistence

Use / and /characters/:id with a fallback for unknown routes. A selection handler updates selectedCharacterId in App and navigates only if the target path differs from the current path. One effect observes pathname changes, parses the route ID and updates selectedCharacterId only if it differs; this effect never navigates. Do not add an effect that navigates whenever selection state changes: this avoids an update loop and duplicate history entries. Direct entry, refresh and browser Back use the route-change effect to restore App state; home clears selection to null. A malformed ID or unknown route clears selection and shows route feedback. A well-formed ID is stored while data loads and checked against characters after successful loading; keep request errors distinct from unknown-character feedback. Future hosting must provide SPA fallback for direct-link refresh; verify localhost behavior in task 6.

Store only character IDs under localStorage key one-piece-explorer:favorites. Validate stored arrays and handle malformed JSON or blocked storage without crashing; in-memory favorites remain usable if persistence fails. Favorite toggles are separate from navigation.

## Verification

Use existing lint and build throughout development; add a no-emit type check in task 3 and Vitest script in task 8. Create all automated tests together in task 8 under src/tests/; until then use type checking, lint, build and task-specific manual checks. Mock network in focused behavior tests. Verify API/CORS, refresh/Back, persistence and desktop/mobile layout in a real browser. Record only actual checks and mark tasks complete only after their Done when conditions pass.


## AniList scope and presentation (task 4)

AniList is the only data API. Verified media ID 21 identifies ONE PIECE (TV, 1999); role/relevance/ID ordering returned the five requested central characters in the first 25 records. Request Media.characters(page: 1, perPage: 25, sort: [ROLE, RELEVANCE, ID]), nodes with id/name.full/image.large/description(asHtml: false), and pageInfo.hasNextPage. Validate unique IDs and normalize names/images/descriptions into the simple Character model. Load at most 25 records for this single media entry; no load-more feature. Show the actual loaded count and a Hebrew notice that this is a limited collection, with additional-source-record feedback from hasNextPage; do not use total/lastPage as authoritative completeness signals. Search and favorites filtering operate only on the loaded collection. Unloaded route IDs receive an outside-collection message, not a claim that the character does not exist in One Piece. Favorites store AniList character IDs; sample IDs are not assumed to identify the same characters.

Keep controls and system messages in Hebrew RTL and source names/descriptions in English LTR. Render description(asHtml: false) as a React text node with preserved line breaks and wrapping, not injected HTML or dangerouslySetInnerHTML. In task 4, use one simple shared text-cleaning helper (planned src/utils/characterDescription.ts) for cards and details: remove formatting delimiters such as __ and ~!/!~, retain spoiler content, replace Markdown links with their visible labels only (no URL or clickable link) and remove standalone URLs, and preserve paragraph breaks. Render the result as React text, never HTML. This is targeted source-format cleanup, not a full Markdown parser. Cards show a heading and text left of a fixed 100×140 image on the right; placeholders retain those dimensions. Extract up to four explicitly labeled short facts (Height, Bounty, Devil Fruit, Devil Fruit Type) from cleaned description lines without inventing values; when none exist, derive card excerpts from the cleaned text, collapse whitespace only for excerpts and truncate to at most 180 characters at a word boundary with an ellipsis when needed; invent no facts. Details show the full cleaned text with paragraphs and LTR direction. Treat empty-after-cleaning text as missing. Task 5 handles card grid, spacing, typography, image sizing and responsive list/details layout; task 4 supplies basic readable text, excerpts and selection behavior. Show a spoiler notice and Hebrew feedback for null/blank descriptions. No separate job, ability or Devil Fruit fields are promised; only source descriptions may mention them. For null/blank image URLs or img onError, replace the image with Hebrew unavailable-image feedback; reset the failed-image state when the URL changes. Accept only HTTPS image URLs; load AniList-supplied CDN URLs directly, with useful alt text and no second image API.

During task 4 run typecheck/lint/build and verify in Chrome from the actual Vite origin: direct POST to AniList, successful response and CORS/preflight, real image requests and display, selection/details and missing/broken-image feedback. Use Network Offline or block only the AniList endpoint, reload to observe error, then restore access and retry to confirm live recovery. Throttle the network to observe loading. GraphQL errors and malformed data get focused automated coverage in task 8; do not claim they were manually observed unless actually exercised. No proxy, translation service, backend or local-data fallback. Image failure affects its placeholder, not the successful character-list request.






## Task 6 route-view refinement

Add only react-router-dom as a runtime dependency, with its built-in TypeScript support. main.tsx wraps App in BrowserRouter. App uses useLocation/useNavigate and matchPath to match /characters/:id, keeping App outside route-dependent remounts. CharacterList and CharacterCard retain onSelect props; selection updates App state and navigates once only when the target path differs. The pathname synchronization effect validates a positive safe integer ID and updates selectedCharacterId only when different; it never navigates. There is no state-to-navigation effect. Home sets selection to null without resetting searchQuery. A home button navigates explicitly to / rather than blindly going back, so direct-entry users always reach the list. Search survives route changes, but full reload starts a fresh search; no storage is added.

For valid direct IDs, show loading or fetch error/retry first, then resolve membership in the loaded collection. Non-numeric, zero, negative or unsafe IDs show invalid-ID feedback; valid IDs outside the collection show an accurate outside-collection message, not a claim that the character does not exist. Unknown paths show a separate route-not-found message. Each feedback view offers return to list. No new request is triggered solely by navigation. On pathname change, move the viewport to the top and focus the route heading so details are immediately visible, including keyboard navigation. No extra data API or per-character request is introduced.

Implementation files: main.tsx, App.tsx, index.css for route-specific presentation if needed, package.json/package-lock.json and matching planning documents; existing CharacterDetails/Card/List/SearchBar props stay intact unless minimal accessibility changes require them. Run typecheck, lint and build. Manually verify filtered list → character → return with search preserved; top-of-view details on narrow screens; direct entry and refresh (for example /characters/40); Back/Forward; home clearing selection; invalid IDs, unloaded IDs and unknown paths; loading/error/retry on direct entry; keyboard focus and no horizontal overflow. Deployment needs SPA fallback, while Vite direct-link behavior must be tested locally. No favorites or automated tests until their planned tasks.
