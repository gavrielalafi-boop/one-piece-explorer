import onePieceLogo from '../assets/one-piece-logo.png'

export default function Header() {
  return (
    <header className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow" lang="en" dir="ltr">SET SAIL · EXPLORE THE GRAND LINE</p>
        <img className="hero-logo" src={onePieceLogo} alt="One Piece" width="800" height="292" />
        <h1 lang="en" dir="ltr">One Piece Explorer</h1>
        <p>גלו אוסף נבחר של עד 150 דמויות מעולם One Piece.</p>
      </div>
    </header>
  )
}
