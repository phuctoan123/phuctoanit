-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED DATA TỪ WEBSITE CHÍNH (phuctoanit.id.vn) VÀO SUPABASE
-- Khớp 100% schema bảng trong setup.sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. CÀI ĐẶT CHUNG (site_settings)
insert into public.site_settings (
  id, hotline, email, address_vi, address_en, partner_website, social_links, seo
) values (
  1,
  '0913.365.842',
  'phuctoan4906@gmail.com',
  'TP. Hồ Chí Minh, Việt Nam',
  'Ho Chi Minh City, Vietnam',
  'https://nasani.vn',
  '{
    "zalo": "https://zalo.me/0913365842",
    "facebook": "https://www.facebook.com/phuctoansales",
    "linkedin": "https://www.linkedin.com/in/phuctoanit",
    "whatsapp": "https://wa.me/84913365842"
  }'::jsonb,
  '{
    "meta_title_vi": "Nguyễn Phúc Toàn – Kỹ sư Giải pháp & Tư vấn Công nghệ",
    "meta_title_en": "Phuc Toan Nguyen – Sales Engineer & Tech Solutions Consultant",
    "meta_desc_vi": "Chuyên viên tư vấn & demo giải pháp công nghệ: Website B2B, Hosting, Mail Server, Phần mềm quản lý cho doanh nghiệp tại TP.HCM và toàn quốc.",
    "meta_desc_en": "Sales Specialist with 15+ years of experience in demo and technology consulting – Website, Hosting, Domain, Mail Server, Enterprise Software – for B2B businesses in Ho Chi Minh City and nationwide."
  }'::jsonb
)
on conflict (id) do update set
  hotline = excluded.hotline,
  email = excluded.email,
  address_vi = excluded.address_vi,
  address_en = excluded.address_en,
  partner_website = excluded.partner_website,
  social_links = excluded.social_links,
  seo = excluded.seo,
  updated_at = now();


-- 2. HERO & GIỚI THIỆU (site_about)
insert into public.site_about (
  id,
  hero_title_vi, hero_title_en,
  hero_tagline_vi, hero_tagline_en,
  about_desc_vi, about_desc_en,
  work_philosophy_vi, work_philosophy_en,
  strengths,
  avatar_url
) values (
  1,
  'Tư vấn Giải pháp',
  'Sales Engineer',
  'Tư vấn & đề xuất giải pháp công nghệ – cầu nối giữa đội kỹ thuật và khách hàng doanh nghiệp.',
  'Consulting & demoing technology solutions – the bridge between tech teams and enterprise clients.',
  'Tôi là Phúc Toàn – chuyên viên Sales đại diện cho một công ty công nghệ uy tín có hơn 15 năm kinh nghiệm tại TP. Hồ Chí Minh. Vai trò của tôi là cầu nối giữa đội ngũ kỹ thuật và khách hàng doanh nghiệp, giúp chuyển hoá yêu cầu kinh doanh thành các giải pháp công nghệ phù hợp và hiệu quả.',
  'I am Phuc Toan – a Sales Specialist representing a reputable technology company with over 15 years of industry experience in Ho Chi Minh City. My role is to bridge the gap between the technical team and enterprise clients, translating business requirements into suitable and effective technology solutions.',
  'Lắng nghe bài toán của khách hàng, đề xuất giải pháp thực tế – không bán những gì khách không cần, chỉ tư vấn những gì thực sự tạo ra giá trị cho doanh nghiệp.',
  'Listen to the client’s problem, propose practical solutions – never sell what the client doesn’t need, only recommend what truly creates value for their business.',
  '["Demo sản phẩm & dựng môi trường POC theo yêu cầu", "Tư vấn Website, Hosting, Mail Server, Phần mềm quản lý", "Phân tích nghiệp vụ, lập proposal và đàm phán kỹ thuật"]'::jsonb,
  null
)
on conflict (id) do update set
  hero_title_vi = excluded.hero_title_vi,
  hero_title_en = excluded.hero_title_en,
  hero_tagline_vi = excluded.hero_tagline_vi,
  hero_tagline_en = excluded.hero_tagline_en,
  about_desc_vi = excluded.about_desc_vi,
  about_desc_en = excluded.about_desc_en,
  work_philosophy_vi = excluded.work_philosophy_vi,
  work_philosophy_en = excluded.work_philosophy_en,
  strengths = excluded.strengths,
  updated_at = now();


