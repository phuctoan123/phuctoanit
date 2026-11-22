import { X, LayoutDashboard, Users, CalendarCheck, FileText, Settings, UserCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../../lib/utils'
import { NAV_GROUPS } from '../../../constants/admin'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard, Users, CalendarCheck, FileText, Settings, UserCircle,
}

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(href)
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <aside className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 h-16 border-b border-[#EDEDED]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FA520F] flex items-center justify-center">
              <span className="text-white font-bold text-sm">PT</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#1F1F1F]">PhucToan IT</div>
              <div className="text-xs text-[#6A6A6A]">Admin Portal</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F5F5F5] text-[#6A6A6A]">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.group} className="mb-4">
              <div className="text-[10px] font-semibold text-[#A8A8A8] uppercase tracking-wider px-2 mb-1">
                {group.group}
              </div>
              {group.items.map((item) => {
                const Icon = iconMap[item.icon]
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5 relative',
                      active
                        ? 'bg-[#FFF0E8] text-[#FA520F]'
                        : 'text-[#4A4A4A] hover:bg-[#F5F5F5]',
                    )}
                  >
                    {active && <span className="absolute left-0 top-1 bottom-1 w-1 bg-[#FA520F] rounded-r-full" />}
                    {Icon && <Icon size={18} />}
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}

