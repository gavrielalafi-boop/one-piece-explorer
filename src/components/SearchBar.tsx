type SearchBarProps = {
  value: string
  onSearchChange: (value: string) => void
}

export default function SearchBar({ value, onSearchChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="character-search">חיפוש לפי שם באנגלית</label>
      <p id="search-scope">החיפוש מוגבל לדמויות שנטענו באוסף של עד 25 דמויות.</p>
      <div className="search-controls">
        <input
          id="character-search"
          type="search"
          dir="ltr"
          value={value}
          aria-describedby="search-scope"
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <button type="button" onClick={() => onSearchChange('')} disabled={!value}>ניקוי חיפוש</button>
      </div>
    </div>
  )
}