-- 3. KỸ NĂNG CHUYÊN MÔN (skills)
delete from public.skills;
insert into public.skills (icon, title_vi, title_en, desc_vi, desc_en, sort_order) values
(
  'fa-code',
  'Kỹ thuật & Tích hợp',
  'Technical & Integration',
  'API/Integration, Cloud hosting, SQL, dựng môi trường demo/POC, cấu hình Mail Server và hạ tầng web theo yêu cầu.',
  'API/Integration, Cloud hosting, SQL, building demo/POC environments, Mail Server configuration, and web infrastructure setup on demand.',
  1
),
(
  'fa-cube',
  'Sản phẩm & Giải pháp',
  'Product & Solutions',
  'Hiểu sâu danh mục sản phẩm công ty, phân tích cạnh tranh, viết RFP/proposal và so sánh giải pháp đối thủ cho từng bài toán khách hàng.',
  'In-depth knowledge of the product portfolio, competitive analysis, writing RFPs/proposals, and comparing competitor solutions for each client’s specific problem.',
  2
),
(
  'fa-person-chalkboard',
  'Thuyết trình & Tư vấn',
  'Presentation & Consulting',
  'Thuyết trình kỹ thuật cho C-level, đàm phán giải pháp, tư vấn theo bài toán thực tế và dẫn dắt khách hàng qua toàn bộ chu trình ra quyết định.',
  'Technical presentations for C-level executives, solution negotiation, consulting based on real client challenges, and guiding clients through the entire decision-making process.',
  3
);


-- 4. DỊCH VỤ CUNG CẤP (services & service_features)
delete from public.service_features;
delete from public.services;

do $$
declare
  s1_id uuid;
  s2_id uuid;
  s3_id uuid;
  s4_id uuid;
  s5_id uuid;
