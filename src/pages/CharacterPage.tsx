import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CharacterDetails from '../components/CharacterDetails'
import type { Character } from '../types'

type CharacterPageProps = {
  character: Character | undefined
  selectedCharacterId: number | null
  onSelectionChange: (id: number | null) => void
  status: 'loading' | 'success' | 'error'
}

export default function CharacterPage({ character, selectedCharacterId, onSelectionChange, status }: CharacterPageProps) {
  const { id } = useParams()
  const routeId = id && /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id)) ? Number(id) : null

  useEffect(() => {
    // Synchronize App's selection with direct links and browser history.
    onSelectionChange(routeId)
  }, [routeId, onSelectionChange])

  if (routeId === null) return <p role="alert">מזהה הדמות אינו תקין.</p>
  if (selectedCharacterId !== routeId) return <p role="status">טוען את הבחירה...</p>
  if (character) return (
    <div className="character-details-panel">
      <p>התיאור עשוי להכיל ספוילרים.</p>
      <CharacterDetails key={routeId} character={character} />
    </div>
  )
  return status === 'success'
    ? <p role="alert">הדמות אינה באוסף הנבחר של עד 150 דמויות שנטענו.</p>
    : <p role="status">פרטי הדמות עדיין לא הגיעו. יש להשלים את טעינת האוסף הנבחר.</p>
}
