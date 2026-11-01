/*
 * בדיקות ההגרלה משתמשות באוסף מקומי ובערך אקראי מבוקר, כדי לבדוק בחירה מדויקת
 * בלי להסתמך על מזל. לאחר כל בדיקה מוחזרת פעולת ההגרלה המקורית.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { drawCharacterId } from '../utils/randomCharacter'
import type { Character } from '../types'

const characters: Character[] = [
  { id: 1, name: 'Luffy', imageUrl: null, description: null },
  { id: 2, name: 'Zoro', imageUrl: null, description: null },
  { id: 3, name: 'Nami', imageUrl: null, description: null },
]

afterEach(() => vi.restoreAllMocks())

describe('random character selection', () => {
  it.each([
    { random: 0, expectedId: 1 },
    { random: 0.999999, expectedId: 3 },
  ])('excludes the previous result at random boundary $random', ({ random, expectedId }) => {
    vi.spyOn(Math, 'random').mockReturnValue(random)
    expect(drawCharacterId(characters, 2)).toBe(expectedId)
  })

  it('allows the only available character to be selected again', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(drawCharacterId([characters[0]], 1)).toBe(1)
  })

  it('returns no selection for an empty collection without drawing a random number', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(drawCharacterId([], null)).toBeNull()
    expect(random).not.toHaveBeenCalled()
  })
})
