# One Piece Explorer

[גרסה בעברית](README.he.md)

Final project for course 4255: a Hebrew React application for exploring a selected collection of up to 150 One Piece characters. Names and descriptions are in English and may contain spoilers. [Work history](tasks.md) is separate from this description of the current implementation.

## Screens and mandatory requirements

### Character list

```text
/
/?page=2
```

Search, favorites filtering and up to 25 cards per list page.

### Character details

```text
/characters/:id
```

Image and full description, with return to the originating screen and saved list context.

### Favorites

```text
/favorites
```

Loaded favorite records, without pagination.

### Random character

```text
/random
```

Draw from available records and retain the result across details and return.

The menu links to list, favorites and random, marking the active link. Details open through character selection or a direct URL. Under the updated lecturer instructions supplied by the user, the following are mandatory, not bonuses:

```text
Basic TypeScript
React Router
useParams
Vitest
```

At least five meaningful unit tests are required; 21 are implemented.

## Installation and development

Node.js and npm are required. The checked working environment used version 24.11.0 of Node.js; choose a version compatible with the locked packages, such as the 24 series. Current development tooling versions:

```text
Vite 8.3.3
vitest 5.0.5
@vitest/ui 5.0.5
```

```sh
git clone https://github.com/gavrielalafi-boop/one-piece-explorer.git
cd one-piece-explorer
npm ci
npm run dev
```

Open the URL printed in the terminal. Network access is needed for data and images, without an API key. There is no application server, database or authentication.

## Test and build commands

One test run that exits:

```sh
npm test
```

```text
vitest run
```

Browser test interface and watch mode; open the complete URL printed in the terminal:

```sh
npm run test:ui
```

```text
vitest --ui --watch
```

Type checking without emitting files:

```sh
npm run typecheck
```

```text
tsc --noEmit
```

Linting:

```sh
npm run lint
```

```text
oxlint
```

Production build:

```sh
npm run build
```

```text
vite build
```

Build output:

```text
dist/
```

Local preview after building:

```sh
npm run preview
```

```text
vite preview
```

Dependency advisory check; this is an npm command, not a project package script:

```sh
npm audit
```

Stop a server or watcher with:

```text
Ctrl+C
```

Future hosting must serve the application entry page for internal-route requests. No public website deployment is configured here.

## Data source

