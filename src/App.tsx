import { useEffect, useState } from 'react'
import CharacterDetails from './components/CharacterDetails'
import CharacterList from './components/CharacterList'
import SearchBar from './components/SearchBar'
import type { Character } from './types'

const query = `query {
  Media(id: 21, type: ANIME) {
    characters(page: 1, perPage: 25, sort: [ROLE, RELEVANCE, ID]) {
      pageInfo { hasNextPage }
      nodes { id name { full } image { large } description(asHtml: false) }
    }
  }
}`

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function optionalText(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value !== 'string') throw new Error('מבנה הנתונים שהתקבל אינו תקין.')
  return value.trim() ? value : null
}

function readCharacters(payload: unknown): { characters: Character[]; hasNextPage: boolean } {
  if (!isObject(payload)) throw new Error('תגובת הנתונים אינה תקינה.')
  if (payload.errors !== undefined) {
    if (!Array.isArray(payload.errors)) throw new Error('תגובת הנתונים אינה תקינה.')
    if (payload.errors.length > 0) throw new Error('AniList החזיר שגיאת GraphQL. נסו שוב.')
  }
  const data = payload.data
  if (!isObject(data) || !isObject(data.Media) || !isObject(data.Media.characters)) {
    throw new Error('לא התקבלו נתוני הדמויות הצפויים.')
  }
  const connection = data.Media.characters
  if (!Array.isArray(connection.nodes) || connection.nodes.length > 25 ||
      !isObject(connection.pageInfo) || typeof connection.pageInfo.hasNextPage !== 'boolean') {
    throw new Error('מבנה רשימת הדמויות אינו תקין.')
  }
  const ids = new Set<number>()
  const characters = connection.nodes.map((node: unknown): Character => {
    if (!isObject(node) || typeof node.id !== 'number' || !Number.isInteger(node.id) || node.id <= 0 ||
        ids.has(node.id) || !isObject(node.name) || typeof node.name.full !== 'string' || !node.name.full.trim()) {
      throw new Error('נתוני דמות אינם תקינים.')
    }
    ids.add(node.id)
    if (node.image != null && !isObject(node.image)) throw new Error('נתוני תמונה אינם תקינים.')
    const imageUrl = isObject(node.image) ? optionalText(node.image.large) : null
    return {
      id: node.id,
      name: node.name.full,
      imageUrl: imageUrl?.startsWith('https://') ? imageUrl : null,
      description: optionalText(node.description),
    }
  })
  return { characters, hasNextPage: connection.pageInfo.hasNextPage }
}

export default function App() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [hasNextPage, setHasNextPage] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const selectedCharacter = characters.find((character) => character.id === selectedCharacterId)
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const visibleCharacters = characters.filter((character) => character.name.toLowerCase().includes(normalizedQuery))

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    async function loadCharacters() {
      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`טעינת הדמויות נכשלה (HTTP ${response.status}). נסו שוב.`)
        let payload: unknown
        try { payload = await response.json() }
        catch { throw new Error('השרת החזיר נתונים שאינם JSON תקין.') }
        const result = readCharacters(payload)
        if (!active) return
        setCharacters(result.characters)
        setHasNextPage(result.hasNextPage)
        setStatus('success')
      } catch (error: unknown) {
        if (!active || controller.signal.aborted) return
        setErrorMessage(error instanceof TypeError
          ? 'לא ניתן להתחבר ל־AniList. בדקו את החיבור ונסו שוב.'
          : error instanceof Error ? error.message : 'טעינת הדמויות נכשלה. נסו שוב.')
        setStatus('error')
      }
    }
    void loadCharacters()
    return () => { active = false; controller.abort() }
  }, [attempt])

  return (
    <main className="app">
      <h1>One Piece Explorer</h1>
      <h2>דמויות</h2>
      {status === 'loading' && <p role="status">טוען דמויות מ־AniList...</p>}
      {status === 'error' && <div role="alert">
        <p>{errorMessage}</p>
        <button type="button" onClick={() => { setStatus('loading'); setErrorMessage(''); setAttempt((value) => value + 1) }}>ניסיון נוסף</button>
      </div>}
      {status === 'success' && <>
        <p>זהו אוסף מוגבל של עד 25 דמויות מהאנימה המקורית; נטענו {characters.length} דמויות.</p>
        <p>התקצירים והתיאורים עשויים להכיל ספוילרים.</p>
        {hasNextPage && <p>קיימות דמויות נוספות ב־AniList שאינן מוצגות באוסף הזה.</p>}
        {characters.length === 0 ? <p>לא התקבלו דמויות באוסף הזה.</p> : <>
          <SearchBar value={searchQuery} onSearchChange={setSearchQuery} />
          <p role="status">נמצאו {visibleCharacters.length} התאמות מתוך {characters.length} דמויות שנטענו.</p>
          <div className="character-layout">
            <section className="character-list-panel" aria-label="רשימת דמויות">
              {visibleCharacters.length > 0
                ? <CharacterList characters={visibleCharacters} selectedCharacterId={selectedCharacterId} onSelect={setSelectedCharacterId} />
                : <p>לא נמצאו דמויות באוסף שנטען. נסו שם אחר או נקו את החיפוש.</p>}
            </section>
            <div className="character-details-panel">
              <CharacterDetails key={selectedCharacterId} character={selectedCharacter} />
            </div>
          </div>
        </>}
      </>}
    </main>
  )
}

