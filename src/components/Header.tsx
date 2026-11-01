/*
 * כותרת האתר מציגה תמונות מקומיות ואת שם האפליקציה ואינה מקבלת נתונים מרכיב אחר.
 * תמונת הרקע דקורטיבית ולכן התיאור החלופי שלה ריק; לסמל יש תיאור שמזהה אותו.
 */
import onePieceLogo from '../assets/one-piece-logo.png'
import heroBackground from '../assets/hero-background.webp'

export default function Header() {
  return (
    <header className="hero">
      <div className="hero-frame">
        <img className="hero-background" src={heroBackground} alt="" width="4640" height="928" />
        <div className="hero-content">
          <img className="hero-logo" src={onePieceLogo} alt="One Piece" width="800" height="292" />
          <h1 lang="en" dir="ltr">One Piece Explorer</h1>
        </div>
      </div>
    </header>
  )
}
