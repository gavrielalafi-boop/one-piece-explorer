import CharacterList from './components/CharacterList.jsx'
import characters from './data/characters.sample.json'

export default function App() {
  return (
    <main className="app">
      <h1>One Piece Explorer</h1>
      <h2>דמויות</h2>
      <CharacterList characters={characters} />
    </main>
  )
}
