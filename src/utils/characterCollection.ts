/*
 * פונקציות העזר מקבלות את האוסף הזמין ואת אפשרויות התצוגה ומחזירות תוצאות
 * חיפוש ועמודים בלי לשנות את האוסף. אותם חישובים משמשים את האפליקציה ואת הבדיקות.
 */
import type { Character } from '../types'

export function filterCharacters(characters: Character[], query: string, favoriteIds: number[], favoritesOnly: boolean): Character[] {
  const normalizedQuery = query.trim().toLowerCase()
  return characters.filter((character) =>
    character.name.toLowerCase().includes(normalizedQuery) && (!favoritesOnly || favoriteIds.includes(character.id)))
}

export function getPageCount(count: number): number {
  return Math.ceil(count / 25)
}

export function getPageCharacters(characters: Character[], page: number | null): Character[] {
  return page ? characters.slice((page - 1) * 25, page * 25) : []
}
