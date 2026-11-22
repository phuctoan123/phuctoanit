import { useState, useEffect, useCallback } from 'react'
import {
  getSiteSettings, upsertSiteSettings, type SiteSettings,
  getSiteAbout, upsertSiteAbout, type SiteAbout,
} from '../lib/cms'

// ── useSettings ───────────────────────────────────────────
export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await getSiteSettings()
    if (error) setError(error)
    else setSettings(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const save = useCallback(async (updates: Partial<Omit<SiteSettings, 'id' | 'updated_at'>>) => {
    setSaving(true)
    const { data, error } = await upsertSiteSettings(updates)
    setSaving(false)
    if (error) return { success: false, error }
    setSettings(data)
    return { success: true, error: null }
  }, [])

  return { settings, loading, saving, error, save, refetch: fetch }
}

// ── useSiteAbout ──────────────────────────────────────────
export function useSiteAbout() {
  const [about, setAbout] = useState<SiteAbout | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await getSiteAbout()
    if (error) setError(error)
    else setAbout(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const save = useCallback(async (updates: Partial<Omit<SiteAbout, 'id' | 'updated_at'>>) => {
    setSaving(true)
    const { data, error } = await upsertSiteAbout(updates)
    setSaving(false)
    if (error) return { success: false, error }
    setAbout(data)
    return { success: true, error: null }
  }, [])

  return { about, loading, saving, error, save, refetch: fetch }
}
