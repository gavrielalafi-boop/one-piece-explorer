/*
 * הרכיב מקבל את מספר התוצאות, העמוד הנוכחי ופעולה למעבר עמוד. הוא יוצר כפתורי
 * טווחים של עד עשרים וחמש דמויות; הסינון וחיתוך הרשימה מתבצעים ברכיב המרכזי.
 */
import { getPageCount } from '../utils/characterCollection'

type PaginationProps = {
  count: number
  page: number
  onPageChange: (page: number) => void
}

export default function Pagination({ count, page, onPageChange }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="עמודי דמויות">
      {Array.from({ length: getPageCount(count) }, (_, index) => {
        const number = index + 1
        return <button type="button" key={number} dir="ltr" aria-current={page === number ? 'page' : undefined}
          onClick={() => onPageChange(number)}><span dir="ltr">{index * 25 + 1}</span> עד <span dir="ltr">{Math.min(number * 25, count)}</span></button>
      })}
    </nav>
  )
}
