# Tasks — One Piece Explorer

Planning only; no development task is completed. Setup is saved in e6b43bd. Work on one task at a time, review the diff, run relevant checks, document only actual checks, then stop and explain the change in three sentences. The user handles commits unless explicitly requested otherwise.

- [ ] **1 · Local JSON list** — Render at least five sample characters from src/data/characters.sample.json through separate CharacterList and CharacterCard components, initially in JavaScript.
  **Done when:** all sample names appear, each item uses its unique ID as key and the browser Console has no app errors.
- [ ] **2 · Selection and details** — Keep selection state in App; pass data and callbacks through props.
  **Done when:** before selection an instruction appears; clicking a sample character displays its facts and highlights its card; missing facts show an unknown label.
- [ ] **3 · Explicit TypeScript conversion** — Add minimal tooling, convert existing React files to TSX and introduce basic character and props types without changing behavior.
  **Done when:** a no-emit type-check script, lint and build pass; the JSON list and selection still work and automatic prompt logging remains intact.
- [ ] **4 · Live API and retry** — Replace sample data with fetch in useEffect; handle loading, HTTP/network/data errors, retry, cancellation and missing fields.
  **Done when:** live browser access works without credentials, real characters appear, failures show retry, retry can recover and missing data does not crash the app.
- [ ] **5 · Search and responsive RTL styling** — Case-insensitive name search, no-results feedback and plain CSS for Hebrew RTL, keyboard focus and mobile layout.
  **Done when:** “Luffy” returns matching names, unmatched text shows feedback, keyboard selection works and a narrow viewport has no horizontal scrolling.
- [ ] **6 · React Router** — Add home and character routes; keep selectedCharacterId as state in App. Selection updates state and navigates only when the target path differs; a route-change effect updates state only when the parsed ID differs, without navigating.
  **Done when:** selection updates the URL, direct links and refresh populate App selection state, Back restores selection, home clears it, unknown routes/IDs show a clear message after loading and synchronization creates no update loop or duplicate history entries.
- [ ] **7 · localStorage favorites** — Store IDs, add separate toggle buttons and a favorites filter; handle malformed or unavailable storage.
  **Done when:** favorites survive reload, removal/filtering work, toggles do not accidentally navigate and storage failures do not crash the app.
- [ ] **8 · Vitest and submission documentation** — Add focused selection/navigation and API error/retry tests; update README and run final checks.
  **Done when:** Vitest, type checking, lint and build pass; actual desktop/mobile browser checks are recorded; the final five Hebrew sentences in README explain where selectedCharacterId is stored in App, how selection updates it, how the selected character is derived and how props carry its data to CharacterDetails; run instructions and the API source are documented in separate sections; student code review, video and repository/video submission links are checked separately before submission, without inventing completed checks.
