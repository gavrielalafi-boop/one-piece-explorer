/*
 * עמוד הפרטים מקבל את הדמות שנבחרה, מזהה הבחירה, מצב הטעינה ופעולה לעדכון הבחירה.
 * הוא קורא גם את המזהה מכתובת העמוד, כדי לתמוך בקישור ישיר ובהיסטוריית הדפדפן,
 * ומתאם בין הכתובת לבין המצב המשותף לפני הצגת פרטי הדמות.
 */
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
  /*
   * המזהה חייב להיות מספר שלם חיובי ובטווח שניתן לייצג במדויק, לפני השימוש בו לבחירה.
   */
  const routeId = id && /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id)) ? Number(id) : null

  useEffect(() => {
    // מסנכרנים את הבחירה המשותפת גם בכניסה מקישור ישיר ובמעבר בהיסטוריית הדפדפן.
    onSelectionChange(routeId)
  }, [routeId, onSelectionChange])

  /*
   * ממתינים לסנכרון הבחירה ולנתונים; רק לאחר השלמת הטעינה אפשר לקבוע
   * שמזהה תקין אינו שייך לאוסף הנבחר.
   */
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
