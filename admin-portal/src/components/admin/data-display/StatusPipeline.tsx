import { Check } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { LEAD_STATUS_CONFIG, LEAD_STATUS_PIPELINE } from '../../../constants/admin'
import type { LeadStatus } from '../../../types/admin'

interface StatusPipelineProps {
  currentStatus: LeadStatus
  onStatusChange?: (status: LeadStatus) => void
  readonly?: boolean
}

export function StatusPipeline({ currentStatus, onStatusChange, readonly }: StatusPipelineProps) {
  const currentIdx = LEAD_STATUS_PIPELINE.indexOf(currentStatus)

  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {LEAD_STATUS_PIPELINE.map((status, idx) => {
        const isCompleted = idx < currentIdx
        const isCurrent = idx === currentIdx
        const config = LEAD_STATUS_CONFIG[status]

        return (
          <div key={status} className="flex items-center">
            <button
              onClick={() => !readonly && onStatusChange?.(status)}
              disabled={readonly}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-xs',
                !readonly && 'hover:bg-[#F5F5F5] cursor-pointer',
                readonly && 'cursor-default',
              )}
            >
              <div className={cn(
                'w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors',
                isCompleted && 'bg-green-500 border-green-500 text-white',
                isCurrent && 'bg-[#FA520F] border-[#FA520F] text-white',
                !isCompleted && !isCurrent && 'bg-white border-[#C7C7C7] text-[#A8A8A8]',
              )}>
                {isCompleted ? <Check size={12} /> : (
                  <span className="text-[10px] font-bold">{idx + 1}</span>
                )}
              </div>
              <span className={cn(
                'font-medium whitespace-nowrap',
                isCurrent ? 'text-[#FA520F]' : isCompleted ? 'text-green-600' : 'text-[#A8A8A8]',
              )}>
                {config.label}
              </span>
            </button>
            {idx < LEAD_STATUS_PIPELINE.length - 1 && (
              <div className={cn(
                'h-px w-6 flex-shrink-0',
                idx < currentIdx ? 'bg-green-400' : 'bg-[#E5E5E5]',
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

