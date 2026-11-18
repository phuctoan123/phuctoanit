/**
 * i18n.js — Bilingual (EN / VI) language switcher
 * Approach : data-i18n / data-i18n-html attributes + embedded translation objects.
 * No build step, no network fetch → works on GitHub Pages, Netlify, Vercel, local file://.
 *
 * HƯỚNG DẪN CHỈNH SỬA NỘI DUNG (EDIT TRANSLATIONS):
 * - Toàn bộ chữ tiếng Việt và tiếng Anh bên dưới đều lưu ở dạng chữ rõ ràng (UTF-8).
 * - Bạn có thể thoải mái đọc, thêm, bớt hoặc chỉnh sửa câu chữ trong dấu nháy đơn '...'.
 * - Lưu ý: KHÔNG thay đổi tên các khóa bên trái (như title, heading, p1, li1...) vì chúng liên kết với index.html.
 */
(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSLATION DICTIONARIES (TỪ ĐIỂN DỊCH THUẬT)
  // ═══════════════════════════════════════════════════════════════════════════
  var translations = {

    // ── ENGLISH (TIẾNG ANH) ──────────────────────────────────────────────────
    en: {
      meta: {
        title: 'Phuc Toan Nguyen – Sales Engineer',
        og_title: 'Phuc Toan Nguyen – Sales Engineer',
        description: 'Sales Specialist representing a reputable technology company with 15+ years of experience in demo and technology consulting – Website, Hosting, Domain, Mail Server, Enterprise Software – for B2B businesses in Ho Chi Minh City and nationwide.'
      },
      nav: {
        home: 'Home',
        about: 'About Me',
        skills: 'Skills',
        services: 'Services',
        portfolio: 'Projects',
        testimonial: 'Testimonial',
        pricing: 'Collaboration',
        contact: 'Contact',
        lang_label: '<i class="fa-solid fa-globe" aria-hidden="true"></i> Language:'
      },
      banner: {
        designation: 'Sales Engineer',
        typed_strings: [
          'Sales Engineer',
          'Solution Consultant',
          'Pre-sales Specialist',
          'Tech Solutions Architect'
        ],
        tagline: 'Consulting & demoing technology solutions – the bridge between tech teams and enterprise clients.',
        cta_portfolio: 'View Projects',
        cta_contact: 'Send a Request'
      },
      promo: {
        heading: 'Representing a reputable company with <span class="bold">15+ years of experience</span> in technology solutions<span class="black">.</span>',
        sub: 'Specializing in Custom Web Development, Hosting, Domain, Mail Server &amp; Enterprise Software for B2B.'
      },
      about: {
        heading: 'About Me',
        p1: 'I am Phuc Toan – a Sales Specialist representing a reputable technology company with over 15 years of industry experience in Ho Chi Minh City. My role is to bridge the gap between the technical team and enterprise clients, translating business requirements into suitable and effective technology solutions.',
        // h3: 'Core Competencies',
        // li1: 'Product demo & building POC environments tailored to each client’s specific needs',
        // li2: 'Consulting on Website, Hosting, Mail Server, and multi-industry Management Software solutions',
        // li3: 'Analyzing business requirements, drafting proposals/RFPs, and supporting technical negotiations',
        // p2: 'I work directly with numerous B2B enterprises across retail, F&B, logistics, education, real estate, and manufacturing sectors – helping them find digital transformation solutions that align with their budget and growth roadmap.',
        h4: 'Work Philosophy:',
        p3: '"Listen to the client’s problem, propose practical solutions – never sell what the client doesn’t need, only recommend what truly creates value for their business."'
      },
      skill: {
        heading: 'My Skills & Expertise',
        p: 'With a solid technical foundation combined with hands-on sales experience, I confidently advise on and demo complex technology solutions in a clear, understandable way for both technical teams and executive decision-makers.',
        item1_title: 'Technical & Integration',
        item1_p: 'API/Integration, Cloud hosting, SQL, building demo/POC environments, Mail Server configuration, and web infrastructure setup on demand.',
        item2_title: 'Product & Solutions',
        item2_p: 'In-depth knowledge of the product portfolio, competitive analysis, writing RFPs/proposals, and comparing competitor solutions for each client’s specific problem.',
        item3_title: 'Presentation & Consulting',
        item3_p: 'Technical presentations for C-level executives, solution negotiation, consulting based on real client challenges, and guiding clients through the entire decision-making process.'
      },
      service: {
        heading: 'Services We Offer',
        sub: 'Accompanying you to elevate your brand',
        flip_hint: 'Explore Details',
        cta: 'Contact Now',

        item1_title: 'Website Design',
        item1_short: 'Modern UX/UI & Fast Speed',
        item1_f1: 'Custom & modern UX/UI',
        item1_f2: 'SEO & speed optimization',
        item1_f3: '100% Mobile responsive',
        item1_f4: 'Seamless API integration',

        item2_title: 'Web Hosting',
        item2_short: 'High Speed & 99.9% Uptime',
        item2_f1: '99.9% Uptime guarantee',
        item2_f2: 'High-speed NVMe storage',
        item2_f3: 'Free SSL & Firewall shield',
        item2_f4: 'Daily backups & 24/7 support',

        item3_title: 'Domain',
        item3_short: 'Secure Digital Identity',
        item3_f1: 'Full .VN & Global TLDs',
        item3_f2: 'Instant 5-min activation',
        item3_f3: 'Flexible DNS management',
        item3_f4: 'Brand identity protection',

        item4_title: 'Email Server',
        item4_short: 'Enterprise Custom Email',
        item4_f1: 'Custom domain @yourcompany',
        item4_f2: '99.9% High inbox delivery',
        item4_f3: 'Smart anti-spam & virus filter',
        item4_f4: 'Enterprise data encryption',

        item5_title: 'Software Outsourcing',
        item5_short: 'Custom Software & Dedicated Team',
        item5_f1: 'Custom Web App & Mobile App',
        item5_f2: 'Agile process & dedicated engineers',
        item5_f3: 'High security & clean architecture',
        item5_f4: 'Long-term maintenance & 24/7 SLA'
      },
      portfolio: {
        heading: 'Case Studies – Featured Projects',
        item1: 'Retail Industry Client',
        item2: 'F&B Industry Client',
        item3: 'Education Industry Client',
        item4: 'Logistics Industry Client',
        item5: 'Real Estate Industry Client',
        item6: 'Manufacturing Industry Client'
      },
      testimonial: {
        heading: 'What Clients & Colleagues Say About Me',

        item1_quote: 'Phuc Toan has a good ability to listen and understand customer needs. He takes the initiative to explore problems and propose solutions that align with real-world requirements.',
        item1_author: '— Mrs.Minh, <cite>Colleague</cite>',

        item2_quote: 'Throughout our collaboration, Toan has demonstrated a strong sense of responsibility, proactiveness, and the ability to bridge communication between clients and technical teams to keep projects on track.',
        item2_author: '— Ms.Lan, <cite>Project Manager</cite>',

        item3_quote: 'Toan is detail-oriented, knows how to ask the right questions to clarify requirements, and communicates solutions in an easy-to-understand way. These are valuable strengths in client consulting.',
        item3_author: '— Ms.Diep, <cite>Business Client</cite>',

        item4_quote: 'Toan is eager to learn, analytical, and always open to feedback. He demonstrates a growth mindset and adapts well to different working environments.',
        item4_author: '— Ms.Hoa, <cite>Colleague</cite>'
      },
      pricing: {
        heading: 'Collaboration Options',
        sub: 'Flexible to match your business needs and scale – from initial technical feasibility to complete delivery and long-term partnership.',
        audience_label: 'Best suited for:',
        benefits_label: 'Key benefits:',

        // Model 1: End-to-End Turnkey Project
        item1_badge: 'A - Z Delivery',
        item1_title: 'End-to-End Project',
        item1_tagline: 'Custom design & development for websites and web apps from initial concept to full operational handover.',
        item1_audience: 'SMEs, business owners, and startups looking to build or revamp their website, sales portal, or service platform.',
        item1_b1: 'Direct single point of contact: straightforward tech & business discussions without middle layers.',
        item1_b2: 'Complete A-Z handover: custom UX/UI design, SEO-optimized, 100% source code ownership.',
        item1_b3: 'Committed timeline & budget: transparent pricing from day one with zero hidden costs.',
        item1_cta: 'Get Project Quote',

        // Model 2: Solution Consulting & Demo / POC (Featured)
        featured_ribbon: 'Most Popular',
        item2_badge: 'Validate Before Investing',
        item2_title: 'Solution Consulting & POC Demo',
        item2_tagline: 'Technical problem analysis, architecture consulting, and building a live working prototype (POC) before major commitment.',
        item2_audience: 'Enterprises with complex workflows (retail chains, F&B, logistics) or digital transformation projects testing feasibility and budget.',
        item2_b1: 'Real-world experience before spending: test and interact with a prototype modeled on your actual operations.',
        item2_b2: 'Budget optimization: objective build vs. buy analysis to prevent wasted capital on redundant features.',
        item2_b3: 'Clear technology roadmap: detailed architecture and proposal documentation with concrete comparisons.',
        item2_cta: 'Book Consulting & Demo',

        // Model 3: Maintenance & Dedicated Partnership
        item3_badge: 'Dedicated & Long-term',
        item3_title: 'Maintenance & Partnership',
        item3_tagline: 'Long-term technical support, system security, daily backups, and ongoing feature updates for your web infrastructure.',
        item3_audience: 'Businesses that already own websites, hosting, or software but lack in-house IT, needing a reliable "in-house engineer".',
        item3_b1: '24/7 continuous operation: uptime monitoring, malware scanning, SSL renewals, and automated backups.',
        item3_b2: 'Priority incident resolution: fast emergency response via Hotline/Zalo within 30-60 minutes.',
        item3_b3: 'Flexible scalability: regular speed optimization, security patching, and new feature additions as you grow.',
        item3_cta: 'Join Maintenance Partnership'
      },
      contact: {
        heading: 'Get in Touch',
        detail: 'Looking for a technology solution for your business? Let me listen to your problem and find the best path forward together. Based in Ho Chi Minh City, supporting clients nationwide.',
        email_label: 'Email:',
        phone_label: 'Phone / Zalo:',
        linkedin_label: 'LinkedIn:',
        address: 'Ho Chi Minh City, Vietnam',
        address_note: '(Nationwide support, priority in HCMC area)',
        /* ── Contact Form ── */
        form_name_label: 'Full Name',
        form_name_ph: 'Phuc Toan Nguyen',
        form_name_err: 'Please enter your full name.',
        form_company_label: 'Business / Company Name',
        form_company_ph: 'ABC Company',
        form_phone_label: 'Phone / Zalo',
        form_phone_ph: '0912 345 678',
        form_phone_err: 'Invalid VN phone number (e.g. 0912345678).',
        form_email_label: 'Email',
        form_email_ph: 'email@company.com',
        form_email_err: 'Please enter a valid email address.',
        form_service_label: 'Service:',
        form_service_chip1: 'Website Design',
        form_service_chip2: 'Web Hosting',
        form_service_chip3: 'Domain & SSL',
        form_service_chip4: 'Enterprise Email Server',
        form_service_chip5: 'Management Software / Other',
        form_service_chip6: 'Software Outsourcing',
        form_service_chip7: 'New to Websites / Need Consultation',
        /* ── Multi-Step Wizard Keys ── */
        step1_title: '1. Solutions',
        step2_title: '2. Contact Info',
        step3_title: '3. Request & Send',
        step1_heading: 'Which technology solutions is your business looking for?',
        step1_sub: 'Select one or more services below to receive the most tailored consultation.',
        step1_err: 'Please select at least one solution / service to proceed.',
        software_details_label: 'Industry or Team Size',
        software_details_ph: 'E.g. Retail, F&B, Logistics, 10-30 employees...',
        step2_heading: 'Contact Person & Business Details',
        step2_sub: 'Sales Engineer Phuc Toan will reach out directly for confidential technical discussion.',
        step3_heading: 'Describe Your Technical Requirements',
        step3_sub: 'Share your goals, estimated budget, or desired deployment timeline.',
        recap_label: 'Selected Solutions:',
        btn_next: 'Continue',
        btn_back: 'Back',
        btn_zalo_quick: 'Direct Zalo Chat (0913.365.842)',
        trust_commitment: 'Absolute Data Privacy • Guaranteed Technical Response within 30 Working Minutes.',
        success_title: 'Consultation Request Recorded Successfully!',
        btn_reset_form: 'Submit Another Request',
        form_service_opt0: '-- Select a service --',
        form_service_opt1: 'Website Design',
        form_service_opt2: 'Web Hosting',
        form_service_opt3: 'Domain',
        form_service_opt4: 'Email Server',
        form_service_opt5: 'Software Solutions / Other',
        form_msg_label: 'Message / Specific Requirements',
        form_msg_ph: 'Describe your needs or the problem you are facing...',
        form_msg_err: 'Please describe your requirements.',
        form_submit: 'SEND CONSULTATION REQUEST',
        form_sending: 'Sending...',
        form_success: 'Thank you for reaching out! I will get back to you as soon as possible.'
      },
      footer: {
        desc: 'Sales Specialist representing a reputable technology company with 15+ years of experience consulting and demoing technology solutions for B2B enterprises in Ho Chi Minh City and nationwide. Specializing in: Custom Website Design, Hosting, Domain, Mail Server, Multi-industry Management Software.',
        copyright: 'Copyright &copy; <time datetime="2026">2026</time> Phuc Toan. All rights reserved. Designed by <a href="https://www.facebook.com/phuctoansales" target="_blank" rel="noopener noreferrer">Phuc Toan Nguyen</a>'
      },
      toast: {
        title: 'Need a tech solution?',
        sub: 'Response within 2 business hours.',
        cta: 'Send now →'
      }
    },

    // ── VIETNAMESE (TIẾNG VIỆT) ──────────────────────────────────────────────
    vi: {
      meta: {
        title: 'Nguyễn Phúc Toàn – Kỹ sư Giải pháp',
        og_title: 'Nguyễn Phúc Toàn – Kỹ sư Giải pháp',
        description: 'Sales Specialist đại diện công ty công nghệ uy tín có 15+ năm kinh nghiệm hỗ trợ demo, tư vấn giải pháp công nghệ – Website, Hosting, Domain, Mail Server, Phần mềm quản lý – cho doanh nghiệp B2B tại TP.HCM và toàn quốc.'
      },
      nav: {
        home: 'Trang chủ',
        about: 'Giới thiệu',
        skills: 'Kỹ năng',
        services: 'Dịch vụ',
        portfolio: 'Dự án',
        testimonial: 'Nhận xét',
        pricing: 'Hợp tác',
        contact: 'Liên hệ',
        lang_label: '<i class="fa-solid fa-globe" aria-hidden="true"></i> Ngôn ngữ:'
      },
      banner: {
        designation: 'Tư vấn Giải pháp',
        typed_strings: [
          'Tư vấn Giải pháp',
          'Ứng dụng CNTT',
          'Marketing online',
          'Hỗ trợ chuyển đổi số'
        ],
        tagline: 'Tư vấn & đề xuất giải pháp công nghệ – cầu nối giữa đội kỹ thuật và khách hàng doanh nghiệp.',
        cta_portfolio: 'Xem dự án',
        cta_contact: 'Gửi yêu cầu tư vấn'
      },
      promo: {
        heading: 'Đại diện công ty uy tín có <span class="bold">15+ năm kinh nghiệm</span> giải pháp công nghệ<span class="black">.</span>',
        sub: 'Thiết kế Website, Hosting, Domain, Mail Server & Phần mềm quản lý cho hộ kinh doanh, doanh nghiệp.'
      },
      about: {
        heading: 'Giới thiệu',
        p1: 'Tôi là Phúc Toàn – chuyên viên Sales đại diện cho một công ty công nghệ uy tín có hơn 15 năm kinh nghiệm tại TP. Hồ Chí Minh. Vai trò của tôi là cầu nối giữa đội ngũ kỹ thuật và khách hàng doanh nghiệp, giúp chuyển hoá yêu cầu kinh doanh thành các giải pháp công nghệ phù hợp và hiệu quả.',
        h3: 'Thế mạnh chuyên môn',
        // li1: 'Demo sản phẩm & dựng môi trường POC theo yêu cầu riêng của từng khách hàng',
        // li2: 'Tư vấn giải pháp Website, Hosting, Mail Server, Phần mềm quản lý đa ngành',
        // li3: 'Phân tích bài toán nghiệp vụ, lập proposal/RFP và hỗ trợ đàm phán kỹ thuật',
        // p2: 'Tôi làm việc trực tiếp với nhiều doanh nghiệp B2B thuộc các ngành bán lẻ, F&B, logistics, giáo dục, bất động sản và sản xuất – giúp họ tìm ra giải pháp số hoá phù hợp với ngân sách và lộ trình phát triển thực tế.',
        h4: 'Phương châm làm việc:',
        p3: '"Lắng nghe bài toán của khách hàng, đề xuất giải pháp thực tế – không bán những gì khách không cần, chỉ tư vấn những gì thực sự tạo ra giá trị cho doanh nghiệp."'
      },
      skill: {
        heading: 'Kỹ năng & chuyên môn',
        p: 'Với nền tảng kỹ thuật vững chắc kết hợp kỹ năng bán hàng thực chiến, tôi tự tin tư vấn và demo các giải pháp công nghệ phức tạp một cách rõ ràng, dễ hiểu cho cả đội kỹ thuật lẫn ban lãnh đạo khách hàng.',
        item1_title: 'Kỹ thuật & Tích hợp',
        item1_p: 'API/Integration, Cloud hosting, SQL, dựng môi trường demo/POC, cấu hình Mail Server và hạ tầng web theo yêu cầu.',
        item2_title: 'Sản phẩm & Giải pháp',
        item2_p: 'Hiểu sâu danh mục sản phẩm công ty, phân tích cạnh tranh, viết RFP/proposal và so sánh giải pháp đối thủ cho từng bài toán khách hàng.',
        item3_title: 'Thuyết trình & Tư vấn',
        item3_p: 'Thuyết trình kỹ thuật cho C-level, đàm phán giải pháp, tư vấn theo bài toán thực tế và dẫn dắt khách hàng qua toàn bộ chu trình ra quyết định.'
      },
      service: {
        heading: 'Dịch vụ chúng tôi cung cấp',
        sub: 'Đồng hành cùng bạn nâng tầm thương hiệu',
        flip_hint: 'Xem chi tiết',
        cta: 'Tư vấn ngay',

        item1_title: 'Thiết kế Website',
        item1_short: 'Chuẩn UX/UI & Tối ưu tốc độ',
        item1_f1: 'Giao diện độc quyền chuẩn UX/UI',
        item1_f2: 'Tối ưu SEO & tốc độ tải trang',
        item1_f3: 'Tương thích 100% mọi thiết bị',
        item1_f4: 'Dễ dàng mở rộng & kết nối API',

        item2_title: 'Web hosting',
        item2_short: 'Tốc độ cao & Uptime 99.9%',
        item2_f1: 'Cam kết Uptime ổn định 99.9%',
        item2_f2: 'Ổ cứng NVMe siêu tốc độ',
        item2_f3: 'Tặng chứng chỉ SSL & Firewall',
        item2_f4: 'Sao lưu mỗi ngày & Hỗ trợ 24/7',

        item3_title: 'Domain',
        item3_short: 'Khẳng định thương hiệu số',
        item3_f1: 'Đầy đủ tên miền .VN & Quốc tế',
        item3_f2: 'Kích hoạt nhanh trong 5 phút',
        item3_f3: 'Hệ thống quản lý DNS bảo mật',
        item3_f4: 'Bảo hộ nhận diện thương hiệu',

        item4_title: 'Email Server',
        item4_short: 'Hệ thống email theo tên miền',
        item4_f1: 'Email theo tên miền riêng công ty',
        item4_f2: 'Tỷ lệ vào thẳng Inbox cao 99.9%',
        item4_f3: 'Bộ lọc chống Spam & Virus tối tân',
        item4_f4: 'Mã hóa dữ liệu & Bảo mật cao cấp',

        item5_title: 'Dịch vụ phát triển phần mềm',
        item5_short: 'Gia công theo yêu cầu & Chuẩn Agile',
        item5_f1: 'Phát triển Web App & Mobile App',
        item5_f2: 'Đội ngũ chuyên nghiệp, chuẩn Agile',
        item5_f3: 'Bảo mật cao & Mã nguồn tối ưu',
        item5_f4: 'Bảo hành & Hỗ trợ kỹ thuật 24/7'
      },
      portfolio: {
        heading: 'Dự án tiêu biểu',
        item1: 'Khách hàng ngành Bán lẻ',
        item2: 'Khách hàng ngành F&B',
        item3: 'Khách hàng ngành Giáo dục',
        item4: 'Khách hàng ngành Logistics',
        item5: 'Khách hàng ngành Bất động sản',
        item6: 'Khách hàng ngành Sản xuất'
      },
      testimonial: {
        heading: 'Khách hàng & đồng nghiệp nói gì về tôi',

        item1_quote: 'Phúc Toàn có khả năng lắng nghe và nắm bắt nhu cầu khách hàng khá tốt. Luôn chủ động tìm hiểu vấn đề và đưa ra những đề xuất phù hợp với yêu cầu thực tế.',
        item1_author: '— Anh Minh, <cite>Đồng nghiệp</cite>',

        item2_quote: 'Trong quá trình làm việc, Toàn thể hiện sự trách nhiệm, chủ động và có khả năng kết nối giữa khách hàng với đội ngũ kỹ thuật để đảm bảo công việc được triển khai đúng hướng.',
        item2_author: '— Chị Lan, <cite>Quản lý dự án</cite>',

        item3_quote: 'Toàn làm việc khá chỉn chu, biết cách đặt câu hỏi để làm rõ nhu cầu và trình bày giải pháp một cách dễ hiểu. Đây là điểm mạnh trong quá trình tư vấn khách hàng.',
        item3_author: '— Chị Điệp, <cite>Khách hàng doanh nghiệp</cite>',

        item4_quote: 'Một người ham học hỏi, có tư duy phân tích và luôn sẵn sàng tiếp nhận những ý kiến đóng góp. Toàn có tinh thần cầu tiến và khả năng thích nghi tốt với môi trường làm việc.',
        item4_author: '— Chú Hòa, <cite>Đồng nghiệp</cite>'
      },
      pricing: {
        heading: 'Hình thức hợp tác',
        sub: 'Linh hoạt theo nhu cầu và quy mô thực tế của doanh nghiệp – từ khảo sát bài toán ban đầu đến triển khai và đồng hành dài hạn.',
        audience_label: 'Phù hợp nhất với:',
        benefits_label: 'Giá trị nhận được:',

        // Model 1: Dự án trọn gói
        item1_badge: 'Triển khai A - Z',
        item1_title: 'Dự án trọn gói',
        item1_tagline: 'Thiết kế & phát triển website, ứng dụng chuẩn chỉnh từ ý tưởng sơ khởi đến khi bàn giao vận hành thực tế.',
        item1_audience: 'Doanh nghiệp SME, chủ kinh doanh, startup cần xây mới hoặc nâng cấp toàn diện website, phần mềm bán hàng hay cổng dịch vụ.',
        item1_b1: 'Làm việc trực tiếp 1 đầu mối: trao đổi kỹ thuật & kinh doanh thẳng thắn, không qua trung gian.',
        item1_b2: 'Bàn giao trọn gói A-Z: giao diện độc quyền chuẩn UX/UI, tối ưu SEO, bàn giao 100% mã nguồn.',
        item1_b3: 'Cam kết tiến độ & ngân sách: báo giá minh bạch ngay từ đầu, không phát sinh chi phí ẩn.',
        item1_cta: 'Nhận báo giá dự án',

        // Model 2: Tư vấn giải pháp & Dựng Demo / POC (Nổi bật)
        featured_ribbon: 'Được chọn nhiều nhất',
        item2_badge: 'Kiểm chứng trước khi đầu tư',
        item2_title: 'Tư vấn giải pháp & Dựng Demo / POC',
        item2_tagline: 'Khảo sát bài toán kỹ thuật, tư vấn kiến trúc và dựng môi trường chạy thử nghiệm (POC) trước khi ra quyết định đầu tư lớn.',
        item2_audience: 'Doanh nghiệp có bài toán quản lý, chuỗi bán lẻ, F&B, logistics hoặc chuyển đổi số cần kiểm chứng tính khả thi và chi phí.',
        item2_b1: 'Trải nghiệm thực tế trước khi chi tiền: thao tác thử trên hệ thống mẫu sát với luồng vận hành thực.',
        item2_b2: 'Tối ưu hóa ngân sách: tư vấn phương án nên tự xây hay mua sẵn, tránh lãng phí vào tính năng thừa.',
        item2_b3: 'Lộ trình triển khai rõ ràng: tài liệu đề xuất giải pháp (Architecture & Proposal) chi tiết, minh bạch.',
        item2_cta: 'Đặt lịch tư vấn giải pháp',

        // Model 3: Hợp tác đồng hành & Bảo trì hệ thống
        item3_badge: 'Dài hạn & Vững tâm',
        item3_title: 'Đồng hành & Bảo trì hệ thống',
        item3_tagline: 'Hỗ trợ kỹ thuật dài hạn, bảo mật, sao lưu định kỳ và nâng cấp tính năng liên tục cho website & hạ tầng của bạn.',
        item3_audience: 'Doanh nghiệp đã có website, hosting, mail server hoặc phần mềm nhưng không có đội IT nội bộ, cần một "Kỹ sư công nghệ ruột".',
        item3_b1: 'Vận hành liên tục 24/7: giám sát Uptime, quét mã độc, gia hạn tên miền/SSL và sao lưu dữ liệu tự động.',
        item3_b2: 'Xử lý sự cố ưu tiên: hỗ trợ kỹ thuật trực tiếp qua Hotline/Zalo, cam kết phản hồi và xử lý nhanh chóng.',
        item3_b3: 'Nâng cấp linh hoạt: tối ưu tốc độ tải trang, cập nhật bảo mật và bổ sung tính năng theo đà tăng trưởng.',
        item3_cta: 'Đăng ký bảo trì & Đồng hành'
      },
      contact: {
        heading: 'Liên hệ trao đổi',
        detail: 'Bạn đang tìm giải pháp công nghệ cho doanh nghiệp? Hãy để tôi lắng nghe bài toán của bạn và cùng tìm ra hướng đi phù hợp nhất. Hỗ trợ toàn quốc, ưu tiên hơn một chút ở TP.HCM.',
        email_label: 'Email:',
        phone_label: 'Điện thoại / Zalo:',
        linkedin_label: 'LinkedIn:',
        address: 'TP. Hồ Chí Minh, Việt Nam',
        address_note: '(Hỗ trợ toàn quốc, ưu tiên khu vực TP.HCM)',
        /* ── Biểu mẫu liên hệ ── */
        form_name_label: 'Họ và tên',
        form_name_ph: 'Tên của Anh/Chị....',
        form_name_err: 'Anh/Chị chưa điền họ và tên',
        form_company_label: 'Tên Hộ kinh doanh / Công ty',
        form_company_ph: 'Tiệm, quán ăn, Công ty ABC',
        form_phone_label: 'Số điện thoại / Zalo',
        form_phone_ph: '0912 345 678',
        form_phone_err: 'Số điện thoại VN không hợp lệ (VD: 0912345678).',
        form_email_label: 'Email',
        form_email_ph: 'email@company.com',
        form_email_err: 'Vui lòng nhập email hợp lệ.',
        form_service_label: 'Dịch vụ quan tâm',
        form_service_chip1: 'Thiết kế Website',
        form_service_chip2: 'Web Hosting',
        form_service_chip3: 'Domain & SSL',
        form_service_chip4: 'Email Server Doanh nghiệp',
        form_service_chip5: 'Phần mềm quản lý / Khác',
        form_service_chip6: 'Dịch vụ phát triển phần mềm theo yêu cầu',
        form_service_chip7: 'Tôi chưa biết gì về Website',
        /* ── Multi-Step Wizard Keys ── */
        step1_title: '1. Chọn giải pháp',
        step2_title: '2. Thông tin liên hệ',
        step3_title: '3. Yêu cầu & Gửi',
        step1_heading: 'Doanh nghiệp của bạn đang quan tâm đến giải pháp nào?',
        step1_sub: 'Chọn một hoặc nhiều dịch vụ bên dưới để nhận tư vấn phù hợp nhất.',
        step1_err: 'Vui lòng chọn ít nhất một giải pháp / dịch vụ để tiếp tục.',
        software_details_label: 'Ngành nghề kinh doanh hoặc quy mô nhân sự',
        software_details_ph: 'VD: Bán lẻ, F&B, Logistics, 10-30 nhân sự...',
        step2_heading: 'Thông tin người liên hệ & Doanh nghiệp',
        step2_sub: 'Kỹ sư Phúc Toàn sẽ liên hệ trực tiếp để trao đổi kỹ thuật chuyên sâu và bảo mật thông tin.',
        step3_heading: 'Mô tả chi tiết bài toán kỹ thuật của bạn',
        step3_sub: 'Chia sẻ mục tiêu, ngân sách dự kiến hoặc thời gian bạn muốn triển khai để có giải pháp chính xác nhất.',
        recap_label: 'Giải pháp đã chọn:',
        btn_next: 'Tiếp tục',
        btn_back: 'Quay lại',
        btn_zalo_quick: 'Chat Zalo trực tiếp ngay (0913.365.842)',
        trust_commitment: 'Bảo mật thông tin tuyệt đối • Cam kết phản hồi tư vấn kỹ thuật trong vòng 30 phút làm việc.',
        success_title: 'Yêu cầu tư vấn đã được ghi nhận thành công!',
        btn_reset_form: 'Gửi thêm yêu cầu khác',
        form_service_opt0: '-- Chọn dịch vụ --',
        form_service_opt1: 'Thiết kế Website',
        form_service_opt2: 'Web Hosting',
        form_service_opt3: 'Domain',
        form_service_opt4: 'Email Server',
        form_service_opt5: 'Giải pháp phần mềm / Khác',
        form_msg_label: 'Nội dung trao đổi / Yêu cầu cụ thể',
        form_msg_ph: 'Mô tả nhu cầu, vấn đề bạn đang gặp phải hoặc để trống',
        form_msg_err: 'Vui lòng nhập nội dung cần trao đổi.',
        form_submit: 'GỬI YÊU CẦU',
        form_sending: 'Đang gửi...',
        form_success: 'Cảm ơn anh/chị đã yêu cầu! Phúc Toàn sẽ liên hệ lại trong thời gian sớm nhất.'
      },
      footer: {
        desc: 'Sales Specialist đại diện cho công ty công nghệ uy tín có hơn 15 năm kinh nghiệm tư vấn và demo giải pháp công nghệ cho doanh nghiệp B2B tại TP. Hồ Chí Minh và toàn quốc. Thiết kế Website theo yêu cầu, Hosting, Domain, Mail Server, Phần mềm quản lý đa ngành nghề.',
        copyright: 'Copyright &copy; <time datetime="2026">2026</time> Phuc Toan. All rights reserved. Designed by <a href="https://www.facebook.com/phuctoansales" target="_blank" rel="noopener noreferrer">Phuc Toan Nguyen</a>'
      },
      toast: {
        title: 'Bạn cần tư vấn giải pháp?',
        sub: 'Phản hồi trong vòng 2 giờ làm việc.',
        cta: 'Gửi ngay →'
      }
    }

  }; // end translations

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS (HÀM BỔ TRỢ)
  // ═══════════════════════════════════════════════════════════════════════════

  /** Resolve a dot-notation path like "about.p1" into a value from the dict. */
  function get(dict, path) {
    if (!path) return null;
    var parts = path.split('.');
    var curr = dict;
    for (var i = 0; i < parts.length; i++) {
      if (curr === null || curr === undefined) return null;
      curr = curr[parts[i]];
    }
    return curr !== undefined ? curr : null;
  }

  /** Update a <meta> tag by attribute selector. */
  function setMeta(attr, value, content) {
    var el = document.querySelector('meta[' + attr + '="' + value + '"]');
    if (el && content) el.setAttribute('content', content);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // APPLY TRANSLATIONS (CẬP NHẬT GIAO DIỆN KHI CHUYỂN NGÔN NGỮ)
  // ═══════════════════════════════════════════════════════════════════════════
  function applyTranslations(lang) {
    var dict = translations[lang];
    if (!dict) {
      console.warn('i18n: unknown language "' + lang + '"');
      return;
    }

    // 1. Plain text nodes  →  data-i18n="key.path"
    var textNodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textNodes.length; i++) {
      var el = textNodes[i];
      var key = el.getAttribute('data-i18n');
      var val = get(dict, key);
      if (val !== null) el.textContent = val;
    }

    // 2. HTML content (spans, cite tags…) → data-i18n-html="key.path"
    var htmlNodes = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlNodes.length; j++) {
      var hEl = htmlNodes[j];
      var hKey = hEl.getAttribute('data-i18n-html');
      var hVal = get(dict, hKey);
      if (hVal !== null) hEl.innerHTML = hVal;
    }

    // 3. Placeholder text  →  data-i18n-placeholder="key.path"
    var phNodes = document.querySelectorAll('[data-i18n-placeholder]');
    for (var p = 0; p < phNodes.length; p++) {
      var phEl = phNodes[p];
      var phKey = phEl.getAttribute('data-i18n-placeholder');
      var phVal = get(dict, phKey);
      if (phVal !== null) phEl.setAttribute('placeholder', phVal);
    }

    // 4. Option text inside <select>  →  data-i18n on <option>
    var optNodes = document.querySelectorAll('option[data-i18n]');
    for (var o = 0; o < optNodes.length; o++) {
      var optEl = optNodes[o];
      var optKey = optEl.getAttribute('data-i18n');
      var optVal = get(dict, optKey);
      if (optVal !== null) optEl.textContent = optVal;
    }

    // 5. <html lang="…">
    document.documentElement.setAttribute('lang', lang);

    // 6. <title> and meta tags
    if (dict.meta) {
      if (dict.meta.title) document.title = dict.meta.title;
      if (dict.meta.og_title) {
        setMeta('property', 'og:title', dict.meta.og_title);
        setMeta('name', 'twitter:title', dict.meta.og_title);
      }
      if (dict.meta.description) {
        setMeta('property', 'og:description', dict.meta.description);
        setMeta('name', 'twitter:description', dict.meta.description);
      }
    }

    // 7. Mark active state on ALL switcher buttons (both header and drawer)
    var buttons = document.querySelectorAll('.lang-btn');
    for (var k = 0; k < buttons.length; k++) {
      var btn = buttons[k];
      var isActive = (btn.getAttribute('data-lang') === lang);
      btn.classList.toggle('lang-btn--active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }

    // 8. Persist to localStorage
    try {
      localStorage.setItem('preferred-lang', lang);
    } catch (e) { }

    // 9. Update dynamic typewriter if active
    if (window.updateTypedText && typeof window.updateTypedText === 'function') {
      var typedList = (dict.banner && dict.banner.typed_strings) ? dict.banner.typed_strings : [dict.banner.designation];
      window.updateTypedText(typedList);
    }

    // 10. Refresh AOS scroll animations if loaded
    if (window.AOS && typeof window.AOS.refresh === 'function') {
      window.AOS.refresh();
    }

    // 11. Notify components of language change
    try {
      document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    } catch (e) { }
  }

  // Expose global helper for testing or programmatic switching
  window.setLanguage = applyTranslations;

  // ═══════════════════════════════════════════════════════════════════════════
  // INIT & GLOBAL CLICK DELEGATION
  // ═══════════════════════════════════════════════════════════════════════════
  function init() {
    var supported = Object.keys(translations);

    // Priority: localStorage → 'vi' (mặc định website là Tiếng Việt)
    var saved = null;
    try { saved = localStorage.getItem('preferred-lang'); } catch (e) { }

    var initial = (saved && supported.indexOf(saved) !== -1) ? saved : 'vi';

    applyTranslations(initial);

    // Event delegation: intercepts clicks on any .lang-btn reliably
    document.addEventListener('click', function (e) {
      var target = e.target;
      var btn = null;
      if (target.closest) {
        btn = target.closest('.lang-btn');
      } else {
        var el = target;
        while (el && el !== document) {
          if (el.classList && el.classList.contains('lang-btn')) {
            btn = el;
            break;
          }
          el = el.parentNode;
        }
      }

      if (btn) {
        e.preventDefault();
        var targetLang = btn.getAttribute('data-lang');
        if (targetLang && translations[targetLang]) {
          applyTranslations(targetLang);
        }
      }
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
