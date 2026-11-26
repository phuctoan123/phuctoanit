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

export async function updateCaseStudy(id: string, patch: Partial<CaseStudy>) {
  const { data, error } = await supabase
    .from('case_studies')
    .update(patch)
    .eq('id', id)
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
    content_vi: `<p class="lead">Một trong những sự cố phổ biến nhất mà các doanh nghiệp B2B phản ánh với đội ngũ kỹ thuật của chúng tôi là: <em>"Bên em gửi email báo giá và hợp đồng qua đối tác lớn nhưng toàn bị báo vào hòm Spam / Rác, thậm chí thư bị trả về (Bounced) ngay lập tức."</em></p>
<p>Sự cố này không đơn thuần làm chậm trễ thương vụ triệu USD, mà còn âm thầm hủy hoại điểm tín nhiệm (Domain Reputation) của doanh nghiệp trên toàn cầu. Vậy đâu là gốc rễ vấn đề và cách khắc phục triệt để như thế nào?</p>
<h2>1. Vì sao bộ lọc của Google, Microsoft ngày càng khắt khe?</h2>
<p>Trước làn sóng lừa đảo giả mạo danh tính (Phishing & Spoofing), các nhà cung cấp dịch vụ thư điện tử hàng đầu thế giới như Google (Gmail, Google Workspace), Microsoft (Outlook, Office 365) và Yahoo đã siết chặt chính sách nhận thư kể từ quý 1/2024. Bất kỳ email nào gửi từ một tên miền không chứng minh được danh tính hợp lệ đều bị nghi ngờ là thư rác.</p>
<div class="callout callout-warning">
  <div class="callout-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
  <div class="callout-body">
    <strong>Cảnh báo quan trọng:</strong> Nếu tỷ lệ thư bị người nhận bấm nút "Báo cáo Spam" vượt quá ngưỡng <strong>0.3%</strong>, tên miền của bạn có nguy cơ bị đưa vào danh sách đen (Blacklist) toàn cầu trong nhiều tuần.
  </div>
</div>
<h2>2. "Bộ ba hộ pháp" bảo vệ email doanh nghiệp: SPF, DKIM và DMARC</h2>
<p>Để đảm bảo thư của bạn luôn vào Inbox của đối tác, hệ thống DNS của tên miền công ty bắt buộc phải sở hữu đủ 3 bản ghi sau:</p>
<h3>A. Bản ghi SPF (Sender Policy Framework)</h3>
<p>SPF hoạt động như một danh sách khách mời VIP được niêm yết công khai trên DNS. Khi một máy chủ nhận thư từ tên miền <code>@congtyban.vn</code>, nó sẽ tra cứu SPF để xem IP gửi thư có nằm trong danh sách cho phép hay không.</p>
<pre><code>v=spf1 include:_spf.google.com include:mail.nasani.vn ip4:103.x.x.x ~all</code></pre>
<p><em>Lưu ý:</em> Tránh sử dụng quá 10 lần tra cứu DNS (DNS Lookups limit) trong một bản ghi SPF, vì vượt quá giới hạn này sẽ gây lỗi <code>PermError</code> khiến thư bị đánh rớt.</p>
<h3>B. Chữ ký số DKIM (DomainKeys Identified Mail)</h3>
<p>DKIM sử dụng mật mã khóa công khai (Public Key Cryptography). Mail server của bạn dùng Khóa bí mật (Private Key) để đóng dấu niêm phong lên tiêu đề email. Mail server người nhận sẽ dùng Khóa công khai trên bản ghi TXT DNS của bạn để giải mã và kiểm tra.</p>
<p>Nếu email bị bất kỳ kẻ trung gian nào can thiệp hay sửa đổi nội dung trên đường truyền, chữ ký DKIM sẽ không khớp và thư bị coi là giả mạo.</p>
<h3>C. Chính sách DMARC (Domain-based Message Authentication)</h3>
<p>Nếu SPF và DKIM là giấy chứng minh danh tính, thì DMARC là chỉ thị bằng văn bản cho người nhận: <em>"Nếu một email tự xưng là từ công ty tôi nhưng trượt cả SPF lẫn DKIM, bạn hãy từ chối nhận (reject) hoặc cách ly (quarantine) ngay lập tức!"</em></p>
<pre><code>v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@congtyban.vn; pct=100</code></pre>
<h2>3. Checklist 4 bước tự kiểm tra sức khỏe Email doanh nghiệp</h2>
<ol class="step-list">
  <li><strong>Kiểm tra Blacklist:</strong> Nhập tên miền vào công cụ MXToolbox hoặc Mail-Tester để xem IP mail có dính danh sách đen của Spamhaus, Barracuda không.</li>
  <li><strong>Xác thực bản ghi DNS:</strong> Đảm bảo chỉ có DUY NHẤT một bản ghi SPF cho một tên miền chính (nhiều bản ghi SPF sẽ làm vô hiệu hóa toàn bộ).</li>
  <li><strong>Kiểm tra Reverse DNS (PTR Record):</strong> IP của Mail Server chuyên dụng cần phải phân giải ngược về đúng hostname tên miền.</li>
  <li><strong>Theo dõi báo cáo DMARC hàng tuần:</strong> Rà soát xem có ai đang giả mạo thương hiệu công ty để gửi thư lừa đảo hay không.</li>
</ol>
<div class="callout callout-tip">
  <div class="callout-icon"><i class="fa-solid fa-lightbulb"></i></div>
  <div class="callout-body">
    <strong>Lời khuyên từ Sales Engineer:</strong> Các dịch vụ Email miễn phí (như <code>@gmail.com</code>) hoặc Email dùng chung trên hosting giá rẻ (Shared Hosting) không thể đáp ứng tiêu chuẩn gửi thư B2B số lượng lớn. Doanh nghiệp cần trang bị giải pháp <strong>Mail Server Doanh Nghiệp riêng với IP tĩnh sạch</strong> để bảo vệ thương hiệu bền vững.
  </div>
</div>`,
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
    content_vi: `<p class="lead">Trong hơn 3 năm tư vấn chuyển đổi số cho các chuỗi nhà hàng, quán cà phê và xưởng bánh tại TP.HCM, câu hỏi tôi nhận được nhiều nhất từ các chủ thương hiệu là: <em>"Bây giờ khách quen cứ lên ShopeeFood / Grab đặt món, tháng nào bên anh cũng mất 25% chiết khấu. Có nên tự làm Web đặt món riêng không?"</em></p>
<p>Đây không phải là quyết định "chọn một bỏ một", mà là bài toán chiến lược phân bổ nguồn lực giữa <strong>Kênh thu hút khách mới (Customer Acquisition)</strong> và <strong>Kênh giữ chân khách hàng (Customer Retention)</strong>.</p>
<h2>1. Sự thật về mức phí chiết khấu 20% - 30% trên App giao hàng</h2>
<p>Thử làm một phép tính nhanh với một thương hiệu F&B có 2 cơ sở:</p>
<ul>
  <li>Doanh thu bán mang đi qua App: <strong>300.000.000 VNĐ / tháng</strong>.</li>
  <li>Phí hoa hồng cho bên thứ ba (bình quân 25%): <strong>75.000.000 VNĐ / tháng</strong>.</li>
  <li>Sau 1 năm, tổng số tiền phí phải trả: <strong>900.000.000 VNĐ</strong>!</li>
</ul>
<p>Điều đau lòng nhất là sau khi chi 900 triệu tiền hoa hồng, bạn <strong>không sở hữu bất kỳ thông tin nào</strong> của khách hàng: không số điện thoại, không lịch sử khẩu vị, không địa chỉ cá nhân để remarketing.</p>
<h2>2. So sánh mô hình App giao hàng vs. Website đặt món riêng (Direct Ordering)</h2>
<div class="table-responsive">
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Tiêu chí</th>
        <th>App giao hàng (Grab / ShopeeFood)</th>
        <th>Website đặt món riêng (Nasani Web)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Mục đích chính</strong></td>
        <td>Tiếp cận khách hàng mới, vãng lai</td>
        <td>Chăm sóc & giữ chân khách hàng quen</td>
      </tr>
      <tr>
        <td><strong>Chi phí trên mỗi đơn</strong></td>
        <td>20% – 28% hoa hồng cố định</td>
        <td>0% hoa hồng (chỉ tốn phí cổng thanh toán ~1%)</td>
      </tr>
      <tr>
        <td><strong>Quyền sở hữu dữ liệu</strong></td>
        <td>Nền tảng nắm giữ 100%</td>
        <td>Doanh nghiệp sở hữu 100% (Số điện thoại, sinh nhật, lịch sử đơn)</td>
      </tr>
      <tr>
        <td><strong>Tùy biến thương hiệu</strong></td>
        <td>Rập khuôn giao diện chung</td>
        <td>Tùy chỉnh nhận diện thương hiệu, chương trình tích điểm đổi quà</td>
      </tr>
    </tbody>
  </table>
</div>
<h2>3. Chiến lược kết hợp "Con Ngựa Thành Troy" hiệu quả</h2>
<p>Mô hình thành công nhất mà tôi đã tư vấn cho hơn 15 chuỗi F&B gồm 3 bước:</p>
<ol class="step-list">
  <li><strong>Dùng App làm phễu đón khách mới:</strong> Vẫn duy trì các món cơ bản trên App giao hàng để tận dụng lượng truy cập khổng lồ của nền tảng.</li>
  <li><strong>Kèm Voucher chuyển đổi trong gói hàng:</strong> Mỗi đơn hàng ship đi đều kèm một card cảm ơn lịch sự với mã QR: <em>"Quét mã đặt đơn lần sau trên Website riêng để giảm ngay 15% và tích điểm đổi nước miễn phí"</em>.</li>
  <li><strong>Đơn hàng lặp lại chuyển về Website riêng:</strong> Khách quen được hưởng giá tốt hơn 10-15%, nhà hàng vẫn giữ lại được 10-15% biên lợi nhuận so với khi bị trừ chiết khấu qua app.</li>
</ol>
<div class="callout callout-tip">
  <div class="callout-icon"><i class="fa-solid fa-calculator"></i></div>
  <div class="callout-body">
    <strong>Điểm mấu chốt:</strong> Chi phí xây dựng một Website đặt món chuyên nghiệp chuẩn UI/UX, tích hợp cổng thanh toán VietQR và tự động gọi tài xế Ahamove / GrabExpress chỉ dao động từ 15 - 25 triệu VNĐ trọn gói một lần. Số tiền này chỉ tương đương 1/3 chi phí hoa hồng mà một quán vừa và nhỏ chi trả cho app trong một tháng!
  </div>
</div>`,
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
    content_vi: `<p class="lead">Trong các dự án phần mềm B2B trị giá từ vài trăm triệu đến hàng tỷ đồng, nỗi sợ lớn nhất của Giám đốc điều hành (CEO) và Giám đốc công nghệ (CTO) luôn là: <em>"Nhà cung cấp trình chiếu slide thuyết trình và demo mẫu rất mượt, nhưng khi áp dụng vào quy trình phức tạp và dữ liệu đặc thù của công ty tôi thì liệu có chạy được không?"</em></p>
<p>Là một Sales Engineer, vũ khí thuyết phục khách hàng mạnh mẽ nhất của tôi không phải là những lời hứa hẹn hoa mỹ, mà là <strong>Quy trình dựng POC (Proof of Concept) thực chiến trong 7 ngày</strong>.</p>
<h2>1. Bản chất của POC: Giải quyết "Hòn đá cản đường" lớn nhất</h2>
<p>Nhiều doanh nghiệp nhầm lẫn giữa <strong>POC (Bản chứng minh khái niệm)</strong>, <strong>Prototype (Bản mẫu giao diện)</strong> và <strong>MVP (Sản phẩm khả dụng tối thiểu)</strong>:</p>
<ul>
  <li><strong>Prototype:</strong> Trả lời câu hỏi <em>"Sản phẩm trông như thế nào?"</em> (UI/UX, bản vẽ Figma).</li>
  <li><strong>MVP:</strong> Trả lời câu hỏi <em>"Thị trường có sẵn sàng trả tiền cho sản phẩm này không?"</em> (Có thể bán được ra ngoài).</li>
  <li><strong>POC:</strong> Trả lời câu hỏi sống còn <em>"Ý tưởng công nghệ này có khả thi về mặt kỹ thuật và tích hợp được với dữ liệu của công ty tôi không?"</em></li>
</ul>
<div class="callout callout-info">
  <div class="callout-icon"><i class="fa-solid fa-compass"></i></div>
  <div class="callout-body">
    <strong>Nguyên tắc vàng của POC:</strong> Chỉ tập trung vào <strong>20% tính năng</strong> mang lại <strong>80% giá trị</strong> hoặc <strong>chứa đựng 90% rủi ro kỹ thuật</strong> (như tích hợp API phần mềm kế toán cũ, đồng bộ tồn kho thời gian thực).
  </div>
</div>
<h2>2. Khung lộ trình 7 ngày triển khai POC mẫu</h2>
<div class="timeline-box">
  <div class="timeline-step">
    <div class="step-badge">Ngày 1 - 2</div>
    <div class="step-content">
      <h4>Xác định tiêu chí thành công (Success Criteria) & Tiếp nhận dữ liệu mẫu</h4>
      <p>Họp 90 phút với các bên liên quan để thống nhất đúng 2 kịch bản cần kiểm chứng. Khách hàng cung cấp 100 dòng dữ liệu mẫu ẩn danh (Anonymized data).</p>
    </div>
  </div>
  <div class="timeline-step">
    <div class="step-badge">Ngày 3 - 5</div>
    <div class="step-content">
      <h4>Dựng môi trường Sandbox & Lập trình logic cốt lõi</h4>
      <p>Khởi tạo máy chủ thử nghiệm (Staging Server), kết nối webhook hoặc API dữ liệu thực tế, kiểm tra độ trễ và khả năng xử lý bất đồng bộ.</p>
    </div>
  </div>
  <div class="timeline-step">
    <div class="step-badge">Ngày 6</div>
    <div class="step-content">
      <h4>Chạy thử nội bộ & Xử lý tình huống biên (Edge Cases)</h4>
      <p>Kiểm tra tải với các kịch bản bất thường (mất mạng, dữ liệu thiếu trường, xung đột cập nhật cùng lúc).</p>
    </div>
  </div>
  <div class="timeline-step">
    <div class="step-badge">Ngày 7</div>
    <div class="step-content">
      <h4>Thuyết trình trực tiếp kết quả (Live Demo on Real Data)</h4>
      <p>Mời trực tiếp người dùng cuối (End-users) và ban lãnh đạo thao tác trên màn hình thực tế. Ký biên bản xác nhận tính khả thi.</p>
    </div>
  </div>
</div>
<h2>3. Bài học thực tế: Tiết kiệm 400 triệu đồng nhờ 1 tuần làm POC</h2>
<p>Một công ty phân phối thiết bị y tế tại TP.HCM dự định chi 450 triệu đồng để đặt hàng một phần mềm quản lý kho từ đơn vị bên ngoài với lời cam kết kết nối tự động với máy quét mã vạch 2D cầm tay cũ trong kho.</p>
<p>Thay vì ký hợp đồng ngay, chúng tôi đề xuất dựng một bản POC kết nối máy quét với cơ sở dữ liệu thử nghiệm trong 5 ngày. Kết quả: Thiết bị quét của khách hàng sử dụng chuẩn giao thức truyền tin cũ qua cổng COM không tương thích với hạ tầng WebSockets trên nền tảng đám mây nếu không có bộ chuyển đổi phần cứng trung gian.</p>
<p>Nếu không làm POC, khách hàng sẽ phải dừng hoạt động kho trong nhiều tuần và chịu chi phí phát sinh sửa đổi phần mềm hàng trăm triệu đồng sau khi hợp đồng đã ký kết.</p>
<div class="callout callout-tip">
  <div class="callout-icon"><i class="fa-solid fa-handshake"></i></div>
  <div class="callout-body">
    <strong>Cam kết từ Phúc Toàn:</strong> Đối với các yêu cầu dự án tùy biến phức tạp, tôi luôn đồng hành cùng quý doanh nghiệp xây dựng môi trường Sandbox và POC kiểm chứng trước khi đề xuất bất kỳ gói ngân sách chính thức nào.
  </div>
</div>`,
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
    const isFeatured = post.is_featured !== undefined ? post.is_featured : (post.featured ?? false)

    // Build clean sanitized payload with only real database columns
    const payload: Record<string, unknown> = {
      slug: post.slug,
      title_vi: post.title_vi,
      title_en: post.title_en || '',
      excerpt_vi: post.excerpt_vi || '',
      excerpt_en: post.excerpt_en || '',
      category: post.category || 'tu-van-giai-phap',
      thumbnail: post.thumbnail || '',
      thumbnail_alt: post.thumbnail_alt || '',
      read_time_vi: post.read_time_vi || '5 phút đọc',
      read_time_en: post.read_time_en || '5 min read',
      published_at: post.published_at || new Date().toISOString().split('T')[0],
      key_takeaways_vi: Array.isArray(post.key_takeaways_vi) ? post.key_takeaways_vi : [],
      key_takeaways_en: Array.isArray(post.key_takeaways_en) ? post.key_takeaways_en : [],
      content_vi: post.content_vi || '',
      content_en: post.content_en || '',
      related_service: post.related_service || 'web-development',
      author_name: post.author_name || 'Nguyễn Phúc Toàn',
      author_role_vi: post.author_role_vi || 'Sales Engineer & Solution Consultant',
      author_role_en: post.author_role_en || 'Sales Engineer & Solution Consultant',
      author_avatar: post.author_avatar || 'assets/images/user1.png',
      is_featured: Boolean(isFeatured),
      status: post.status || 'published',
      updated_at: new Date().toISOString(),
    }

    // Only assign ID if it is a valid UUID (not temporary like 'post-email-...' or '')
    if (post.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(post.id)) {
      payload.id = post.id
    }

    if (post.views_count !== undefined) {
      payload.views_count = post.views_count
    }

    if (post.created_at) {
      payload.created_at = post.created_at
    }

    const { data, error } = await supabase
      .from('posts')
      .upsert(payload, { onConflict: 'slug' })
      .select()
      .single()

    if (error) {
      console.error('[CMS] upsertPost error:', error)
      return { data: null, error: error.message }
    }
    return { data: data as Post, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi lưu bài viết'
    console.error('[CMS] upsertPost exception:', err)
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
