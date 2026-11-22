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
