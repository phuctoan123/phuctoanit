-- ============================================================================
-- POSTS TABLE SCHEMA (Chuyên mục Góc Tư Vấn & Giải Pháp / Blog / Insights)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_vi TEXT NOT NULL,
    title_en TEXT DEFAULT '',
    excerpt_vi TEXT NOT NULL,
    excerpt_en TEXT DEFAULT '',
    category TEXT NOT NULL CHECK (category IN ('tu-van-giai-phap', 'ha-tang-bao-mat', 'case-study', 'chuyen-doi-so')),
    thumbnail TEXT NOT NULL,
    thumbnail_alt TEXT DEFAULT '',
    read_time_vi TEXT NOT NULL DEFAULT '5 phút đọc',
    read_time_en TEXT NOT NULL DEFAULT '5 min read',
    published_at DATE NOT NULL DEFAULT CURRENT_DATE,
    key_takeaways_vi JSONB NOT NULL DEFAULT '[]'::jsonb,
    key_takeaways_en JSONB NOT NULL DEFAULT '[]'::jsonb,
    content_vi TEXT NOT NULL,
    content_en TEXT DEFAULT '',
    related_service TEXT NOT NULL CHECK (related_service IN ('web-development', 'hosting-domain', 'email-server', 'custom-software', 'consulting-demo')),
    author_name TEXT NOT NULL DEFAULT 'Nguyễn Phúc Toàn',
    author_role_vi TEXT NOT NULL DEFAULT 'Sales Engineer & Solution Consultant',
    author_role_en TEXT NOT NULL DEFAULT 'Sales Engineer & Solution Consultant',
    author_avatar TEXT NOT NULL DEFAULT 'assets/images/user1.png',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    views_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
DROP POLICY IF EXISTS "Allow public read published posts" ON public.posts;
CREATE POLICY "Allow public read published posts" ON public.posts
    FOR SELECT
    USING (status = 'published');

-- Allow authenticated users / admins full access
DROP POLICY IF EXISTS "Allow full access for authenticated admins" ON public.posts;
CREATE POLICY "Allow full access for authenticated admins" ON public.posts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow anon insert/update/select fallback if needed in development
DROP POLICY IF EXISTS "Allow anon manage posts dev" ON public.posts;
CREATE POLICY "Allow anon manage posts dev" ON public.posts
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Indexing for fast search and slug lookup
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status_published ON public.posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_is_featured ON public.posts(is_featured);

