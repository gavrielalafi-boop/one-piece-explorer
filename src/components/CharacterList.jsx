import CharacterCard from './CharacterCard.jsx'

export default function CharacterList({ characters }) {
  return (
    <ul>
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </ul>
  )
}
