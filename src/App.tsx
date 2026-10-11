import { useEffect, useRef, useState } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import CharacterDetails from './components/CharacterDetails'
import CharacterList from './components/CharacterList'
import SearchBar from './components/SearchBar'
import Pagination from './components/Pagination'
import Header from './components/Header'
import Footer from './components/Footer'
import { decodeCharacterText } from './utils/characterDescription'
import type { Character } from './types'

const favoritesStorageKey = 'one-piece-explorer:favorites'

function readFavoriteStorage(): { ids: number[]; message: string } {
  try {
    const stored = localStorage.getItem(favoritesStorageKey)
    if (stored === null) return { ids: [], message: '' }
    let value: unknown
    try { value = JSON.parse(stored) }
    catch { return { ids: [], message: 'נתוני המועדפים השמורים פגומים. מתחילים עם רשימה ריקה; שינוי מועדפים ישמור רשימה חדשה.' } }
    if (!Array.isArray(value) || !value.every((id: unknown) => typeof id === 'number' && Number.isSafeInteger(id) && id > 0)) {
      return { ids: [], message: 'נתוני המועדפים השמורים אינם תקינים. מתחילים עם רשימה ריקה; שינוי מועדפים ישמור רשימה חדשה.' }
    }
    return { ids: [...new Set<number>(value)], message: '' }
  } catch {
    return { ids: [], message: 'אחסון המועדפים אינו זמין. אפשר להשתמש במועדפים כעת, אך שמירה לאחר רענון אינה מובטחת.' }
  }
}

