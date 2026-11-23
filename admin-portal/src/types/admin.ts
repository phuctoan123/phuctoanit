export type LeadStatus = 'new' | 'contacted' | 'poc_in_progress' | 'proposal_sent' | 'closed_won' | 'archived'

export interface Lead {
  id: string
  created_at: string
  updated_at: string
  services: string[]
  other_industry?: string
  name: string
  company?: string
  phone: string
  email: string
  message: string
  status: LeadStatus
  internal_notes?: string
  poc_url?: string
  source: string
  notified_at?: string
}

export interface LeadActivity {
  id: string
  lead_id: string
  type: 'created' | 'status_changed' | 'note_added' | 'follow_up_created' | 'follow_up_completed' | 'info_updated'
  content: string
  created_at: string
  metadata?: Record<string, unknown>
}

export interface FollowUp {
  id: string
  lead_id: string
  lead?: Lead
  scheduled_at: string
  content: string
  status: 'pending' | 'done' | 'cancelled'
  created_at: string
}

export interface KpiData {
  label: string
  value: number | string
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

export interface NavItem {
  label: string
  href: string
  icon: string
  group?: string
}

export interface NavGroup {
  group: string
  items: NavItem[]
}

export interface ToastData {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

export interface CaseStudy {
  id: string
  title_vi?: string | null
  title_en?: string | null
  industry_vi: string
  industry_en: string
  image_url?: string | null
  problem_vi?: string | null
  problem_en?: string | null
  solution_vi?: string | null
  solution_en?: string | null
  result_vi?: string | null
  result_en?: string | null
  demo_url?: string | null
  sort_order: number
  is_active: boolean
}

export interface Post {
  id: string
  slug: string
  title_vi: string
  title_en?: string | null
  excerpt_vi: string
  excerpt_en?: string | null
  category: 'tu-van-giai-phap' | 'ha-tang-bao-mat' | 'case-study' | 'chuyen-doi-so'
  thumbnail: string
  thumbnail_alt?: string | null
  read_time_vi?: string | null
  read_time_en?: string | null
  published_at: string
  key_takeaways_vi?: string[] | null
  key_takeaways_en?: string[] | null
  content_vi: string
  content_en?: string | null
  related_service: string
  author_name?: string | null
  author_role_vi?: string | null
  author_role_en?: string | null
  author_avatar?: string | null
  is_featured?: boolean
  featured?: boolean
  status: 'draft' | 'published' | 'archived'
  views_count?: number
  created_at?: string
  updated_at?: string
}
