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

// ── STORAGE UPLOAD ─────────────────────────────────────────

export async function uploadToCloudinary(
  file: File,
  folder = 'phuctoanit/case-studies',
): Promise<{ url: string | null; error: string | null }> {
  try {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://phuctoanit.id.vn'

    // 1. Lấy chữ ký SHA-1 từ Serverless Function (/api/sign-cloudinary)
    let signRes = await fetch('/api/sign-cloudinary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder }),
    }).catch(() => null)

    // Nếu gọi relative thất bại (khi chạy local dev hoặc subdomain), gọi qua domain chính
    if (!signRes || !signRes.ok) {
      signRes = await fetch(`${siteUrl}/api/sign-cloudinary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
      }).catch(() => null)
    }

    if (!signRes || !signRes.ok) {
      const errJson = signRes ? await signRes.json().catch(() => ({})) : {}
      throw new Error(errJson.error || 'Không thể tạo chữ ký xác thực Cloudinary. Vui lòng kiểm tra biến môi trường trên Vercel.')
    }

    const { signature, timestamp, apiKey, cloudName, folder: targetFolder } = await signRes.json()

    // 2. Gửi file ảnh + chữ ký thẳng lên Cloudinary CDN
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', apiKey)
    formData.append('timestamp', String(timestamp))
    formData.append('signature', signature)
    formData.append('folder', targetFolder)

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!uploadRes.ok) {
      const uploadErr = await uploadRes.json().catch(() => ({}))
      throw new Error(uploadErr?.error?.message || 'Lỗi khi upload lên Cloudinary')
    }

    const uploadData = await uploadRes.json()

    // Tự động tối ưu dung lượng WebP/AVIF bằng f_auto,q_auto
    let secureUrl = uploadData.secure_url as string
    if (secureUrl && secureUrl.includes('/upload/')) {
      secureUrl = secureUrl.replace('/upload/', '/upload/f_auto,q_auto/')
    }

    return { url: secureUrl, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi upload ảnh lên Cloudinary'
    return { url: null, error: message }
  }
}

export async function uploadMedia(file: File, folder = 'case-studies'): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      return { url: null, error: error.message }
    }

    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(data.path)

    return { url: urlData.publicUrl, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi tải ảnh'
    return { url: null, error: message }
  }
}
