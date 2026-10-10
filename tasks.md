# Tasks — One Piece Explorer

Tasks 1–5 are completed and verified by the user; tasks 6–8 remain planned. Setup is saved in e6b43bd. Work on one task at a time, review the diff, run relevant checks, document only actual checks, then stop and explain the change in three sentences. The user handles commits unless explicitly requested otherwise.

- [x] **1 · Local JSON list** — Render at least five sample characters from src/data/characters.sample.json through separate CharacterList and CharacterCard components, initially in JavaScript.
  **Done when:** all sample names appear, each item uses its unique ID as key and the browser Console has no app errors.
- [x] **2 · Selection and details** — Keep selection state in App; pass data and callbacks through props.
  **Done when:** before selection an instruction appears; clicking a sample character displays its facts and highlights its card; missing facts show an unknown label.
- [x] **3 · Explicit TypeScript conversion** — Add minimal tooling, convert existing React files to TSX and introduce basic character and props types without changing behavior.
  **Done when:** a no-emit type-check script, lint and build pass; the JSON list and selection still work and automatic prompt logging remains intact.
- [x] **4 · Live API and retry** — Replace sample use with direct fetch POST to AniList in useEffect, without a key or GraphQL library. Verify the original One Piece anime media ID; load only page 1 of up to 25 role/relevance/ID-sorted characters and label the limited scope using loaded count/hasNextPage. Adapt Character and components to English name/image/description; keep Hebrew RTL messages and App selection state. Handle HTTP/network/GraphQL/data errors, retry, cancellation and missing/broken images; clean visible formatting/spoiler delimiters and Markdown link URLs and standalone URLs, then render descriptions safely as text with preserved paragraphs and LTR direction. Cards show image/name and up to four explicitly labeled facts (Height, Bounty, Devil Fruit, Devil Fruit Type) extracted from descriptions, with a source-derived excerpt of up to 180 characters as fallback; details show the full cleaned description, with missing-text feedback.
  **Done when:** Chrome verifies direct AniList POST/CORS and real image loading without credentials; up to 25 characters and a limited-collection notice appear; GraphQL errors including HTTP 200 errors are handled; offline/blocking then restore-and-retry recovers without proxy/local fallback; missing descriptions/images and broken images show feedback; cards show derived excerpts and selection opens the full cleaned description; Markdown link labels remain plain text, paragraph breaks are preserved and no unsafe HTML is injected.
- [x] **5 · Search and responsive RTL styling** — Case-insensitive search only over the loaded AniList collection, explicitly labeled as limited to at most 25 records; no-results feedback refers only to that collection, and plain CSS for Hebrew RTL, keyboard focus and mobile layout.
  **Done when:** “Luffy” returns matching names, unmatched text shows feedback, keyboard selection works and a narrow viewport has no horizontal scrolling.
- [ ] **6 · React Router** — Add home and character routes; keep selectedCharacterId as state in App. Selection updates state and navigates only when the target path differs; a route-change effect updates state only when the parsed ID differs, without navigating.
  **Done when:** selection updates the URL, direct links and refresh populate App selection state, Back restores selection, home clears it, unknown routes and IDs outside the loaded collection show accurate messages after loading and synchronization creates no update loop or duplicate history entries.
- [ ] **7 · localStorage favorites** — Store IDs, add separate toggle buttons and a favorites filter; handle malformed or unavailable storage.
  **Done when:** favorites survive reload, removal/filtering work, toggles do not accidentally navigate and storage failures do not crash the app.
- [ ] **8 · Vitest and submission documentation** — Set up Vitest and create automated tests together under src/tests/, covering selection/navigation and AniList HTTP/GraphQL/data error/retry; update README and run final checks.
  **Done when:** Vitest, type checking, lint and build pass; actual desktop/mobile browser checks are recorded; the final five Hebrew sentences in README explain where selectedCharacterId is stored in App, how selection updates it, how the selected character is derived and how props carry its data to CharacterDetails; run instructions and the API source are documented in separate sections; student code review, video and repository/video submission links are checked separately before submission, without inventing completed checks.






