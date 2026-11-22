import { Menu, ChevronRight, LogOut, UserCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'

interface AdminHeaderProps {
  onMobileMenuToggle: () => void
}

const breadcrumbMap: Record<string, string> = {
  admin: 'Admin',
  leads: 'Khách hàng tiềm năng',
  'follow-ups': 'Lịch Follow-up',
  content: 'Nội dung website',
  settings: 'Cài đặt website',
  account: 'Tài khoản',
  hero: 'Hero / Banner',
  about: 'Giới thiệu',
  skills: 'Năng lực',
  services: 'Dịch vụ',
  'case-studies': 'Case Studies',
  testimonials: 'Đánh giá',
  pricing: 'Gói hợp tác',
  general: 'Thông tin chung',
  social: 'Mạng xã hội',
  seo: 'SEO',
  notifications: 'Thông báo',
}

export function AdminHeader({ onMobileMenuToggle }: AdminHeaderProps) {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const segments = location.pathname.split('/').filter(Boolean)
  const crumbs = segments.map((seg, idx) => ({
    label: breadcrumbMap[seg] || seg,
    href: '/' + segments.slice(0, idx + 1).join('/'),
    isLast: idx === segments.length - 1,
  }))

  return (
    <header className="h-16 bg-white border-b border-[#EDEDED] flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10">
      {/* Mobile menu */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-[#F5F5F5] text-[#6A6A6A]"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <nav className="flex-1 flex items-center gap-1 text-sm min-w-0">
        {crumbs.map((crumb, idx) => (
          <div key={crumb.href} className="flex items-center gap-1 min-w-0">
            {idx > 0 && <ChevronRight size={14} className="text-[#A8A8A8] flex-shrink-0" />}
            {crumb.isLast ? (
              <span className="font-medium text-[#1F1F1F] truncate">{crumb.label}</span>
            ) : (
              <Link to={crumb.href} className="text-[#6A6A6A] hover:text-[#FA520F] transition-colors truncate">
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Account menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[#FA520F] flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <span className="text-sm text-[#1F1F1F] hidden sm:block max-w-[140px] truncate">
            {user?.email || 'Admin'}
          </span>
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div
              className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-[#EDEDED] shadow-lg z-20 py-1"
              style={{ boxShadow: 'rgba(0,0,0,0.08) 0px 8px 24px -4px' }}
            >
              <div className="px-3 py-2 border-b border-[#EDEDED] mb-1">
                <div className="text-xs font-medium text-[#1F1F1F] truncate">{user?.email}</div>
                <div className="text-xs text-[#6A6A6A]">Quản trị viên</div>
              </div>
              <Link
                to="/admin/account"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#4A4A4A] hover:bg-[#F5F5F5] transition-colors"
              >
                <UserCircle size={15} />
                Tài khoản
              </Link>
              <button
                onClick={() => { setDropdownOpen(false); signOut() }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                Đăng xuất
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

