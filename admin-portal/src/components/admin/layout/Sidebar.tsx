import {
  LayoutDashboard, Users, CalendarCheck, FileText, Settings, UserCircle,
  ChevronLeft, ChevronRight, ExternalLink, BookOpen,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../../lib/utils'
import { NAV_GROUPS } from '../../../constants/admin'
import { useAuth } from '../../../hooks/useAuth'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  BookOpen,
  Settings,
  UserCircle,
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-white border-r border-[#EDEDED] h-screen sticky top-0 transition-all duration-200 z-20',
        collapsed ? 'w-[72px]' : 'w-[240px]',
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center border-b border-[#EDEDED] h-16 px-4 flex-shrink-0',
        collapsed ? 'justify-center' : 'gap-3',
      )}>
        <div className="w-8 h-8 rounded-lg bg-[#FA520F] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">PT</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#1F1F1F] truncate">PhucToan IT</div>
            <div className="text-xs text-[#6A6A6A]">Admin Portal</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="mb-4">
            {!collapsed && (
              <div className="text-[10px] font-semibold text-[#A8A8A8] uppercase tracking-wider px-2 mb-1">
                {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = iconMap[item.icon]
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5',
                    'relative',
                    active
                      ? 'bg-[#FFF0E8] text-[#FA520F]'
                      : 'text-[#4A4A4A] hover:bg-[#F5F5F5] hover:text-[#1F1F1F]',
                    collapsed && 'justify-center',
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1 bottom-1 w-1 bg-[#FA520F] rounded-r-full" />
                  )}
                  {Icon && <Icon size={18} />}
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: website link + user info */}
      <div className="border-t border-[#EDEDED] p-3 space-y-2 flex-shrink-0">
        <a
          href="https://phuctoanit.id.vn"
          target="_blank"
          rel="noreferrer"
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 text-xs text-[#6A6A6A] hover:text-[#FA520F] rounded-lg hover:bg-[#F5F5F5] transition-colors',
            collapsed && 'justify-center',
          )}
          title="Xem website public"
        >
          <ExternalLink size={14} />
          {!collapsed && 'Xem website'}
        </a>
        {!collapsed && user && (
          <div className="px-2 py-1.5 text-xs text-[#6A6A6A] truncate">
            {user.email}
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-[#EDEDED] shadow-sm flex items-center justify-center hover:bg-[#F5F5F5] transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}