begin
  -- Dịch vụ 1: Thiết kế Website
  insert into public.services (order_num, sort_order, icon, title_vi, title_en, short_desc_vi, short_desc_en)
  values (1, 1, 'fa-globe', 'Thiết kế Website', 'Website Design', 'Chuẩn UX/UI & Tối ưu tốc độ', 'Modern UX/UI & Fast Speed')
  returning id into s1_id;

  insert into public.service_features (service_id, text_vi, text_en, sort_order) values
  (s1_id, 'Giao diện độc quyền chuẩn UX/UI', 'Custom & modern UX/UI', 1),
  (s1_id, 'Tối ưu SEO & tốc độ tải trang', 'SEO & speed optimization', 2),
  (s1_id, 'Tương thích 100% mọi thiết bị', '100% Mobile responsive', 3),
  (s1_id, 'Dễ dàng mở rộng & kết nối API', 'Seamless API integration', 4);

  -- Dịch vụ 2: Hosting
  insert into public.services (order_num, sort_order, icon, title_vi, title_en, short_desc_vi, short_desc_en)
  values (2, 2, 'fa-bolt', 'Hosting', 'Web Hosting', 'Tốc độ cao & Vận hành ổn định', 'High Speed & 99.9% Uptime')
  returning id into s2_id;

  insert into public.service_features (service_id, text_vi, text_en, sort_order) values
  (s2_id, 'Đảm bảo Uptime ổn định 99.9%', '99.9% Uptime guarantee', 1),
  (s2_id, 'Ổ cứng NVMe siêu tốc độ', 'High-speed NVMe storage', 2),
  (s2_id, 'Tặng chứng chỉ SSL & Firewall', 'Free SSL & Firewall shield', 3),
  (s2_id, 'Sao lưu mỗi tuần & Hỗ trợ 24/7', 'Daily backups & 24/7 support', 4);

  -- Dịch vụ 3: Tên miền
  insert into public.services (order_num, sort_order, icon, title_vi, title_en, short_desc_vi, short_desc_en)
  values (3, 3, 'fa-shield-halved', 'Tên miền', 'Domain', 'Khẳng định thương hiệu số', 'Secure Digital Identity')
  returning id into s3_id;

  insert into public.service_features (service_id, text_vi, text_en, sort_order) values
  (s3_id, 'Đầy đủ tên miền .vn & Quốc tế', 'Full .VN & Global TLDs', 1),
  (s3_id, 'Kích hoạt nhanh trong 5 phút', 'Instant 5-min activation', 2),
  (s3_id, 'Hệ thống quản lý DNS bảo mật', 'Flexible DNS management', 3),
  (s3_id, 'Bảo hộ nhận diện thương hiệu', 'Brand identity protection', 4);

  -- Dịch vụ 4: Email Server
  insert into public.services (order_num, sort_order, icon, title_vi, title_en, short_desc_vi, short_desc_en)
  values (4, 4, 'fa-envelope-open-text', 'Email Server', 'Email Server', 'Hệ thống email theo tên miền', 'Dedicated Enterprise Email')
  returning id into s4_id;

  insert into public.service_features (service_id, text_vi, text_en, sort_order) values
  (s4_id, 'Email theo tên miền riêng công ty', 'Corporate branded email accounts', 1),
  (s4_id, 'Tỷ lệ vào thẳng Inbox cao 99.9%', '99.9% Inbox delivery rate (SPF/DKIM/DMARC)', 2),
  (s4_id, 'Bộ lọc chống Spam & Virus tối tân', 'Advanced Antivirus & Spam filter', 3),
  (s4_id, 'Mã hóa dữ liệu & Bảo mật cao cấp', 'End-to-end data encryption', 4);

  -- Dịch vụ 5: Phát triển phần mềm theo yêu cầu
  insert into public.services (order_num, sort_order, icon, title_vi, title_en, short_desc_vi, short_desc_en)
  values (5, 5, 'fa-code', 'Dịch vụ phát triển phần mềm', 'Custom Software Development', 'Gia công theo yêu cầu', 'Tailored Web & Mobile Apps')
  returning id into s5_id;

  insert into public.service_features (service_id, text_vi, text_en, sort_order) values
  (s5_id, 'Phát triển Web App & Mobile App', 'Web App & Mobile App development', 1),
  (s5_id, 'Đội ngũ chuyên nghiệp, chuẩn Agile', 'Agile process & senior developers', 2),
  (s5_id, 'Bảo mật cao & Mã nguồn tối ưu', 'High security & clean architecture', 3),
  (s5_id, 'Bảo hành & Hỗ trợ kỹ thuật lâu dài', 'Long-term warranty & technical support', 4);
end $$;


-- 5. BẢNG GIÁ & HÌNH THỨC HỢP TÁC (pricing_plans & benefits)
delete from public.pricing_plan_benefits;
delete from public.pricing_plans;

do $$
declare
  p1_id uuid;
  p2_id uuid;
  p3_id uuid;
