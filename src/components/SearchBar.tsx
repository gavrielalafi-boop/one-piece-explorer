type SearchBarProps = {
  value: string
  onSearchChange: (value: string) => void
  favoritesOnly: boolean
  onFavoritesOnlyChange: (value: boolean) => void
}

export default function SearchBar({ value, onSearchChange, favoritesOnly, onFavoritesOnlyChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="character-search">חיפוש לפי שם באנגלית</label>
      <div className="search-controls">
        <input
          id="character-search"
          type="search"
          dir="ltr"
          value={value}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <button type="button" onClick={() => onSearchChange('')} disabled={!value}>ניקוי חיפוש</button>
      </div>
      <label className="favorites-filter">
        <input type="checkbox" checked={favoritesOnly} onChange={(event) => onFavoritesOnlyChange(event.target.checked)} />
        מועדפים בלבד
      </label>
    </div>
  )
}
