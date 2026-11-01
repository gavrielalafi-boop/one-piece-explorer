/*
 * סרגל הניווט מציג קישורים לרשימה, למועדפים ולהגרלה ואינו מקבל נתונים מרכיב אחר.
 * הוא נעזר בכתובת הנוכחית כדי לסמן את הקישור הפעיל.
 */
import { NavLink } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav className="site-navigation" aria-label="ניווט ראשי">
      <NavLink to="/" end>דמויות</NavLink>
      <NavLink to="/favorites" end>המועדפים שלי</NavLink>
      <NavLink to="/random" end>דמות אקראית</NavLink>
    </nav>
  )
}
