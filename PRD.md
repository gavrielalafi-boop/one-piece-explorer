# PRD — One Piece Explorer

Current requirements, updated 2026-11-01 using the lecturer instructions supplied by the user. [Hebrew translation](PRD.he.md); [implementation and decision history](ARCHITECTURE.md); [historical tasks and current status](tasks.md).

## 1. Pitch

A Hebrew RTL application for exploring a selected collection of up to 150 One Piece characters from live AniList data, with English names and descriptions that may contain spoilers.

## 2. Who it is for

Fans who want to find characters, read details, save favorites and discover a random character. The bounded collection is not a complete franchise catalogue.

## 3. Screens

- List: `/` or `/?page=2`; search and favorites filtering, RTL range controls and up to 25 cards per list page.
- Details: `/characters/:id`; name, image and full cleaned description, direct-link support and return to the origin and saved list context.
- Favorites: `/favorites`; all saved favorites whose records are loaded, with unavailable-record feedback; no pagination here.
- Random: `/random`; draw from loaded records, exclude the previous result when alternatives exist and preserve the result across details and return.

The menu links to list, favorites and random; details open by selection or a direct URL.

## 4. Must-have features

- Basic TypeScript, React Router, `useParams` and Vitest are mandatory, not bonuses. The updated minimum is five meaningful unit tests; unit coverage is implemented. Details and limitations are in [README](README.md).
- Progressive live loading, loading/error feedback, cancellation, rate-limit handling and retry without discarding prior records. Trimmed case-insensitive name search combined with favorites before list pagination; search/filter changes reset the list page.
- Shared state/callbacks in the mounted central component; persist favorite IDs in browser storage with failure handling.
- Plain responsive CSS, Hebrew RTL controls, English LTR source text, accessible controls, local banner/logo/margin artwork and a fixed footer.
- Public repository submission by **5 November 2026 at 10:00 Israel time** and an individual defense of about seven minutes instead of video. Preparation, public access and submission remain unverified.

## 5. Acceptance criteria

- Display each successful batch before the selected scope finishes; retain at most 150 unique characters and stop early when no next source page exists.
- Filter loaded records without new data requests; show up to 25 cards per list page, including a partial last page and empty-results feedback. Range text is RTL with isolated numbers and the first page on the right.
- Support four screens, valid direct character links and history; reject invalid IDs/pages, wait for pending records and offer a first-page action for invalid/out-of-range pages. Outside-collection feedback requires successful loading completion. Return restores origin and saved list context; favorite actions do not navigate, and the random result survives in-app navigation.
- Retain records on request failure, offer retry, avoid stale updates, handle missing text/images and render descriptions as plain text with preserved paragraphs.
- Meet the updated unit-test minimum and distinguish covered logic, manual verification and unperformed integration coverage. Maintain readable responsive presentation and visible keyboard focus.

## 6. Out of scope and history

No backend, database, authentication, extra data API, full-catalogue download, translation service or local character-data fallback. Mock records stay in tests. Previously planned navigation/network integration tests were not implemented and are not a remaining mandatory requirement under the updated unit-test scope. Initial sample data, single-page loading, card facts and removed-asset decisions remain historical in the architecture/tasks documents, not current requirements. No defense study guide is part of this documentation update.

## 7. Data

Direct browser `fetch` to [AniList](https://graphql.anilist.co), without a key or GraphQL library: media 21, up to six sequential source pages of 25 sorted ROLE, RELEVANCE, ID. Read id, full name, large image, plain description and next-page flag; validate responses and deduplicate IDs. Records live in memory; refresh reloads live data. Images use source-supplied URLs. The 150-character cap is a project scope choice, not a lecturer numeric requirement.
