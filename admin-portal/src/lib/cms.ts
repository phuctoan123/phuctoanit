/**
 * CMS + Settings query functions — kết nối Supabase thật
 */
import { supabase } from './supabase'
import type { CaseStudy } from '../types/admin'

// ── SITE SETTINGS ──────────────────────────────────────────

export interface SiteSettings {
  id: number
  hotline: string | null
  email: string | null
  address_vi: string | null
  address_en: string | null
  partner_website: string | null
  social_links: Record<string, string>
  seo: {
    meta_title_vi?: string
    meta_title_en?: string
    meta_desc_vi?: string
    meta_desc_en?: string
    og_image_url?: string
  }
  updated_at: string
}

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) return { data: null, error: error.message }
  return { data: data as SiteSettings, error: null }
}

export async function upsertSiteSettings(updates: Partial<Omit<SiteSettings, 'id' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, ...updates })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: data as SiteSettings, error: null }
}

// ── SITE ABOUT / HERO ──────────────────────────────────────

export interface SiteAbout {
  id: number
  hero_title_vi: string | null
  hero_title_en: string | null
  hero_tagline_vi: string | null
  hero_tagline_en: string | null
  about_desc_vi: string | null
  about_desc_en: string | null
  work_philosophy_vi: string | null
  work_philosophy_en: string | null
  strengths: unknown[]
  avatar_url: string | null
  updated_at: string
}

export async function getSiteAbout() {
  const { data, error } = await supabase
    .from('site_about')
    .select('*')
    .eq('id', 1)
    .single()
  if (error && error.code === 'PGRST116') {
    return { data: null, error: null }
  }
  if (error) return { data: null, error: error.message }
  return { data: data as SiteAbout, error: null }
}

export async function upsertSiteAbout(updates: Partial<Omit<SiteAbout, 'id' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('site_about')
    .upsert({ id: 1, ...updates })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: data as SiteAbout, error: null }
}

// ── CASE STUDIES ───────────────────────────────────────────

export async function getCaseStudies() {
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) return { data: null, error: error.message }
  return { data: data as CaseStudy[], error: null }
}

export async function upsertCaseStudy(study: Partial<CaseStudy>) {
  const { data, error } = await supabase
    .from('case_studies')
    .upsert(study)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: data as CaseStudy, error: null }
}

export async function deleteCaseStudy(id: string) {
  const { error } = await supabase
    .from('case_studies')
    .delete()
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true, error: null }
}
