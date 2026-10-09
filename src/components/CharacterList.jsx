import CharacterCard from './CharacterCard.jsx'

export default function CharacterList({ characters, selectedCharacterId, onSelect }) {
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
