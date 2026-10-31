import CharacterList from '../components/CharacterList'
import type { Character } from '../types'

type FavoritesPageProps = {
  characters: Character[]
  favoriteIds: number[]
  status: 'loading' | 'success' | 'error'
  selectedCharacterId: number | null
  onSelect: (id: number) => void
  onToggleFavorite: (id: number) => void
}

export default function FavoritesPage({ characters, favoriteIds, status, selectedCharacterId, onSelect, onToggleFavorite }: FavoritesPageProps) {
  const favorites = characters.filter((character) => favoriteIds.includes(character.id))
  const unavailableCount = favoriteIds.length - favorites.length

  if (favoriteIds.length === 0) return <p role="status">עדיין אין מועדפים. אפשר להוסיף דמויות למועדפים מתוך הרשימה.</p>

  return (
    <section className="character-list-panel" aria-label="דמויות מועדפות">
      <p role="status">מוצגים {favorites.length} מתוך {favoriteIds.length} מועדפים שמורים.</p>
      {unavailableCount > 0 && (status === 'loading'
        ? <p role="status">נתוניהם של {unavailableCount} מהמועדפים עדיין נטענים.</p>
        : status === 'error'
          ? <p role="status">נתוניהם של {unavailableCount} מהמועדפים עדיין אינם זמינים עקב כשל בטעינה. המועדפים שכבר נטענו נשארים זמינים; אפשר לנסות שוב באמצעות כפתור הניסיון הנוסף למעלה.</p>
          : <p role="status">{unavailableCount} מזהי מועדפים לא נמצאו באוסף הנבחר לאחר השלמת הטעינה. המזהים נשמרו במועדפים.</p>)}
      {favorites.length > 0 && <CharacterList
        characters={favorites} selectedCharacterId={selectedCharacterId}
        onSelect={onSelect} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} />}
    </section>
  )
}
