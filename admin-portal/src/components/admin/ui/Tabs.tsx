import { cn } from '../../../lib/utils'

interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number
}

interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  variant?: 'underline' | 'pill'
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, variant = 'underline', className }: TabsProps) {
  if (variant === 'pill') {
    return (
      <div className={cn('flex gap-1 p-1 bg-[#F5F5F5] rounded-lg', className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-white text-[#1F1F1F] shadow-sm'
                : 'text-[#6A6A6A] hover:text-[#1F1F1F]',
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded-full',
                activeTab === tab.id ? 'bg-[#FA520F] text-white' : 'bg-[#E5E5E5] text-[#6A6A6A]',
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex border-b border-[#E5E5E5]', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
            activeTab === tab.id
              ? 'border-[#FA520F] text-[#FA520F]'
              : 'border-transparent text-[#6A6A6A] hover:text-[#1F1F1F]',
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded-full',
              activeTab === tab.id ? 'bg-[#FFF0E8] text-[#FA520F]' : 'bg-[#F5F5F5] text-[#6A6A6A]',
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

