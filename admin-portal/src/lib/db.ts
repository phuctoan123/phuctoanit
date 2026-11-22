/**
 * Database query functions — thay thế mock data bằng Supabase queries thật.
 * Mỗi function trả về { data, error } giống Supabase pattern.
 */
import { supabase } from './supabase'
import type { Lead, LeadActivity, FollowUp, LeadStatus } from '../types/admin'

// ── TYPES ──────────────────────────────────────────────────

type DbResult<T> = { data: T | null; error: string | null }

// FollowUp từ DB có thêm bảng leads joined
type FollowUpWithLead = FollowUp & { leads?: Lead }

// ── LEADS ──────────────────────────────────────────────────

export async function getLeads(): Promise<DbResult<Lead[]>> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data as Lead[], error: null }
}

export async function getLead(id: string): Promise<DbResult<Lead>> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as Lead, error: null }
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<DbResult<Lead>> {
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as Lead, error: null }
}

export async function updateLead(
  id: string,
  updates: Partial<Pick<Lead, 'status' | 'internal_notes' | 'poc_url'>>,
): Promise<DbResult<Lead>> {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as Lead, error: null }
}

// ── LEAD ACTIVITIES ────────────────────────────────────────

export async function getLeadActivities(leadId: string): Promise<DbResult<LeadActivity[]>> {
  const { data, error } = await supabase
    .from('lead_activities')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data as LeadActivity[], error: null }
}

export async function addLeadNote(
  leadId: string,
  content: string,
): Promise<DbResult<LeadActivity>> {
  const { data, error } = await supabase
    .from('lead_activities')
    .insert({ lead_id: leadId, type: 'note_added', content })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as LeadActivity, error: null }
}

export async function addStatusChangeActivity(
  leadId: string,
  fromStatus: LeadStatus,
  toStatus: LeadStatus,
  fromLabel: string,
  toLabel: string,
): Promise<DbResult<LeadActivity>> {
  const content = `Chuyển trạng thái: ${fromLabel} → ${toLabel}`
  const { data, error } = await supabase
    .from('lead_activities')
    .insert({
      lead_id: leadId,
      type: 'status_changed',
      content,
      metadata: { from: fromStatus, to: toStatus },
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as LeadActivity, error: null }
}

// ── FOLLOW UPS ────────────────────────────────────────────

export async function getFollowUps(): Promise<DbResult<FollowUp[]>> {
  const { data, error } = await supabase
    .from('follow_ups')
    .select(`
      *,
      leads (
        id, name, company, phone, email, status
      )
    `)
    .order('scheduled_at', { ascending: true })

  if (error) return { data: null, error: error.message }

  // Normalize: map leads -> lead
  const normalized = (data as FollowUpWithLead[]).map((f) => ({
    ...f,
    lead: f.leads as Lead | undefined,
    leads: undefined,
  }))

  return { data: normalized as FollowUp[], error: null }
}

export async function getLeadFollowUps(leadId: string): Promise<DbResult<FollowUp[]>> {
  const { data, error } = await supabase
    .from('follow_ups')
    .select('*')
    .eq('lead_id', leadId)
    .order('scheduled_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data as FollowUp[], error: null }
}

export async function createFollowUp(payload: {
  lead_id: string
  scheduled_at: string
  content: string
}): Promise<DbResult<FollowUp>> {
  const { data, error } = await supabase
    .from('follow_ups')
    .insert(payload)
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  // Also log activity
  await supabase.from('lead_activities').insert({
    lead_id: payload.lead_id,
    type: 'follow_up_created',
    content: `Tạo lịch follow-up: ${new Date(payload.scheduled_at).toLocaleString('vi-VN')} — ${payload.content}`,
  })

  return { data: data as FollowUp, error: null }
}

export async function completeFollowUp(id: string): Promise<DbResult<FollowUp>> {
  const { data, error } = await supabase
    .from('follow_ups')
    .update({ status: 'done', completed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  // Log activity
  const fu = data as FollowUp
  await supabase.from('lead_activities').insert({
    lead_id: fu.lead_id,
    type: 'follow_up_completed',
    content: `Hoàn thành follow-up: ${fu.content}`,
  })

  return { data: fu, error: null }
}

// ── DASHBOARD STATS ────────────────────────────────────────

export async function getDashboardStats(): Promise<DbResult<{
  total: number
  new: number
  active: number
  won: number
}>> {
  const { data, error } = await supabase
    .from('leads')
    .select('status')

  if (error) return { data: null, error: error.message }

  const leads = data as { status: LeadStatus }[]
  return {
    data: {
      total: leads.length,
      new: leads.filter((l) => l.status === 'new').length,
      active: leads.filter((l) =>
        ['contacted', 'poc_in_progress', 'proposal_sent'].includes(l.status),
      ).length,
      won: leads.filter((l) => l.status === 'closed_won').length,
    },
    error: null,
  }
}