begin
  -- Gói 1: Dự án trọn gói
  insert into public.pricing_plans (
    sort_order, is_featured,
    badge_vi, badge_en,
    title_vi, title_en,
    tagline_vi, tagline_en,
    audience_vi, audience_en,
    cta_text_vi, cta_text_en
  ) values (
    1, false,
    'Triển khai A - Z', 'End-to-End Delivery',
    'Dự án trọn gói', 'End-to-End Project',
    'Thiết kế & phát triển website, ứng dụng chuẩn chỉnh từ ý tưởng sơ khởi đến khi bàn giao vận hành thực tế.',
    'Design & build custom websites or web applications tailored to your specific business model from concept to production.',
    'Doanh nghiệp SME, chủ kinh doanh, startup cần xây mới hoặc nâng cấp toàn diện website, phần mềm bán hàng hay cổng dịch vụ.',
    'SMEs, retail businesses, and startups requiring a new or overhauled web platform, booking portal, or sales software.',
    'Nhận báo giá dự án', 'Get a Quote'
  ) returning id into p1_id;

  insert into public.pricing_plan_benefits (plan_id, text_vi, text_en, sort_order) values
  (p1_id, 'Làm việc trực tiếp 1 đầu mối: trao đổi kỹ thuật & kinh doanh thẳng thắn, không qua trung gian.', 'Direct single point of contact: transparent technical & business communication.', 1),
  (p1_id, 'Bàn giao trọn gói A-Z: giao diện độc quyền chuẩn UX/UI, tối ưu SEO, bàn giao 100% mã nguồn.', 'Turnkey delivery: bespoke UX/UI, SEO optimized, 100% source code handover.', 2),
  (p1_id, 'Cam kết tiến độ & ngân sách: báo giá minh bạch ngay từ đầu, không phát sinh chi phí ẩn.', 'Timeline & budget commitment: transparent quotation, zero hidden fees.', 3);

  -- Gói 2: Tư vấn giải pháp & Dựng Demo / POC (Nổi bật)
  insert into public.pricing_plans (
    sort_order, is_featured,
    badge_vi, badge_en,
    title_vi, title_en,
    tagline_vi, tagline_en,
    audience_vi, audience_en,
    cta_text_vi, cta_text_en
  ) values (
    2, true,
    'Kiểm chứng trước khi đầu tư', 'Validate Before Investing',
    'Tư vấn giải pháp & Dựng Demo / POC', 'Solution Consulting & POC Demo',
    'Khảo sát bài toán kỹ thuật, tư vấn kiến trúc và dựng môi trường chạy thử nghiệm (POC) trước khi ra quyết định đầu tư lớn.',
    'Technical requirements assessment, solution architecture design, and rapid POC prototype before major investment decisions.',
    'Doanh nghiệp có bài toán quản lý, chuỗi bán lẻ, F&B, logistics hoặc chuyển đổi số cần kiểm chứng tính khả thi và chi phí.',
    'Retail chains, F&B operations, logistics firms needing to validate feasibility, technical roadmap, and cost-benefit ratio.',
    'Đặt lịch tư vấn giải pháp', 'Book Solution Consultation'
  ) returning id into p2_id;

  insert into public.pricing_plan_benefits (plan_id, text_vi, text_en, sort_order) values
  (p2_id, 'Trải nghiệm thực tế trước khi chi tiền: thao tác thử trên hệ thống mẫu sát với luồng vận hành thực.', 'Hands-on validation before spending: test-drive a realistic prototype mapped to your workflow.', 1),
  (p2_id, 'Tối ưu hóa ngân sách: tư vấn phương án nên tự xây hay mua sẵn, tránh lãng phí vào tính năng thừa.', 'Budget optimization: build vs. buy analysis, eliminate costly unnecessary features.', 2),
  (p2_id, 'Lộ trình triển khai rõ ràng: tài liệu đề xuất giải pháp (Architecture & Proposal) chi tiết, minh bạch.', 'Actionable implementation roadmap: detailed Architecture & Proposal document.', 3);

  -- Gói 3: Đồng hành & Bảo trì hệ thống
  insert into public.pricing_plans (
    sort_order, is_featured,
    badge_vi, badge_en,
    title_vi, title_en,
    tagline_vi, tagline_en,
    audience_vi, audience_en,
    cta_text_vi, cta_text_en
  ) values (
    3, false,
    'Dài hạn & Vững tâm', 'Long-term Peace of Mind',
    'Đồng hành & Bảo trì hệ thống', 'Long-term Tech Partnership & SLA',
    'Hỗ trợ kỹ thuật dài hạn, bảo mật, sao lưu định kỳ và nâng cấp tính năng liên tục cho website & hạ tầng của bạn.',
    'Ongoing technical support, security hardening, automated backups, and iterative feature development for your digital infrastructure.',
    'Doanh nghiệp đã có website, hosting, mail server hoặc phần mềm nhưng không có đội IT nội bộ, cần một "Kỹ sư công nghệ ruột".',
    'Businesses with existing web platforms or mail infrastructure needing a reliable on-demand technology partner.',
    'Đăng ký bảo trì & Đồng hành', 'Inquire Partnership'
  ) returning id into p3_id;

  insert into public.pricing_plan_benefits (plan_id, text_vi, text_en, sort_order) values
  (p3_id, 'Vận hành liên tục 24/7: giám sát Uptime, quét mã độc, gia hạn tên miền/SSL và sao lưu dữ liệu tự động.', '24/7 continuous operation: uptime monitoring, malware scan, auto-backups, SSL renewals.', 1),
  (p3_id, 'Xử lý sự cố ưu tiên: hỗ trợ kỹ thuật trực tiếp qua Hotline/Zalo, cam kết phản hồi và xử lý nhanh chóng.', 'Priority incident response: direct escalation via Hotline/Zalo with guaranteed response SLA.', 2),
  (p3_id, 'Nâng cấp linh hoạt: tối ưu tốc độ tải trang, cập nhật bảo mật và bổ sung tính năng theo đà tăng trưởng.', 'Flexible evolutions: performance tuning, security patches, and incremental feature upgrades.', 3);