Direct browser GraphQL requests use the built-in fetch function and [AniList](https://graphql.anilist.co), without a key or additional GraphQL library. Media 21 is queried with this ordering:

```text
ROLE, RELEVANCE, ID
```

Up to six source pages of 25 yield at most 150 unique characters. The cap is a project scope choice, not a lecturer numeric requirement. Each batch appears on arrival; loading stops early when there is no next page.

Before each additional batch, a three-second delay follows completion of the previous batch. Failure retains data and retry targets the failed page. Cancellation, response-shape validation and rate-limit handling are implemented. Refresh starts live loading again; navigation/search do not add data requests. There is no local character-data source or mock-data fallback.

Search ignores letter case and surrounding query whitespace and combines with favorites before list pagination. Search/filter changes reset to page 1. Only favorite IDs persist in browser storage; search, return context and the random result stay in memory during use. A draw avoids immediate repetition when alternatives exist.

## Directory structure

```text
src/
  main.tsx, App.tsx, types.ts, vite-env.d.ts, index.css
  components/
    Header.tsx, Navigation.tsx, Footer.tsx
    SearchBar.tsx, Pagination.tsx
    CharacterList.tsx, CharacterCard.tsx
    CharacterImage.tsx, CharacterDetails.tsx
  pages/
    CharacterPage.tsx, FavoritesPage.tsx, RandomCharacterPage.tsx
  utils/
    characterDescription.ts
    characterCollection.ts
    randomCharacter.ts
  tests/
    characterDescription.test.ts
    characterCollection.test.ts
    randomCharacter.test.ts
  assets/
    one-piece-logo.png, hero-background.webp, map-margin.svg
```

[Architecture](ARCHITECTURE.md) explains responsibilities and data flow. Helpers decode/clean text, filter and paginate collections, and draw a character; the application itself uses them. Modules have Hebrew opening comments, the central component explains action groups, and the stylesheet has short area headings.

## Tests and coverage

[Unit tests](src/tests/) run in Node without mounting components or making network requests. Mock records exist only in tests.

### Text and descriptions

```text
src/tests/characterDescription.test.ts
```

10 cases: formatting/link cleanup, label and paragraph preservation, missing information, and valid/invalid entities.

### Search and pagination

```text
src/tests/characterCollection.test.ts
```

7 cases: search/whitespace, no source mutation, favorites intersection, empty results and page boundaries including the last page.

### Random selection

```text
src/tests/randomCharacter.test.ts
```

4 cases: no immediate repetition, selection boundaries, a singleton and empty input; randomness is controlled and restored.

There are 21 cases including parameterized edge cases, exercising functions used by the application. There is no percentage coverage report. No automatic integration coverage was implemented for navigation/components, HTTP/GraphQL/response shape, cancellation, rate limiting/retry, storage, images or browser layout/accessibility. The historical plan for that coverage was not implemented and is not a remaining mandatory requirement: the updated requirement is at least five unit tests.

Complementary manual checks include screens/return flows, loading/network behavior, persistence across refresh and storage failure, missing images, keyboard use and narrow screens. This lists areas to check, not a claim that every case was checked after every change.

## Verification attribution

- The agent in this chat successfully ran 21 tests, type checking, linting and building during implementation and visual fixes. Its browser attempts did not complete visual verification.
- The user reported Chrome's test UI showing 21 passing tests in three files; checked search, favorites, empty results, pagination, random selection and return from details, with a clean Console. After visual fixes, the user approved margin visibility, readable content and correct range ordering.
- According to the user's companion-chat report, after the build tool was updated to version 8.3.3, the dependency audit found no reported vulnerabilities and 21 tests, type checking, linting and building passed. The user restarted the server and checked the site. This chat verified the version at test-stage closure without rerunning the companion-chat checks at that point; later visual-fix runs are separately attributed to this chat's agent above.

These are earlier checks, not new executions during documentation updates. The latest visual approval is not explicit verification of every accessibility/narrow-screen case.

## Design assets

### Logo

[Local logo](src/assets/one-piece-logo.png)

```text
src/assets/one-piece-logo.png
```

Header logo, original size 800×292 with preserved aspect ratio. Copied unchanged on 11 October 2026 at the user's request from [Anime Israel](https://animeisrael.co.il/wp-content/uploads/2023/05/One_Piece_Logo.svg.png). Usage permission was not verified.

### Banner

[Local banner](src/assets/hero-background.webp)

```text
src/assets/hero-background.webp
```

Decorative banner; code dimensions are 4640×928 with empty alternative text. The user confirmed that the banner was generated in Gemini. This records its creation source and does not establish legal usage permission.

### Margins

[Local nautical decoration](src/assets/map-margin.svg)

```text
src/assets/map-margin.svg
```

Repeating nautical margin artwork, hidden at viewport widths up to 620 pixels. The user confirmed that this illustration was created locally during the project work. This records its creation source and does not establish legal usage permission.

Plain CSS provides dark control/card surfaces and centered content. Cards have a 210-pixel maximum width, their image area is 180 pixels high, and detail images are 150×210. Range text is RTL with isolated numbers and unchanged endpoints. The footer is fixed. Descriptions render as plain text with paragraphs, without injected markup.

This unofficial educational project claims no sponsorship or official relationship with the brand owners. Credit/source attribution is not usage permission. Historical no-map/logo-only claims do not describe the current assets; the old Wikimedia logo is not the active logo.

## Documents and prompt history

[English PRD](PRD.md), [Hebrew PRD](PRD.he.md), [architecture](ARCHITECTURE.md), [tasks](tasks.md) and [working rules](AGENTS.md).

The [logging configuration](.codex/hooks.json) invokes the [logging script](scripts/log-prompt.mjs) on prompt submission. The [prompt journal](PROMPTS.md) is a work history; do not rewrite past entries. Record who performed each check and what actually changed; do not assume logging works in other tools without verification. Do not enter secrets or sensitive information in the journal before repository publication. Documentation updates do not manually edit the journal.

## Submission and remaining work

Updated instructions supplied by the user: a public repository by **5 November 2026 at 10:00 Israel time**, with an individual defense of about seven minutes instead of a video. The [configured repository URL](https://github.com/gavrielalafi-boop/one-piece-explorer) is not proof that public access or submission was verified.

The user approved the seven updated documentation files and closure of task 11 on 1 November 2026. Review of asset usage permissions, defense preparation, public-access verification, submission checks and actual submission remain incomplete. A defense study guide has not been created; that is a separate stage.

## Character selection and data flow

The selected character ID is stored in the central component's shared state.
Selecting a card updates the ID and navigates to that character's details URL.
The details page reads the ID from the URL and synchronizes selection on direct entry or browser-history navigation.
The selected character is derived by finding its ID in the collection already loaded.
Character data passes through the details page to the detail-display component via props, while update actions return to the central component through supplied callbacks.
