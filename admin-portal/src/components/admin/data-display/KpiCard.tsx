import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { KpiData } from '../../../types/admin'

interface KpiCardProps extends KpiData {
  icon?: React.ReactNode
  className?: string
  highlight?: boolean
}

export function KpiCard({ label, value, description, trend, trendValue, icon, className, highlight }: KpiCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[#EDEDED] p-5 flex flex-col gap-3',
        highlight && 'border-[#FA520F]/20 bg-[#FFFAEB]',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-[#6A6A6A] uppercase tracking-wide">{label}</span>
        {icon && (
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            highlight ? 'bg-[#FA520F]/10 text-[#FA520F]' : 'bg-[#F5F5F5] text-[#6A6A6A]',
          )}>
            {icon}
          </div>
        )}
      </div>
      <div>
        <span className="text-2xl font-bold text-[#1F1F1F]">{value}</span>
        {description && <p className="text-xs text-[#6A6A6A] mt-0.5">{description}</p>}
      </div>
      {trend && trendValue && (
        <div className={cn(
          'flex items-center gap-1 text-xs font-medium',
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-[#6A6A6A]',
        )}>
          {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />}
          {trendValue}
        </div>
      )}
    </div>
  )
}

