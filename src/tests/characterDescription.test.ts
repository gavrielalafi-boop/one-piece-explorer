/*
 * הבדיקות מאמתות ניקוי תיאורים ופענוח תווים באמצעות טקסט מקומי בלבד.
 * הן בודקות תוכן צפוי מפורש, כולל שימור פסקאות וטיפול במידע חסר או לא תקין.
 */
import { describe, expect, it } from 'vitest'
import { cleanCharacterDescription, decodeCharacterText } from '../utils/characterDescription'

describe('description cleaning', () => {
  it('removes formatting and URLs while preserving link labels and spoiler text', () => {
    const input = '# Captain\n**Strong** ~!secret!~ [Crew](https://example.com)\n[Ship][ship]\n[ship]: https://example.com/ship\nhttps://example.com'
    expect(cleanCharacterDescription(input)).toBe('Captain\nStrong secret Crew\nShip')
  })

  it('normalizes line endings and excess whitespace while preserving paragraphs', () => {
    expect(cleanCharacterDescription('  First\r\n\r\n\r\nSecond  \r\nThird  '))
      .toBe('First\n\nSecond\nThird')
  })

  it.each([null, '', '   \t\r\n'])('returns empty text for a missing or blank description: %j', (input) => {
    expect(cleanCharacterDescription(input)).toBe('')
  })
})

describe('text entity decoding', () => {
  it('decodes named, decimal and hexadecimal entities including a supplementary character', () => {
    expect(decodeCharacterText('A &amp; B &#65; &#x1F600;')).toBe('A & B A 😀')
  })

  it.each(['&unknown;', '&#0;', '&#xD800;', '&#x110000;'])(
    'preserves an unknown or invalid entity: %s', (input) => {
      expect(decodeCharacterText(input)).toBe(input)
    },
  )
})