const query = `query($page: Int!) {
  Media(id: 21, type: ANIME) {
    characters(page: $page, perPage: 25, sort: [ROLE, RELEVANCE, ID]) {
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
      name: decodeCharacterText(node.name.full),
      imageUrl: imageUrl?.startsWith('https://') ? imageUrl : null,
      description: optionalText(node.description),
    }
  })
  return { characters, hasNextPage: connection.pageInfo.hasNextPage }
}

export default function App() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const routeHeading = useRef<HTMLHeadingElement>(null)
  const isHome = pathname === '/'
  const characterRoute = matchPath('/characters/:id', pathname)
  const rawId = characterRoute?.params.id
  const routeId = rawId && /^[1-9]\d*$/.test(rawId) && Number.isSafeInteger(Number(rawId)) ? Number(rawId) : null
  const pageValues = new URLSearchParams(search).getAll('page')
  const rawPage = pageValues[0]
  const page = rawPage === undefined ? 1 : /^[1-6]$/.test(rawPage) && pageValues.length === 1 ? Number(rawPage) : null
  const [characters, setCharacters] = useState<Character[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [initialFavorites] = useState(readFavoriteStorage)
  const [favoriteIds, setFavoriteIds] = useState<number[]>(initialFavorites.ids)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [storageMessage, setStorageMessage] = useState(initialFavorites.message)
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(routeId)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [nextApiPage, setNextApiPage] = useState(1)
  const [retryAt, setRetryAt] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [lastListContext, setLastListContext] = useState({ searchQuery: '', favoritesOnly: false, page: 1 })
  const selectedCharacter = characters.find((character) => character.id === selectedCharacterId)
  const hasSelectedCharacter = selectedCharacter !== undefined
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(normalizedQuery) && (!favoritesOnly || favoriteIds.includes(character.id)))
  const pageCount = Math.ceil(filteredCharacters.length / 25)
  const visibleCharacters = page ? filteredCharacters.slice((page - 1) * 25, page * 25) : []
  const outsidePage = page !== null && page > Math.max(1, pageCount)

  useEffect(() => {
    // Browser history is external state; synchronization never navigates.
    // eslint-disable-next-line react/set-state-in-effect
    setSelectedCharacterId((previous) => previous === routeId ? previous : routeId)
  }, [routeId])

  useEffect(() => {
    if (nextApiPage > 6) return
    const controller = new AbortController()
    let active = true
    async function loadPage() {
      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ query, variables: { page: nextApiPage } }),
          signal: controller.signal,
        })
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          const seconds = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) : null
          const date = retryAfter ? Date.parse(retryAfter) : NaN
          const waitMs = seconds !== null ? seconds * 1000 : Number.isFinite(date) ? Math.max(0, date - Date.now()) : 60000
          if (!active) return
          setRetryAt(Date.now() + Math.max(3000, waitMs))
          throw new Error('AniList הגביל את קצב הבקשות. המתינו עד שכפתור הניסיון הנוסף יהיה זמין.')
        }
        if (!response.ok) throw new Error(`טעינת הדמויות נכשלה (HTTP ${response.status}).`)
        let payload: unknown
        try { payload = await response.json() }
        catch { throw new Error('השרת החזיר נתונים שאינם JSON תקין.') }
        const result = readCharacters(payload)
        if (result.characters.length === 0 && result.hasNextPage) throw new Error('התקבל עמוד ריק עם סימון לעמוד נוסף. נסו שוב.')
        if (!active) return
        setCharacters((previous) => [...previous, ...result.characters.filter((character) =>
          !previous.some((existing) => existing.id === character.id))].slice(0, 150))
        const finished = !result.hasNextPage || nextApiPage === 6
        setNextApiPage(finished ? 7 : nextApiPage + 1)
        if (finished) setStatus('success')
      } catch (error: unknown) {
        if (!active || controller.signal.aborted) return
        setErrorMessage(error instanceof TypeError
          ? 'לא ניתן להתחבר ל־AniList. בדקו את החיבור ונסו שוב.'
          : error instanceof Error ? error.message : 'טעינת הדמויות נכשלה.')
        setStatus('error')
      }
    }
    // A deferred first request lets StrictMode cleanup cancel before sending it.
    const timer = window.setTimeout(() => { void loadPage() }, nextApiPage === 1 ? 0 : 3000)
    return () => { active = false; window.clearTimeout(timer); controller.abort() }
  }, [nextApiPage, attempt])

  useEffect(() => {
    if (!retryAt) return
    const timer = window.setTimeout(() => setRetryAt(0), Math.max(0, retryAt - Date.now()))
    return () => window.clearTimeout(timer)
  }, [retryAt])

  useEffect(() => {
    const heading = document.getElementById('character-details-heading') ?? routeHeading.current
    heading?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, selectedCharacterId, hasSelectedCharacter])

  function changePage(number: number, replace = false) {
    const target = `/?page=${number}`
    if (`${pathname}${search}` !== target) navigate(target, { replace })
  }

  function changeSearch(value: string) {
    setSearchQuery(value)
    changePage(1, true)
  }

  function changeFavoritesFilter(value: boolean) {
    setFavoritesOnly(value)
    changePage(1, true)
  }

  function selectCharacter(id: number) {
    setLastListContext({ searchQuery, favoritesOnly, page: page ?? 1 })
    setSelectedCharacterId(id)
    const target = `/characters/${id}`
    if (pathname !== target) navigate(target)
  }

  function toggleFavorite(id: number) {
    const nextIds = favoriteIds.includes(id) ? favoriteIds.filter((favoriteId) => favoriteId !== id) : [...favoriteIds, id]
    setFavoriteIds(nextIds)
    if (favoritesOnly && page) {
      const remaining = characters.filter((character) => nextIds.includes(character.id) && character.name.toLowerCase().includes(normalizedQuery))
      const lastPage = Math.max(1, Math.ceil(remaining.length / 25))
      if (page > lastPage) changePage(lastPage, true)
    }
    try {
      localStorage.setItem(favoritesStorageKey, JSON.stringify(nextIds))
      setStorageMessage('')
    } catch {
      setStorageMessage('לא ניתן לשמור מועדפים. השינוי זמין כעת בזיכרון, אך שמירה לאחר רענון אינה מובטחת.')
    }
  }

  function returnToList() {
    setSelectedCharacterId(null)
    setSearchQuery(lastListContext.searchQuery)
    setFavoritesOnly(lastListContext.favoritesOnly)
    changePage(lastListContext.page)
  }

  function retryLoading() {
    if (retryAt > Date.now()) return
    setStatus('loading')
    setErrorMessage('')
    setAttempt((value) => value + 1)
  }

  const routeError = !isHome && !characterRoute ? 'הכתובת אינה מוכרת.'
    : characterRoute && routeId === null ? 'מזהה הדמות אינו תקין.' : null

  return (
    <>
    <Header />
    <main className="app">
      {storageMessage && <p role="status">{storageMessage}</p>}
      <h2 ref={routeHeading} tabIndex={-1}>{isHome ? 'דמויות' : 'פרטי דמות'}</h2>
      {!isHome && <button type="button" className="return-button" onClick={returnToList}>חזרה לרשימה</button>}
      {status === 'loading' && <p role="status">{characters.length > 0 ? 'טוען דמויות נוספות…' : 'טוען דמויות…'}</p>}
      {status === 'error' && <div role="alert">
        <p>{errorMessage} האוסף חלקי; הדמויות שכבר נטענו נשמרו.</p>
        <button type="button" disabled={retryAt > 0} onClick={retryLoading}>ניסיון נוסף</button>
      </div>}
      {routeError ? <p role="alert">{routeError}</p> : isHome ? <>
        <p>התקצירים והתיאורים עשויים להכיל ספוילרים.</p>
        <SearchBar value={searchQuery} onSearchChange={changeSearch} favoritesOnly={favoritesOnly} onFavoritesOnlyChange={changeFavoritesFilter} />
        <p role="status">נמצאו {filteredCharacters.length} התאמות.</p>
        <Pagination count={filteredCharacters.length} page={page ?? 1} onPageChange={changePage} />
        {page === null || (outsidePage && status === 'success') ? <div role="alert">
          <p>מספר העמוד אינו תקין או מחוץ לטווח התוצאות.</p>
          <button type="button" onClick={() => changePage(1, true)}>לעמוד הראשון</button>
        </div> : outsidePage ? <p role="status">עמוד התצוגה המבוקש עדיין אינו זמין באוסף החלקי. ממתינים להמשך הטעינה.</p> :
          <section className="character-list-panel" aria-label="רשימת דמויות">
            {visibleCharacters.length > 0
              ? <CharacterList characters={visibleCharacters} selectedCharacterId={selectedCharacterId} onSelect={selectCharacter} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />
              : <p>{status !== 'success' ? 'אין כרגע התאמות בדמויות שנטענו. תוצאות נוספות עשויות להגיע בהמשך הטעינה.'
                : favoritesOnly ? 'לא נמצאו מועדפים תואמים באוסף הנבחר. נסו לנקות חיפוש או לבטל את המסנן.' : 'לא נמצאו התאמות באוסף הנבחר. נסו שם אחר או נקו את החיפוש.'}</p>}
          </section>}
        <p>מוצג אוסף נבחר של עד 150 דמויות.</p>
      </> : selectedCharacterId !== routeId ? <p role="status">טוען את הבחירה...</p>
        : selectedCharacter ? <div className="character-details-panel">
          <p>התיאור עשוי להכיל ספוילרים.</p>
          <CharacterDetails key={selectedCharacterId} character={selectedCharacter} />
        </div> : status === 'success' ? <p role="alert">הדמות אינה באוסף הנבחר של עד 150 דמויות שנטענו.</p>
          : <p role="status">פרטי הדמות עדיין לא הגיעו. יש להשלים את טעינת האוסף הנבחר.</p>}
    </main>
    <Footer />
    </>
  )
}
