/*
 * נתוני הדמה בקובץ משמשים לבדיקת חיפוש, שילוב מועדפים וגבולות עמודים.
 * הבדיקות קוראות לפונקציות שמשמשות גם את האפליקציה, בלי לטעון רכיבים או לפנות לרשת.
 */
import { describe, expect, it } from 'vitest'
import { filterCharacters, getPageCharacters, getPageCount } from '../utils/characterCollection'
import type { Character } from '../types'

const characters: Character[] = [
  { id: 1, name: 'Monkey D. Luffy', imageUrl: null, description: null },
  { id: 2, name: 'Monkey D. Garp', imageUrl: null, description: null },
  { id: 3, name: 'Roronoa Zoro', imageUrl: null, description: null },
]

describe('character filtering', () => {
  it('ignores query case and surrounding spaces without changing the source array', () => {
    const before = characters.map((character) => ({ ...character }))
    expect(filterCharacters(characters, '  lUfFy  ', [], false)).toEqual([characters[0]])
    expect(characters).toEqual(before)
  })

  it.each([
    { favoritesOnly: true, ids: [2] },
    { favoritesOnly: false, ids: [1, 2] },
  ])('combines name search with favorites when enabled: $favoritesOnly', ({ favoritesOnly, ids }) => {
    expect(filterCharacters(characters, 'Monkey', [2, 3], favoritesOnly).map((character) => character.id))
      .toEqual(ids)
  })

  it('produces no display items or result pages when search has no matches', () => {
    const filtered = filterCharacters(characters, 'missing', [], false)
    expect(filtered).toEqual([])
    expect(getPageCount(filtered.length)).toBe(0)
    expect(getPageCharacters(filtered, 1)).toEqual([])
  })
})

describe('character pagination', () => {
  const collection: Character[] = Array.from({ length: 52 }, (_, index) => ({
    id: index + 1, name: `Character ${index + 1}`, imageUrl: null, description: null,
  }))

  it.each([
    { page: 1, expectedIds: Array.from({ length: 25 }, (_, index) => index + 1) },
    { page: 2, expectedIds: Array.from({ length: 25 }, (_, index) => index + 26) },
    { page: 3, expectedIds: [51, 52] },
  ])('returns the exact items for page $page, including the partial last page', ({ page, expectedIds }) => {
    expect(getPageCount(collection.length)).toBe(3)
    expect(getPageCharacters(collection, page).map((character) => character.id)).toEqual(expectedIds)
  })
})
