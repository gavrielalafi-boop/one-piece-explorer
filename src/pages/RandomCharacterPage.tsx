/*
 * עמוד ההגרלה מקבל את האוסף הזמין, מצב הטעינה, מזהה ההגרלה הקודמת ופעולות
 * לעדכון ההגרלה, לבחירה ולמועדפים. ההגרלה נעשית רק מתוך הדמויות שכבר נטענו,
 * והתוצאה נשמרת במצב המשותף כדי שתישאר זמינה גם לאחר מעבר לעמוד אחר.
 */
import CharacterCard from '../components/CharacterCard'
import type { Character } from '../types'

type RandomCharacterPageProps = {
  characters: Character[]
  status: 'loading' | 'success' | 'error'
  randomCharacterId: number | null
  onRandomCharacterChange: (id: number) => void
  selectedCharacterId: number | null
  favoriteIds: number[]
  onSelect: (id: number) => void
  onToggleFavorite: (id: number) => void
}

export default function RandomCharacterPage({ characters, status, randomCharacterId, onRandomCharacterChange, selectedCharacterId, favoriteIds, onSelect, onToggleFavorite }: RandomCharacterPageProps) {
  const character = characters.find((item) => item.id === randomCharacterId)

  /*
   * כשיש יותר מדמות אחת מוציאים את התוצאה הקודמת מהמועמדות כדי למנוע חזרה מידית.
   * אם זמינה רק דמות אחת היא נשארת מועמדת; אוסף ריק אינו מפיק תוצאה.
   */
  function drawCharacter() {
    const candidates = characters.length > 1
      ? characters.filter((item) => item.id !== randomCharacterId)
      : characters
    if (candidates.length === 0) return
    const index = Math.floor(Math.random() * candidates.length)
    onRandomCharacterChange(candidates[index].id)
  }

  return (
    <section className="character-list-panel" aria-label="הגרלת דמות">
      {characters.length === 0
        ? <p role="status">{status === 'loading' ? 'עדיין אין דמויות זמינות להגרלה. ממתינים לטעינה.'
          : status === 'error' ? 'אין דמויות זמינות להגרלה עקב כשל בטעינה. אפשר לנסות שוב באמצעות הכפתור למעלה.'
            : 'אין דמויות זמינות להגרלה באוסף.'}</p>
        : status !== 'success' && <p>האוסף חלקי; ההגרלה היא רק מתוך הדמויות שכבר זמינות.</p>}
      <button type="button" onClick={drawCharacter} disabled={characters.length === 0}>הגרל דמות</button>
      <p role="status">{character ? `הדמות שהוגרלה: ${character.name}` : 'לא הוגרלה דמות עדיין.'}</p>
      {character && <ul className="character-list">
        <CharacterCard key={character.id} character={character}
          isSelected={character.id === selectedCharacterId} onSelect={onSelect}
          isFavorite={favoriteIds.includes(character.id)} onToggleFavorite={onToggleFavorite} />
      </ul>}
    </section>
  )
}
