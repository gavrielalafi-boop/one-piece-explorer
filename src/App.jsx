import CharacterList from './components/CharacterList.jsx'
import characters from './data/characters.sample.json'

export default function App() {
  const [selectedCharacterId, setSelectedCharacterId] = useState(null)
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
import { useState } from 'react'
import CharacterDetails from './components/CharacterDetails.jsx'
