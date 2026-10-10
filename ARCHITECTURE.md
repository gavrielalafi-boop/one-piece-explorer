# Architecture — One Piece Explorer

Planning only. Tasks 1–2 use JavaScript; task 3 explicitly converts existing files to simple TypeScript. Router and Vitest are introduced in tasks 6 and 8. Use plain CSS and built-in fetch; no server, database, UI or state-management libraries.

## Planned final files and responsibilities

| File | Responsibility |
|---|---|
| src/main.tsx | Mount React; provide BrowserRouter from task 6. |
| src/App.tsx | Own data, selectedCharacterId state, request state, search and favorites; synchronize selection with routes, compose list/details and fetch in useEffect. |
| src/App.css, src/index.css | Adapt existing styles for Hebrew RTL, visible focus and responsive layout. |
| src/types.ts | Basic Character and optional nested crew/fruit types; props types stay in component files. |
| src/data/characters.sample.json | At least five samples for tasks 1–2; retain after API integration. |
| src/components/Header.tsx | Heading and home link. |
| src/components/SearchBar.tsx | Controlled search and favorites-only control. |
| src/components/CharacterList.tsx | Map cards with unique character ID keys. |
| src/components/CharacterCard.tsx | Name, selection, active indication and separate favorite toggle. |
| src/components/CharacterDetails.tsx | Facts, missing-value labels and instruction before selection. |
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

Both home and character routes compose the same list/details layout. CSS places details beside the list on desktop and below it on mobile.

## State and props

App owns characters, searchQuery, requestStatus (idle/loading/success/error), errorMessage, favoriteIds and favoritesOnly as features are introduced. Task 2 adds nullable selectedCharacterId state in App; task 6 retains it and synchronizes it with the /characters/:id route. selectedCharacter and visibleCharacters are derived values. App finds selectedCharacter by its state ID and passes that character through props to CharacterDetails.

Data flows down through props; callbacks such as onSelect, onSearchChange, onToggleFavorite and onRetry flow up. Children do not mutate props. Fetch in useEffect checks HTTP status and basic response shape, cancels obsolete requests with AbortController and starts a fresh request on retry. Missing optional fields show an unknown label.

## Routes and persistence

Use / and /characters/:id with a fallback for unknown routes. A selection handler updates selectedCharacterId in App and navigates only if the target path differs from the current path. One effect observes pathname changes, parses the route ID and updates selectedCharacterId only if it differs; this effect never navigates. Do not add an effect that navigates whenever selection state changes: this avoids an update loop and duplicate history entries. Direct entry, refresh and browser Back use the route-change effect to restore App state; home clears selection to null. A malformed ID or unknown route clears selection and shows route feedback. A well-formed ID is stored while data loads and checked against characters after successful loading; keep request errors distinct from unknown-character feedback. Future hosting must provide SPA fallback for direct-link refresh; verify localhost behavior in task 6.

Store only character IDs under localStorage key one-piece-explorer:favorites. Validate stored arrays and handle malformed JSON or blocked storage without crashing; in-memory favorites remain usable if persistence fails. Favorite toggles are separate from navigation.

## Verification

Use existing lint and build throughout development; add a no-emit type check in task 3 and Vitest script in task 8. Create all automated tests together in task 8 under src/tests/; until then use type checking, lint, build and task-specific manual checks. Mock network in focused behavior tests. Verify API/CORS, refresh/Back, persistence and desktop/mobile layout in a real browser. Record only actual checks and mark tasks complete only after their Done when conditions pass.

