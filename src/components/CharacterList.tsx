import type { Character } from '../types'

type CharacterListProps = {
  characters: Character[]
  selectedCharacterId: number | null
  onSelect: (id: number) => void
}

import CharacterCard from './CharacterCard'

export default function CharacterList({ characters, selectedCharacterId, onSelect }: CharacterListProps) {
  return (
    <ul>
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          isSelected={character.id === selectedCharacterId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  )
}