end $$;


-- 6. ĐÁNH GIÁ CỦA KHÁCH HÀNG / ĐỒNG NGHIỆP (testimonials)
delete from public.testimonials;
insert into public.testimonials (name, role_vi, role_en, quote_vi, quote_en, sort_order) values
(
  'Anh Luân',
  'CEO & Nhà sáng lập, Bán lẻ B2B',
  'CEO & Founder, Retail Enterprise',
  'Toàn tư vấn rất thẳng thắn, cái gì hệ thống làm được thì nói được, cái gì chưa nên làm vì tốn chi phí Toàn cũng phân tích rõ. Sau buổi demo POC, ban giám đốc chúng tôi chốt phương án rất nhanh vì thấy được ngay bài toán kho của mình được giải quyết thế nào.',
  'Toan consulted with complete transparency – clearly defining what the system could handle and advising against costly unnecessary features. Following the POC demo, our board made the decision swiftly because we saw exactly how our inventory bottleneck would be resolved.',
  1
),
(
  'Chị Mai Phương',
  'Giám đốc Vận hành, Chuỗi F&B',
  'COO, F&B Chain',
  'Trước đây chuỗi chúng tôi bị phụ thuộc phí chiết khấu app quá lớn. Toàn đã tư vấn xây dựng kênh web đặt món riêng kết hợp email server nội bộ. Kết quả là tỷ lệ đơn trực tiếp tăng rõ rệt, tiết kiệm được chi phí hoa hồng đáng kể mỗi tháng.',
  'Our chain previously suffered heavy commission fees from third-party delivery apps. Toan consulted on deploying our own direct web ordering channel paired with a dedicated corporate mail server, noticeably boosting direct orders and saving substantial monthly commission.',
  2
),
(
  'Chị Điệp',
  'Khách hàng doanh nghiệp',
  'Corporate Client',
  'Toàn làm việc khá chỉn chu, biết cách đặt câu hỏi để làm rõ nhu cầu và trình bày giải pháp một cách dễ hiểu. Đây là điểm mạnh trong quá trình tư vấn khách hàng.',
  'Toan is thorough and meticulous, knows how to ask the right questions to clarify business needs, and presents technical solutions clearly. A true strength when dealing with corporate clients.',
  3
),
(
  'Chú Hòa',
  'Đồng nghiệp lâu năm',
  'Senior Colleague',
  'Một người ham học hỏi, có tư duy phân tích và luôn sẵn sàng tiếp nhận những ý kiến đóng góp. Toàn có tinh thần cầu tiến và khả năng thích nghi tốt với môi trường làm việc.',
  'An eager learner with sharp analytical thinking who always embraces feedback. Toan exhibits great drive and high adaptability in any technical environment.',
  4
);


-- 7. DỰ ÁN TIÊU BIỂU (case_studies)
alter table public.case_studies add column if not exists title_vi text;
alter table public.case_studies add column if not exists title_en text;

