/*
 * הרכיב מקבל כתובת תמונה ושם לצורך תיאור חלופי, וטוען את התמונה לפי הצורך.
 * מצב כשל מקומי מאפשר להציג הודעה גם כשהכתובת קיימת אך טעינת התמונה נכשלת.
 */
import { useState } from 'react'

type CharacterImageProps = { imageUrl: string | null; name: string }

export default function CharacterImage({ imageUrl, name }: CharacterImageProps) {
  const [failed, setFailed] = useState(false)
  if (!imageUrl || failed) return <span>תמונה לא זמינה</span>
  return <img className="character-image" src={imageUrl} alt={name} loading="lazy" onError={() => setFailed(true)} />
}
