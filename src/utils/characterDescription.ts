export function cleanCharacterDescription(description: string | null): string {
  return (description ?? '')
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

export function createCharacterExcerpt(description: string): string {
  const text = description.replace(/\s+/g, ' ').trim()
  if (text.length <= 180) return text
  const prefix = text.slice(0, 179)
  const lastSpace = prefix.lastIndexOf(' ')
  return `${prefix.slice(0, lastSpace > 0 ? lastSpace : 179).trimEnd()}…`
}

export function extractCharacterFacts(description: string): { label: string; value: string }[] {
  const labels = ['Height', 'Bounty', 'Devil Fruit', 'Devil Fruit Type']
  const lines = description.split('\n')
  return labels.flatMap((label) => {
    const pattern = new RegExp(`^\\s*(?:[-*]\\s+)?${label}\\s*:\\s*(.+)$`, 'i')
    for (const line of lines) {
      const match = line.match(pattern)
      if (match) {
        const value = match[1].trim()
        if (value && value.length <= 160) return [{ label, value }]
      }
    }
    return []
  })
}
