/*
 * ההגרלה מקבלת את האוסף הזמין ואת מזהה התוצאה הקודמת ומחזירה מזהה או ערך ריק.
 * כשיש כמה דמויות הקודמת מוצאת מהמועמדות; דמות יחידה יכולה להיבחר שוב.
 */
import type { Character } from '../types'

export function drawCharacterId(characters: Character[], previousId: number | null): number | null {
  const candidates = characters.length > 1
    ? characters.filter((item) => item.id !== previousId)
    : characters
  if (candidates.length === 0) return null
  const index = Math.floor(Math.random() * candidates.length)
  return candidates[index].id
}
