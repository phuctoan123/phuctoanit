/**
 * CMS + Settings query functions — kết nối Supabase thật
 */
import { supabase } from './supabase'
import type { CaseStudy, Post } from '../types/admin'

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

// ── BLOG POSTS ─────────────────────────────────────────────

export const STATIC_SEED_POSTS: Post[] = [
  {
    id: "post-email-deliverability-spf-dkim-dmarc",
    slug: "tai-sao-email-doanh-nghiep-hay-vao-spam-cau-hinh-spf-dkim-dmarc",
    category: "ha-tang-bao-mat",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=675&q=80",
    thumbnail_alt: "Hướng dẫn cấu hình SPF DKIM DMARC cho Mail Server",
    read_time_vi: "6 phút đọc",
    read_time_en: "6 min read",
    published_at: "2026-11-20",
    is_featured: true,
    status: "published",
    related_service: "email-server",
    author_name: "Nguyễn Phúc Toàn",
    author_role_vi: "Sales Engineer & Solution Consultant",
    title_vi: "Tại sao Email công ty hay rơi vào hòm thư Spam? Hướng dẫn cấu hình SPF, DKIM, DMARC chuẩn xác",
    title_en: "Why Corporate Emails Land in Spam: Complete Guide to Configuring SPF, DKIM & DMARC",
    excerpt_vi: "Khách hàng không nhận được báo giá, email marketing bị Google và Microsoft chặn thẳng thừng? Phân tích nguyên nhân kỹ thuật và cách thiết lập bộ ba bản ghi SPF, DKIM, DMARC chuẩn doanh nghiệp.",
    excerpt_en: "Clients missing price quotes, marketing emails blocked outright by Google and Microsoft? Technical root causes and step-by-step setup for SPF, DKIM, and DMARC.",
    key_takeaways_vi: [
      "Từ đầu năm 2024, Google Workspace và Yahoo chính thức từ chối hoặc đẩy vào Spam mọi email gửi từ tên miền thiếu bản ghi SPF/DKIM hợp lệ.",
      "SPF quy định IP được phép gửi thư, DKIM ký số chống sửa đổi nội dung trên đường truyền, DMARC báo cáo và chỉ đạo hành vi cách ly thư giả mạo.",
      "Thiết lập chuẩn xác bộ 3 bản ghi DNS chỉ tốn 30 phút nhưng bảo vệ 98% tỷ lệ thư gửi tới Inbox đối tác và bảo vệ uy tín thương hiệu."
    ],
    key_takeaways_en: [
      "Since early 2024, Google and Yahoo reject or spam-flag emails sent from domains lacking valid SPF/DKIM authentication.",
      "SPF specifies authorized sender IPs, DKIM signs messages cryptographically, and DMARC enforces handling policies for failed checks.",
      "Accurate DNS configuration takes roughly 30 minutes but guarantees up to 98% deliverability straight to client inboxes."
    ],
    content_vi: `<p class="lead">Một trong những sự cố phổ biến nhất mà các doanh nghiệp B2B phản ánh với đội ngũ kỹ thuật của chúng tôi là: <em>"Bên em gửi email báo giá và hợp đồng qua đối tác lớn nhưng toàn bị báo vào hòm Spam / Rác, thậm chí thư bị trả về (Bounced) ngay lập tức."</em></p><h2>1. Vì sao bộ lọc của Google, Microsoft ngày càng khắt khe?</h2><p>Trước làn sóng lừa đảo giả mạo danh tính, Google và Microsoft đã siết chặt chính sách nhận thư kể từ quý 1/2024.</p><h2>2. Bộ ba hộ pháp: SPF, DKIM và DMARC</h2><p>DNS của tên miền bắt buộc phải thiết lập chuẩn xác 3 bản ghi này.</p>`,
    content_en: `<p class="lead">One of the most persistent issues enterprise clients bring to our consulting table is deliverability failure.</p>`
  },
  {
    id: "post-fnb-cost-ordering-web-vs-delivery-apps",
    slug: "bai-toan-chi-phi-fnb-website-dat-mon-rieng-hay-app-giao-hang",
    category: "tu-van-giai-phap",
    thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&h=675&q=80",
    thumbnail_alt: "Mô hình Website đặt món riêng cho ngành F&B",
    read_time_vi: "7 phút đọc",
    read_time_en: "7 min read",
    published_at: "2026-11-18",
    is_featured: true,
    status: "published",
    related_service: "web-development",
    author_name: "Nguyễn Phúc Toàn",
    author_role_vi: "Sales Engineer & Solution Consultant",
    title_vi: "Bài toán chi phí F&B: Tự xây Website đặt món riêng hay phụ thuộc 100% vào App giao hàng?",
    title_en: "F&B Cost Dilemma: Building a Direct Ordering Website vs. Relying 100% on Delivery Apps",
    excerpt_vi: "Chiết khấu 20-30% trên mỗi đơn hàng từ các nền tảng giao đồ ăn đang bào mòn biên lợi nhuận của chuỗi F&B. Khi nào thương hiệu nên đầu tư hệ sinh thái đặt hàng riêng để giữ chân khách hàng trung thành?",
    excerpt_en: "20-30% platform commissions on delivery apps erode restaurant margins. When should F&B brands invest in their own direct ordering web system to retain customer data?",
    key_takeaways_vi: [
      "Ứng dụng giao hàng là phễu đón khách mới hiệu quả, nhưng mức phí hoa hồng 20-28% là khoản thuế quá đắt đỏ đối với các đơn hàng lặp lại từ khách quen.",
      "Xây dựng Website đặt món riêng (Web Ordering & Zalo Mini App) giúp nhà hàng nắm giữ 100% dữ liệu khách hàng (CDP) và chủ động chiến dịch Re-marketing với chi phí 0đ.",
      "Điểm hòa vốn: Khi doanh thu từ tệp khách hàng quen vượt mức 150 triệu/tháng, chi phí vận hành hệ thống riêng chỉ chiếm khoảng 3-5% doanh thu."
    ],
    key_takeaways_en: [
      "Food delivery apps are excellent customer acquisition funnels, but 20-28% commission fees become unsustainable for recurring loyal patrons.",
      "Owning a direct ordering website empowers F&B brands with 100% Customer Data Platform ownership.",
      "The break-even point: Once monthly direct sales exceed $6,000, private platform operations cost only 3-5% of revenue."
    ],
    content_vi: `<p class="lead">Trong hơn 3 năm tư vấn chuyển đổi số cho các chuỗi nhà hàng, bài toán hoa hồng 25% luôn là vấn đề lớn.</p><h2>1. Sự thật về mức phí 20% - 30%</h2><p>Sau khi trả phí bạn không sở hữu thông tin khách hàng.</p>`,
    content_en: `<p class="lead">Balancing delivery apps and direct ordering web platforms.</p>`
  },
  {
    id: "post-poc-7-days-enterprise-solution-validation",
    slug: "quy-trinh-dung-poc-7-ngay-kiem-chung-giai-phap-cong-nghe",
    category: "case-study",
    thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&h=675&q=80",
    thumbnail_alt: "Quy trình triển khai POC công nghệ trong 7 ngày",
    read_time_vi: "8 phút đọc",
    read_time_en: "8 min read",
    published_at: "2026-11-15",
    is_featured: true,
    status: "published",
    related_service: "consulting-demo",
    author_name: "Nguyễn Phúc Toàn",
    author_role_vi: "Sales Engineer & Solution Consultant",
    title_vi: "Quy trình dựng bản chạy thử (POC) trong 7 ngày giúp doanh nghiệp kiểm chứng giải pháp trước khi đầu tư lớn",
    title_en: "7-Day Proof of Concept (POC) Framework: Validating Enterprise Solutions Before High-Capital Commitment",
    excerpt_vi: "Làm sao để ban lãnh đạo và các phòng ban tin tưởng một giải pháp phần mềm mới khi chưa ký hợp đồng tiền tỷ? Phương pháp thiết kế POC tinh gọn giải quyết bài toán cốt lõi trong vòng 1 tuần.",
    excerpt_en: "How do leaders and department heads validate custom enterprise software before committing large capital? A streamlined 7-day POC framework testing core workflows.",
    key_takeaways_vi: [
      "POC (Proof of Concept) không phải là sản phẩm hoàn thiện mà là mô hình thử nghiệm cô đọng nhằm kiểm chứng 1 đến 2 rủi ro kỹ thuật hoặc rào cản nghiệp vụ lớn nhất.",
      "Giới hạn 7 ngày buộc cả Sales Engineer và doanh nghiệp tập trung vào dữ liệu thật (Real data sample) và quy trình then chốt, loại bỏ hoàn toàn các yêu cầu phù phiếm.",
      "Doanh nghiệp giảm 80% rủi ro dự án thất bại sau triển khai và rút ngắn chu kỳ phê duyệt ngân sách hội đồng quản trị xuống dưới 2 tuần."
    ],
    key_takeaways_en: [
      "A POC is not a finished product; it is a scoped prototype designed specifically to de-risk 1-2 critical operational hurdles.",
      "A strict 7-day timeframe forces both teams to focus strictly on realistic data samples.",
      "Enterprises eliminate 80% of post-deployment risks."
    ],
    content_vi: `<p class="lead">Trong các dự án phần mềm B2B, nỗi sợ lớn nhất là phần mềm không chạy được trên dữ liệu thực tế.</p><h2>1. Bản chất của POC</h2><p>Giải quyết hòn đá cản đường lớn nhất.</p>`,
    content_en: `<p class="lead">De-risking enterprise software implementations via 7-day POCs.</p>`
  }
]

