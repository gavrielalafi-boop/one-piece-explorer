import CharacterImage from './CharacterImage'
import { cleanCharacterDescription, createCharacterExcerpt, extractCharacterFacts } from '../utils/characterDescription'
import type { Character } from '../types'

type CharacterCardProps = {
  character: Character
  isSelected: boolean
  onSelect: (id: number) => void
}

export default function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  const description = cleanCharacterDescription(character.description)
  const excerpt = createCharacterExcerpt(description)
  const facts = extractCharacterFacts(description)
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
          {facts.length > 0 ? facts.map(({ label, value }) => (
            <span className="character-card-fact" key={label}>{label}: {value}</span>
          )) : excerpt ? <span>{excerpt}</span> : <span lang="he" dir="rtl">תיאור לא זמין</span>}
        </span>
      </button>
    </li>
  )
}


