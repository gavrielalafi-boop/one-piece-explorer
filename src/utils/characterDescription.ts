/*
 * פונקציות העזר מקבלות טקסט ממקור הנתונים ומכינות אותו להצגה כשמות ותיאורים.
 * הן מפענחות סימוני תווים ומנקות סימוני עיצוב וכתובות מתוך תיאורים, תוך שמירת
 * טקסט הקישורים וחלוקת הפסקאות. תיאור חסר הופך לטקסט ריק, והפלט מיועד להצגה
 * כטקסט רגיל ברכיבים ולא כתוכן שמפעיל תגיות.
 */
/*
 * סימונים מוכרים מוחלפים בתווים, וסימונים לא מוכרים או מספרי תווים לא תקינים
 * נשארים כפי שהתקבלו, כדי לא לאבד טקסט או לנסות ליצור תו שאינו תקין.
 */
export function decodeCharacterText(text: string): string {
  const entities: Record<string, string> = {
    amp: '&', apos: "'", quot: '"', lt: '<', gt: '>', nbsp: '\u00a0',
    ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’',
    ldquo: '“', rdquo: '”', copy: '©', times: '×', euro: '€',
  }
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity: string, value: string) => {
    if (!value.startsWith('#')) return entities[value] ?? entity
    const code = value[1].toLowerCase() === 'x' ? parseInt(value.slice(2), 16) : Number(value.slice(1))
    if (!Number.isInteger(code) || code <= 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) return entity
    return String.fromCodePoint(code)
  })
}

/*
 * סדר הניקוי שומר תחילה את תוויות הקישורים, ואז מסיר כתובות וסימוני עיצוב וספוילרים.
 * מעברי שורה מאוחדים ורווחים עודפים מצומצמים, תוך שמירה על הפרדה בין פסקאות.
 */
export function cleanCharacterDescription(description: string | null): string {
  return decodeCharacterText(description ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    .replace(/^\s*\[[^\]]+\]:\s*\S+.*$/gm, '')
    .replace(/<?(?:https?:\/\/|ftp:\/\/|mailto:|www\.)[^\s<>]+>?/gi, '')
    .replace(/~!|!~|__|\*\*|~~|`/g, '')
    .replace(/(^|\n)[ \t]*#{1,6}[ \t]+/g, '$1')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