export async function getPosts(): Promise<{ data: Post[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false })
    if (error) {
      console.warn('[CMS] Supabase posts table read error, using fallback seed posts:', error.message)
      return { data: STATIC_SEED_POSTS, error: null }
    }
    if (data && data.length > 0) {
      return { data: data as Post[], error: null }
    }
    return { data: STATIC_SEED_POSTS, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi lấy bài viết'
    return { data: STATIC_SEED_POSTS, error: message }
  }
}

export async function getPostById(id: string): Promise<{ data: Post | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
    if (error || !data) {
      const found = STATIC_SEED_POSTS.find(p => p.id === id || p.slug === id)
      if (found) return { data: found, error: null }
      return { data: null, error: error?.message || 'Không tìm thấy bài viết' }
    }
    return { data: data as Post, error: null }
  } catch (err: unknown) {
    const found = STATIC_SEED_POSTS.find(p => p.id === id || p.slug === id)
    if (found) return { data: found, error: null }
    const message = err instanceof Error ? err.message : 'Lỗi tìm bài viết'
    return { data: null, error: message }
  }
}

export async function upsertPost(post: Partial<Post>): Promise<{ data: Post | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .upsert(post)
      .select()
      .single()
    if (error) return { data: null, error: error.message }
    return { data: data as Post, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi lưu bài viết'
    return { data: null, error: message }
  }
}

export async function deletePost(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi xóa bài viết'
    return { success: false, error: message }
  }
}
