import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onChange: (page: number) => void
  className?: string
}

export function Pagination({ page, pageSize, total, onChange, className }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className={cn('flex items-center justify-between gap-4 text-sm', className)}>
      <span className="text-[#6A6A6A]">
        Hiển thị {from}–{to} / {total} kết quả
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg border border-[#E5E5E5] text-[#6A6A6A] disabled:opacity-40 hover:bg-[#F5F5F5] transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | '...')[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
            acc.push(p)
            return acc
          }, [])
          .map((p, i) =>
            p === '...' ? (
              <span key={`dots-${i}`} className="px-2 text-[#A8A8A8]">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onChange(p as number)}
                className={cn(
                  'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                  p === page
                    ? 'bg-[#FA520F] text-white'
                    : 'text-[#4A4A4A] hover:bg-[#F5F5F5]',
                )}
              >
                {p}
              </button>
            ),
          )}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg border border-[#E5E5E5] text-[#6A6A6A] disabled:opacity-40 hover:bg-[#F5F5F5] transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

