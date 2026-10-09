# PRD — One Piece Explorer

## 1. Pitch
A Hebrew RTL app that helps One Piece fans find characters and explore their key facts.

## 2. Who it is for
Fans who want to quickly read a character’s crew, role and available facts. Details may contain spoilers.

## 3. Screens
- List: character names, name search and a favorites filter.
- Details: selected character facts beside the list on desktop and below it on mobile; an instruction appears before selection.
- React Router provides direct character URLs and browser Back navigation; unknown routes or IDs show a clear message.

## 4. Must-have features
1. Load characters from a free public API without a key, with loading, error and retry states.
2. Select a character and display facts; label missing values as unknown.
3. Search source-language names without case sensitivity; show no-results feedback.
4. Save, remove and filter favorites using localStorage.
5. Provide readable Hebrew RTL screens on desktop and mobile with React Router navigation.

## 5. Acceptance criteria
- When I open the app, I see loading followed by names and an instruction to choose a character.
- When I select a character or open a direct URL, I see available facts; Back restores the previous view and unknown URLs show a clear message.
- When I search for “Luffy”, I see matching names; an unmatched query shows no-results feedback.
- When a request fails, I see an error and retry button; retry starts a new request.
- When I favorite a character and reload, it remains saved and can be filtered or removed; mobile has no horizontal scrolling.

## 6. Not now
No server, database, accounts, extra content sections, image API or Hebrew name aliases. Images are not required.

All four course bonuses are planned: basic TypeScript, React Router, localStorage favorites and focused Vitest tests. TypeScript conversion is an explicit step after the local list and selection tasks. Preserve the starter and automatic prompt logging; no UI or state-management libraries.

## 7. Data
API: https://api.api-onepiece.com/v2/characters/en
List fields: id, name. Details: name, crew.name, job, age, size, bounty, fruit.name, fruit.type, status; missing fields are allowed.
Tasks 1–2 use at least five local JSON records. Verify live browser access, CORS and response shape during the API task; prior checks in the supplied documents are not new verification.
