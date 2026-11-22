import type { LeadStatus } from '../types/admin'

export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  new: {
    label: 'Mới',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  contacted: {
    label: 'Đã liên hệ',
    className: 'bg-purple-50 text-purple-700 border border-purple-200',
  },
  poc_in_progress: {
    label: 'Đang POC',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  proposal_sent: {
    label: 'Đã gửi Proposal',
    className: 'bg-sky-50 text-sky-700 border border-sky-200',
  },
  closed_won: {
    label: 'Đã chốt ✓',
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
  archived: {
    label: 'Lưu trữ',
    className: 'bg-gray-100 text-gray-500 border border-gray-200',
  },
}

export const LEAD_STATUS_PIPELINE: LeadStatus[] = [
  'new',
  'contacted',
  'poc_in_progress',
  'proposal_sent',
  'closed_won',
]

export const LEAD_SERVICES = [
  'Thiết kế Website',
  'Web Hosting & Deployment',
  'Giải pháp ERP / CRM',
  'Phần mềm quản lý / Khác',
  'Tư vấn kỹ thuật',
  'Sales Engineering',
  'Demo & POC',
]

export const LEAD_SOURCES = [
  'Website Form',
  'Nhập thủ công',
  'Giới thiệu',
  'Khác',
]

export const NAV_GROUPS = [
  {
    group: 'WORKSPACE',
    items: [
      { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
      { label: 'Khách hàng tiềm năng', href: '/admin/leads', icon: 'Users' },
      { label: 'Lịch Follow-up', href: '/admin/follow-ups', icon: 'CalendarCheck' },
    ],
  },
  {
    group: 'WEBSITE',
    items: [
      { label: 'Nội dung website', href: '/admin/content', icon: 'FileText' },
      { label: 'Cài đặt website', href: '/admin/settings', icon: 'Settings' },
    ],
  },
  {
    group: 'HỆ THỐNG',
    items: [
      { label: 'Tài khoản', href: '/admin/account', icon: 'UserCircle' },
    ],
  },
]

export const CONTENT_NAV = [
  { label: 'Hero / Banner', href: '/admin/content/hero', icon: 'Monitor' },
  { label: 'Giới thiệu', href: '/admin/content/about', icon: 'User' },
  { label: 'Năng lực', href: '/admin/content/skills', icon: 'Zap' },
  { label: 'Dịch vụ', href: '/admin/content/services', icon: 'Briefcase' },
  { label: 'Case Studies', href: '/admin/content/case-studies', icon: 'FolderOpen' },
  { label: 'Đánh giá', href: '/admin/content/testimonials', icon: 'MessageSquare' },
  { label: 'Gói hợp tác', href: '/admin/content/pricing', icon: 'Tag' },
]

export const SETTINGS_TABS = [
  { id: 'general', label: 'Thông tin chung' },
  { id: 'social', label: 'Mạng xã hội' },
  { id: 'seo', label: 'SEO' },
  { id: 'notifications', label: 'Thông báo' },
]
