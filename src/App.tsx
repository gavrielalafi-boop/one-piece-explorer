import { useState } from 'react'
import CharacterDetails from './components/CharacterDetails'
import CharacterList from './components/CharacterList'
import characters from './data/characters.sample.json'

export default function App() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)
  const selectedCharacter = characters.find((character) => character.id === selectedCharacterId)

  return (
    <main className="app">
      <h1>One Piece Explorer</h1>
      <h2>דמויות</h2>
      <CharacterList
        characters={characters}
        selectedCharacterId={selectedCharacterId}
        onSelect={setSelectedCharacterId}
      />
      <CharacterDetails character={selectedCharacter} />
    </main>
  )
}

