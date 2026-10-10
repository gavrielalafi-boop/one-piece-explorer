import CharacterImage from './CharacterImage'
import { cleanCharacterDescription } from '../utils/characterDescription'
import type { Character } from '../types'

type CharacterDetailsProps = { character: Character | undefined }

export default function CharacterDetails({ character }: CharacterDetailsProps) {
  if (!character) return <p>בחרו דמות כדי לראות את פרטיה.</p>
  const description = cleanCharacterDescription(character.description)
  return (
    <section aria-labelledby="character-details-heading" dir="rtl">
      <h2 id="character-details-heading" lang="en" dir="ltr">{character.name}</h2>
      <CharacterImage key={character.imageUrl} imageUrl={character.imageUrl} name={character.name} />
      {description
        ? <div lang="en" dir="ltr">{description.split(/\n\s*\n/).map((paragraph, index) => (
          <p className="character-description" key={index}>{paragraph}</p>
        ))}</div>
        : <p>תיאור לא זמין</p>}
    </section>
  )
}