delete from public.case_studies;
insert into public.case_studies (
  sort_order, is_active,
  industry_vi, industry_en,
  title_vi, title_en,
  demo_url,
  problem_vi, problem_en,
  solution_vi, solution_en,
  result_vi, result_en
) values
(
  1, true,
  'DỊCH VỤ • Bán lẻ & F&B', 'SERVICE • Retail & F&B',
  'Nhíp Bạc – Website Dịch Vụ Thư Giãn & Đặt Hẹn Tự Động',
  'Nhip Bac – Relaxing Service & Auto Booking Website',
  'https://nhipbac.com',
  'Dịch vụ nhổ tóc bạc thư giãn chuyên biệt tại Phú Mỹ Hưng cần kênh tiếp thị số tinh tế, giúp khách hàng dễ tìm kiếm và chủ động đặt lịch.',
  'A specialized hair care service in Phu My Hung needed a discrete digital presence to reach high-end clientele and automate appointments.',
  'Thiết kế giao diện thanh lịch chuẩn nhận diện thương hiệu, tối ưu SEO từ khóa địa phương và tích hợp kênh tương tác nhanh qua Zalo & Hotline.',
  'Designed a Zen Minimalist mobile-first website, optimized local SEO schema, and integrated seamless 1-tap booking via Zalo & Hotline.',
  'Tăng 25% tỷ lệ khách hàng đặt hẹn trực tuyến, định vị thương hiệu chỉn chu và lên top tìm kiếm Google tại khu vực Quận 7.',
  'Boosted online appointment rate by 25%, elevated brand positioning, and achieved top Google search ranking in District 7.'
),
(
  2, true,
  'WEB APP • Game Visual Novel', 'WEB APP • Interactive Visual Novel',
  'Ánh Sáng Sau Màn Hình – Web App Tương Tác Kể Chuyện Sinh Tồn',
  'Light Behind The Screen – Interactive Survival Web App',
  'https://light-behind-the-screen.vercel.app',
  'Phát triển trò chơi thể loại Visual Novel sinh tồn hậu đại dịch chạy trực tiếp mượt mà trên mọi trình duyệt web mà không bắt người chơi tải app nặng.',
  'Developing a post-pandemic survival interactive visual novel that runs at 60fps on web browsers without requiring heavy downloads.',
  'Xây dựng kiến trúc Single Page Application (SPA), xử lý phân nhánh cốt truyện linh hoạt, nén asset tối ưu và tích hợp Web Audio API cho âm thanh sống động.',
  'Architected an SPA with flexible branching narrative state machine, hardware-accelerated transitions, and Web Audio API integration.',
  'Thời gian tải trang ban đầu dưới 1.2s, khung hình ổn định 60fps trên cả mobile và PC, triển khai CI/CD tự động trên Vercel Edge.',
  'Initial load time under 1.2s, rock-solid 60fps frame rate across mobile and desktop, automated CI/CD deployed globally on Vercel Edge.'
),
(
  3, true,
  'BÁN LẺ • Quản trị chuỗi', 'RETAIL • POS & Inventory',
  'Hệ Thống Quản Lý Bán Lẻ & Đồng Bộ Tồn Kho Đa Chi Nhánh',
  'Multi-Branch Retail Management & Real-time Inventory POS',
  null,
  'Dữ liệu tồn kho bị trễ giữa các cửa hàng và kênh online, dẫn đến quá tải đối soát và sót đơn hàng.',
  'Severe inventory latency between physical chain stores and online channels causing overselling and reconciliation bottlenecks.',
  'Xây dựng phần mềm POS bán hàng tập trung, tích hợp quản lý kho và đối soát thanh toán đa cổng tự động.',
  'Engineered a centralized cloud POS software integrating warehouse management, real-time webhooks, and barcode scanner APIs.',
  'Giảm 90% thất thoát và chênh lệch kho, xử lý đơn nhanh gấp 3 lần tại 15 điểm bán.',
  'Reduced inventory discrepancies by 90% and accelerated checkout throughput 3x across 15 retail outlets.'
),
(
  4, true,
  'F&B • Web Đặt Món & Mail Server', 'F&B • Online Ordering & Mail Server',
  'Website Đặt Món Trực Tuyến & Hạ Tầng Mail Server Doanh Nghiệp',
  'Direct Online Food Ordering & Corporate Mail Infrastructure',
  null,
  'Phụ thuộc phí chiết khấu cao từ app giao hàng bên thứ ba và hệ thống email tên miền hay rơi vào hộp thư rác (spam).',
  'High commission fees from 3rd-party delivery apps and company domain emails frequently flagged as spam by Gmail/Outlook.',
  'Thiết kế web đặt món online trực tiếp, menu quét mã QR tại bàn kết hợp cấu hình hạ tầng Mail Server doanh nghiệp chuẩn SPF/DKIM.',
  'Built a direct online food ordering web app with QR digital table menu, coupled with a dedicated clean-IP Mail Server with SPF/DKIM/DMARC.',
  'Tự chủ 45% lượng đơn giao tận nơi, tăng tỷ lệ gửi email tiếp thị và xác nhận hóa đơn vào Inbox đạt 99.8%.',
  'Shifted 45% regular orders directly to the website, saving significant monthly commission; achieved 99.8% Inbox delivery rate.'
);
