import type { Character } from '../types'

type CharacterListProps = {
  characters: Character[]
  selectedCharacterId: number | null
  onSelect: (id: number) => void
  favoriteIds: number[]
  onToggleFavorite: (id: number) => void
}

import CharacterCard from './CharacterCard'

export default function CharacterList({ characters, selectedCharacterId, onSelect, favoriteIds, onToggleFavorite }: CharacterListProps) {
  return (
    <ul className="character-list">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          isSelected={character.id === selectedCharacterId}
          onSelect={onSelect}
          isFavorite={favoriteIds.includes(character.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ul>
  )
}

