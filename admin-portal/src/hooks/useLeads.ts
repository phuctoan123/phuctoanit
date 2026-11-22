/**
 * React hooks cho Leads — dùng Supabase query thật
 */
import { useState, useEffect, useCallback } from 'react'
import type { Lead, LeadActivity, FollowUp, LeadStatus } from '../types/admin'
import {
  getLeads,
  getLead,
  getLeadActivities,
  getLeadFollowUps,
  getFollowUps,
  updateLeadStatus,
  addLeadNote,
  addStatusChangeActivity,
  completeFollowUp,
  createFollowUp,
} from '../lib/db'
import { LEAD_STATUS_CONFIG } from '../constants/admin'

// ── useLeads: danh sách tất cả leads ──────────────────────
export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await getLeads()
    if (error) setError(error)
    else setLeads(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { leads, loading, error, refetch: fetch }
}

// ── useLeadDetail: chi tiết 1 lead + activities + follow-ups ──
export function useLeadDetail(id: string | undefined) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [activities, setActivities] = useState<LeadActivity[]>([])
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    const [leadRes, actRes, fuRes] = await Promise.all([
      getLead(id),
      getLeadActivities(id),
      getLeadFollowUps(id),
    ])
    if (leadRes.error) {
      setError(leadRes.error)
    } else {
      setLead(leadRes.data)
      setActivities(actRes.data ?? [])
      setFollowUps(fuRes.data ?? [])
    }
    setLoading(false)
  }, [id])

  useEffect(() => { fetchAll() }, [fetchAll])

  const saveNote = useCallback(async (content: string) => {
    if (!id || !content.trim()) return { success: false, error: null }
    setSaving(true)
    const { error } = await addLeadNote(id, content)
    if (!error) await fetchAll()
    setSaving(false)
    return { success: !error, error: error ?? null }
  }, [id, fetchAll])

  const changeStatus = useCallback(async (newStatus: LeadStatus) => {
    if (!id || !lead) return { success: false, error: null }
    const prevStatus = lead.status
    // Optimistic update
    setLead((prev) => prev ? { ...prev, status: newStatus } : prev)
    const [statusRes] = await Promise.all([
      updateLeadStatus(id, newStatus),
      addStatusChangeActivity(
        id,
        prevStatus,
        newStatus,
        LEAD_STATUS_CONFIG[prevStatus].label,
        LEAD_STATUS_CONFIG[newStatus].label,
      ),
    ])
    if (statusRes.error) {
      // Rollback
      setLead((prev) => prev ? { ...prev, status: prevStatus } : prev)
      return { success: false, error: statusRes.error }
    }
    await fetchAll()
    return { success: true, error: null }
  }, [id, lead, fetchAll])

  const addFollowUp = useCallback(async (payload: {
    scheduled_at: string
    content: string
  }) => {
    if (!id) return { success: false, error: null }
    setSaving(true)
    const { error } = await createFollowUp({ lead_id: id, ...payload })
    if (!error) await fetchAll()
    setSaving(false)
    return { success: !error, error: error ?? null }
  }, [id, fetchAll])

  const markFollowUpDone = useCallback(async (followUpId: string) => {
    const { error } = await completeFollowUp(followUpId)
    if (!error) await fetchAll()
    return { success: !error }
  }, [fetchAll])

  return {
    lead, activities, followUps,
    loading, saving, error,
    saveNote, changeStatus, addFollowUp, markFollowUpDone,
    refetch: fetchAll,
  }
}

// ── useFollowUps: tất cả follow-ups ──────────────────────
export function useFollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await getFollowUps()
    if (error) setError(error)
    else setFollowUps(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const markDone = useCallback(async (id: string) => {
    const { error } = await completeFollowUp(id)
    if (!error) {
      setFollowUps((prev) =>
        prev.map((f) => f.id === id ? { ...f, status: 'done' as const } : f),
      )
    }
    return { success: !error }
  }, [])

  return { followUps, loading, error, markDone, refetch: fetch }
}
