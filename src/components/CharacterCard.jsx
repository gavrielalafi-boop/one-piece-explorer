export default function CharacterCard({ character, isSelected, onSelect }) {
  return (
    <li>
      <button
        type="button"
        className={isSelected ? 'character-card selected' : 'character-card'}
        aria-pressed={isSelected}
        onClick={() => onSelect(character.id)}
      >
        <span dir="auto">{character.name}</span>
      </button>
    </li>
  )
}
