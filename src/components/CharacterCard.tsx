import CharacterImage from './CharacterImage'
import type { Character } from '../types'

type CharacterCardProps = {
  character: Character
  isSelected: boolean
  onSelect: (id: number) => void
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

export default function CharacterCard({ character, isSelected, onSelect, isFavorite, onToggleFavorite }: CharacterCardProps) {
  return (
    <li>
      <button
        type="button"
        className={isSelected ? 'character-card selected' : 'character-card'}
        aria-pressed={isSelected}
        onClick={() => onSelect(character.id)}
      >
        <span className="character-card-image">
          <CharacterImage key={character.imageUrl} imageUrl={character.imageUrl} name={character.name} />
        </span>
        <span className="character-card-text" lang="en" dir="ltr">
          <span className="character-card-title">{character.name}</span>
        </span>
      </button>
      <button
        type="button"
        className="favorite-button"
        aria-pressed={isFavorite}
        aria-label={`${isFavorite ? 'הסרה ממועדפים' : 'הוספה למועדפים'}: ${character.name}`}
        onClick={() => onToggleFavorite(character.id)}
      >
        {isFavorite ? 'הסרה ממועדפים' : 'הוספה למועדפים'}
      </button>
    </li>
  )
}


