import type { Character } from '../types'

type CharacterDetailsProps = {
  character: Character | undefined
}

const displayValue = (value: string | number | null | undefined) => (
  value === null || value === undefined || String(value).trim() === '' ? 'לא ידוע' : value
)

export default function CharacterDetails({ character }: CharacterDetailsProps) {
  if (!character) {
    return <p>בחרו דמות כדי לראות את פרטיה.</p>
  }

  return (
    <section aria-labelledby="character-details-heading" dir="rtl">
      <h2 id="character-details-heading" dir="auto">{displayValue(character.name)}</h2>
      <dl>
        <dt>צוות</dt><dd dir="auto">{displayValue(character.crew?.name)}</dd>
        <dt>תפקיד</dt><dd dir="auto">{displayValue(character.job)}</dd>
        <dt>גיל</dt><dd dir="auto">{displayValue(character.age)}</dd>
        <dt>גובה</dt><dd dir="auto">{displayValue(character.size)}</dd>
        <dt>פרס</dt><dd dir="auto">{displayValue(character.bounty)}</dd>
        <dt>פרי שטן</dt><dd dir="auto">{displayValue(character.fruit?.name)}</dd>
        <dt>סוג הפרי</dt><dd dir="auto">{displayValue(character.fruit?.type)}</dd>
        <dt>מצב</dt><dd dir="auto">{displayValue(character.status)}</dd>
      </dl>
    </section>
  )
}

