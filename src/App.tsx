import { useEffect, useRef, useState } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
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
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const routeHeading = useRef<HTMLHeadingElement>(null)
  const isHome = pathname === '/'
  const characterRoute = matchPath('/characters/:id', pathname)
  const rawId = characterRoute?.params.id
  const routeId = rawId && /^[1-9]\d*$/.test(rawId) && Number.isSafeInteger(Number(rawId)) ? Number(rawId) : null
  const [characters, setCharacters] = useState<Character[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(routeId)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [hasNextPage, setHasNextPage] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const selectedCharacter = characters.find((character) => character.id === selectedCharacterId)
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const visibleCharacters = characters.filter((character) => character.name.toLowerCase().includes(normalizedQuery))

  useEffect(() => {
    // Read the route into state only; this effect never navigates.
    // Browser history is external state; keep the course-required App state in sync.
    // eslint-disable-next-line react/set-state-in-effect
    setSelectedCharacterId((previous) => previous === routeId ? previous : routeId)
  }, [routeId])

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

  useEffect(() => {
    const heading = document.getElementById('character-details-heading') ?? routeHeading.current
    heading?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, status, selectedCharacterId])

  function selectCharacter(id: number) {
    setSelectedCharacterId(id)
    const targetPath = `/characters/${id}`
    if (pathname !== targetPath) navigate(targetPath)
  }

  function returnToList() {
    setSelectedCharacterId(null)
    if (!isHome) navigate('/')
  }

  const routeError = !isHome && !characterRoute ? 'הכתובת אינה מוכרת.'
    : characterRoute && routeId === null ? 'מזהה הדמות אינו תקין.' : null

  return (
    <main className="app">
      <h1>One Piece Explorer</h1>
      <h2 ref={routeHeading} tabIndex={-1}>{isHome ? 'דמויות' : 'פרטי דמות'}</h2>
      {!isHome && <button type="button" className="return-button" onClick={returnToList}>חזרה לרשימה</button>}
      {routeError ? <p role="alert">{routeError}</p> : <>
        {status === 'loading' && <p role="status">טוען דמויות מ־AniList...</p>}
        {status === 'error' && <div role="alert">
          <p>{errorMessage}</p>
          <button type="button" onClick={() => { setStatus('loading'); setErrorMessage(''); setAttempt((value) => value + 1) }}>ניסיון נוסף</button>
        </div>}
        {status === 'success' && <>
          {isHome ? <>
            <p>זהו אוסף מוגבל של עד 25 דמויות מהאנימה המקורית; נטענו {characters.length} דמויות.</p>
            <p>התקצירים והתיאורים עשויים להכיל ספוילרים.</p>
            {hasNextPage && <p>קיימות דמויות נוספות ב־AniList שאינן מוצגות באוסף הזה.</p>}
            <SearchBar value={searchQuery} onSearchChange={setSearchQuery} />
            <p role="status">נמצאו {visibleCharacters.length} התאמות מתוך {characters.length} דמויות שנטענו.</p>
            <section className="character-list-panel" aria-label="רשימת דמויות">
              {visibleCharacters.length > 0
                ? <CharacterList characters={visibleCharacters} selectedCharacterId={selectedCharacterId} onSelect={selectCharacter} />
                : <p>לא נמצאו דמויות באוסף שנטען. נסו שם אחר או נקו את החיפוש.</p>}
            </section>
          </> : selectedCharacterId !== routeId
            ? <p role="status">טוען את הבחירה...</p>
            : selectedCharacter
            ? <div className="character-details-panel">
              <p>התיאור עשוי להכיל ספוילרים.</p>
              <CharacterDetails key={selectedCharacterId} character={selectedCharacter} />
            </div>
            : <p role="alert">הדמות אינה באוסף של עד 25 הדמויות שנטענו.</p>}
        </>}
      </>}
    </main>
  )
}