-- Seed 3 high-quality articles
INSERT INTO public.posts (
  slug, title_vi, title_en, excerpt_vi, excerpt_en, category, thumbnail, thumbnail_alt,
  read_time_vi, read_time_en, published_at, key_takeaways_vi, key_takeaways_en,
  content_vi, content_en, related_service, is_featured, status
) VALUES
(
  'tai-sao-email-doanh-nghiep-hay-vao-spam-cau-hinh-spf-dkim-dmarc',
  'Tại sao Email công ty hay rơi vào hòm thư Spam? Hướng dẫn cấu hình SPF, DKIM, DMARC chuẩn xác',
  'Why Corporate Emails Land in Spam: Complete Guide to Configuring SPF, DKIM & DMARC',
  'Khách hàng không nhận được báo giá, email marketing bị Google và Microsoft chặn thẳng thừng? Phân tích nguyên nhân kỹ thuật và cách thiết lập bộ ba bản ghi SPF, DKIM, DMARC chuẩn doanh nghiệp.',
  'Clients missing price quotes, marketing emails blocked outright by Google and Microsoft? Technical root causes and step-by-step setup for SPF, DKIM, and DMARC.',
  'ha-tang-bao-mat',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=675&q=80',
  'Hướng dẫn cấu hình SPF DKIM DMARC cho Mail Server',
  '6 phút đọc',
  '6 min read',
  '2026-11-20',
  '["Từ đầu năm 2024, Google Workspace và Yahoo chính thức từ chối hoặc đẩy vào Spam mọi email gửi từ tên miền thiếu bản ghi SPF/DKIM hợp lệ.", "SPF quy định IP được phép gửi thư, DKIM ký số chống sửa đổi nội dung trên đường truyền, DMARC báo cáo và chỉ đạo hành vi cách ly thư giả mạo.", "Thiết lập chuẩn xác bộ 3 bản ghi DNS chỉ tốn 30 phút nhưng bảo vệ 98% tỷ lệ thư gửi tới Inbox đối tác và bảo vệ uy tín thương hiệu."]'::jsonb,
  '["Since early 2024, Google and Yahoo reject or spam-flag emails sent from domains lacking valid SPF/DKIM authentication.", "SPF specifies authorized sender IPs, DKIM signs messages cryptographically, and DMARC enforces handling policies for failed checks.", "Accurate DNS configuration takes roughly 30 minutes but guarantees up to 98% deliverability straight to client inboxes."]'::jsonb,
  '<p class="lead">Một trong những sự cố phổ biến nhất mà các doanh nghiệp B2B phản ánh với đội ngũ kỹ thuật của chúng tôi là: <em>"Bên em gửi email báo giá và hợp đồng qua đối tác lớn nhưng toàn bị báo vào hòm Spam / Rác, thậm chí thư bị trả về (Bounced) ngay lập tức."</em></p><h2>1. Vì sao bộ lọc của Google, Microsoft ngày càng khắt khe?</h2><p>Bất kỳ email nào gửi từ một tên miền không chứng minh được danh tính hợp lệ đều bị nghi ngờ là thư rác.</p><h2>2. Bộ ba hộ pháp: SPF, DKIM và DMARC</h2><p>Thiết lập đủ 3 bản ghi DNS để đảm bảo thư vào hộp thư chính.</p>',
  '<p class="lead">One of the most persistent issues enterprise clients bring to our consulting table is corporate email deliverability failure.</p><h2>1. Why Google and Microsoft are getting strict</h2><p>Unauthenticated emails are flagged as untrusted.</p>',
  'email-server',
  true,
  'published'
),
(
  'bai-toan-chi-phi-fnb-website-dat-mon-rieng-hay-app-giao-hang',
  'Bài toán chi phí F&B: Tự xây Website đặt món riêng hay phụ thuộc 100% vào App giao hàng?',
  'F&B Cost Dilemma: Building a Direct Ordering Website vs. Relying 100% on Delivery Apps',
  'Chiết khấu 20-30% trên mỗi đơn hàng từ các nền tảng giao đồ ăn đang bào mòn biên lợi nhuận của chuỗi F&B. Khi nào thương hiệu nên đầu tư hệ sinh thái đặt hàng riêng để giữ chân khách hàng trung thành?',
  '20-30% platform commissions on delivery apps erode restaurant margins. When should F&B brands invest in their own direct ordering web system to retain customer data?',
  'tu-van-giai-phap',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&h=675&q=80',
  'Mô hình Website đặt món riêng cho ngành F&B',
  '7 phút đọc',
  '7 min read',
  '2026-11-18',
  '["Ứng dụng giao hàng là phễu đón khách mới hiệu quả, nhưng mức phí hoa hồng 20-28% là khoản thuế quá đắt đỏ đối với các đơn hàng lặp lại từ khách quen.", "Xây dựng Website đặt món riêng (Web Ordering & Zalo Mini App) giúp nhà hàng nắm giữ 100% dữ liệu khách hàng (CDP) và chủ động chiến dịch Re-marketing với chi phí 0đ.", "Điểm hòa vốn: Khi doanh thu từ tệp khách hàng quen vượt mức 150 triệu/tháng, chi phí vận hành hệ thống riêng chỉ chiếm khoảng 3-5% doanh thu."]'::jsonb,
  '["Food delivery apps are excellent customer acquisition funnels, but 20-28% commission fees become unsustainable for recurring loyal patrons.", "Owning a direct ordering website empowers F&B brands with 100% Customer Data Platform ownership and zero-cost re-engagement.", "The break-even point: Once monthly direct sales exceed $6,000, private platform operations cost only 3-5% of revenue."]'::jsonb,
  '<p class="lead">Trong hơn 3 năm tư vấn chuyển đổi số cho các chuỗi nhà hàng, quán cà phê và xưởng bánh tại TP.HCM, bài toán chiết khấu 25% luôn là vấn đề trăn trở.</p><h2>1. Sự thật về mức phí 25% hoa hồng</h2><p>Doanh nghiệp mất hàng trăm triệu mỗi năm mà không có dữ liệu khách hàng.</p><h2>2. Chiến lược kết hợp hiệu quả</h2><p>Dùng app đón khách mới, kéo khách quen về website riêng.</p>',
  '<p class="lead">Balancing delivery app commissions with direct ordering web systems.</p>',
  'web-development',
  true,
  'published'
),
(
  'quy-trinh-dung-poc-7-ngay-kiem-chung-giai-phap-cong-nghe',
  'Quy trình dựng bản chạy thử (POC) trong 7 ngày giúp doanh nghiệp kiểm chứng giải pháp trước khi đầu tư lớn',
  '7-Day Proof of Concept (POC) Framework: Validating Enterprise Solutions Before High-Capital Commitment',
  'Làm sao để ban lãnh đạo và các phòng ban tin tưởng một giải pháp phần mềm mới khi chưa ký hợp đồng tiền tỷ? Phương pháp thiết kế POC tinh gọn giải quyết bài toán cốt lõi trong vòng 1 tuần.',
  'How do leaders and department heads validate custom enterprise software before committing large capital? A streamlined 7-day POC framework testing core workflows.',
  'case-study',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&h=675&q=80',
  'Quy trình triển khai POC công nghệ trong 7 ngày',
  '8 phút đọc',
  '8 min read',
  '2026-11-15',
  '["POC (Proof of Concept) không phải là sản phẩm hoàn thiện mà là mô hình thử nghiệm cô đọng nhằm kiểm chứng 1 đến 2 rủi ro kỹ thuật hoặc rào cản nghiệp vụ lớn nhất.", "Giới hạn 7 ngày buộc cả Sales Engineer và doanh nghiệp tập trung vào dữ liệu thật (Real data sample) và quy trình then chốt, loại bỏ hoàn toàn các yêu cầu phù phiếm.", "Doanh nghiệp giảm 80% rủi ro dự án thất bại sau triển khai và rút ngắn chu kỳ phê duyệt ngân sách hội đồng quản trị xuống dưới 2 tuần."]'::jsonb,
  '["A POC is not a finished product; it is a scoped prototype designed specifically to de-risk 1-2 critical operational hurdles.", "A strict 7-day timeframe forces both teams to focus strictly on realistic data samples and essential core flows without scope creep.", "Enterprises eliminate 80% of post-deployment risks and shorten executive budget approval cycles down to under two weeks."]'::jsonb,
  '<p class="lead">Trong các dự án phần mềm B2B, nỗi sợ lớn nhất là rủi ro không tương thích dữ liệu thực tế.</p><h2>1. Bản chất của POC</h2><p>Giải quyết hòn đá cản đường lớn nhất với 20% tính năng mang lại 80% giá trị.</p><h2>2. Lộ trình 7 ngày triển khai</h2><p>Khảo sát, dựng sandbox, thử nghiệm và live demo trên dữ liệu thật.</p>',
  '<p class="lead">A proven 7-day framework to de-risk enterprise tech investments.</p>',
  'consulting-demo',
  true,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  title_vi = EXCLUDED.title_vi,
  title_en = EXCLUDED.title_en,
  excerpt_vi = EXCLUDED.excerpt_vi,
  excerpt_en = EXCLUDED.excerpt_en,
  content_vi = EXCLUDED.content_vi,
  content_en = EXCLUDED.content_en,
  thumbnail = EXCLUDED.thumbnail,
  thumbnail_alt = EXCLUDED.thumbnail_alt,
  related_service = EXCLUDED.related_service,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  updated_at = NOW();
