import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null

  const { current_page, last_page, from, to, total } = meta

  const pages = Array.from({ length: last_page }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
      <p className="text-muted text-xs">
        Menampilkan <span className="text-white">{from}–{to}</span> dari <span className="text-white">{total}</span> data
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="page-btn disabled:opacity-30"
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`page-btn ${current_page === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="page-btn disabled:opacity-30"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
