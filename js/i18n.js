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
        heading: 'Featured Projects & Case Studies',
        sub: 'Real-world business problems, technical architectures, and measurable commercial results for B2B enterprises.',
        tab_all: 'All Solutions',
        tab_commerce: 'Retail & F&B',
        tab_operations: 'Operations & Logistics',
        tab_enterprise: 'Real Estate & Manufacturing',
        swipe_hint: 'Drag or swipe to browse through solutions',
        btn_detail: 'View Case Study',
        btn_consult: 'Consult This Solution',
        btn_live_demo: 'Visit Live Website ↗',
        status_deployed: 'Deployed & Active',
        label_problem: 'Challenge:',
        label_solution: 'Solution:',
        label_result: 'Impact:',
        modal_challenge_heading: 'Operational Context & Challenges',
        modal_solution_heading: 'Technical Architecture & Solution',
        modal_impact_heading: 'Business Results & Measurable ROI',
        modal_tech_heading: 'Tech Stack & Infrastructure',
        modal_btn_close: 'Close Window',
        modal_btn_consult: 'Consult on Similar Project',
        modal_btn_live: 'Open Live Website ↗',

        // Item 7: Nhíp Bạc (Live Website)
        item7: 'Nhip Bac – Service & Booking Website',
        item7_badge: 'WELLNESS • Booking & Brand Web',
        item7_title: 'Nhip Bac – Wellness Service & Automated Booking Website',
        item7_desc: 'Elegantly designed wellness & therapy website in Phu My Hung, optimized for local search visibility with friction-free 1-tap instant messaging booking flow.',
        item7_tag1: '1-Tap Zalo Booking',
        item7_tag2: 'HCMC District 7 Local SEO',
        item7_tag3: 'Mobile-First UX',
        item7_problem: 'Specialized relaxation service in Phu My Hung requiring a refined digital presence and frictionless local appointment booking.',
        item7_solution: 'Minimalist brand website optimized for local search presence with one-tap instant messaging booking flow.',
        item7_result: '25% increase in online reservations; strong organic search ranking across District 7 customer base.',
        item7_modal_challenge: 'Nhip Bac provides specialized grey hair plucking and relaxation therapy in the upscale Phu My Hung urban area (District 7, HCMC). They required a discreet, elegant website allowing high-end clientele to review service protocols, transparent pricing, and reserve appointments easily.',
        item7_modal_solution: 'Engineered a clean Zen Minimalist landing page with structured Local Business schema for Google Maps visibility; Fine-tuned sub-second mobile loading performance; Streamlined appointment CTAs linking directly to Zalo and concierge telephone hotlines.',
        item7_modal_impact: 'Boosted pre-scheduled appointments by 25%, eliminating peak-hour client congestion; Established dominant search ranking for personal wellness keywords in HCMC.',
        item7_modal_tech: 'HTML5 Semantic, SCSS Modern, JavaScript ES6, Local SEO Schema, Mobile-First, Cloudflare SSL',

        // Item 8: Hậu Tận Thế (Live Web App)
        item8: 'Hau Tan The – Interactive Web App',
        item8_badge: 'WEB APP • Interactive Visual Novel',
        item8_title: 'Light Behind the Screen – Interactive Post-Apocalyptic Web Game',
        item8_desc: 'Interactive post-apocalyptic survival Visual Novel web app running at 60fps directly in modern web browsers, featuring dynamic audio FX and Vercel Edge deployment.',
        item8_tag1: '60fps Browser Render',
        item8_tag2: 'Vercel Edge Deploy',
        item8_tag3: 'Dynamic Audio & FX',
        item8_problem: 'Delivering a rich post-pandemic survival narrative game running seamlessly on web browsers without requiring heavy client app downloads.',
        item8_solution: 'High-performance SPA architecture with dynamic branching story state machine, asset compression, and contextual Web Audio API integration.',
        item8_result: 'Initial page load under 1.2s, consistent 60fps animation across devices, zero-maintenance automated CI/CD on Vercel Edge.',
        item8_modal_challenge: 'The interactive narrative project required an immersive survival horror story that players could open and play instantly on any smartphone or desktop browser. The primary challenge was keeping heavy soundscapes and anime art lightweight without sacrificing visual fidelity.',
        item8_modal_solution: 'Built a lightweight interactive Web App; Designed a resilient choice-branching state engine; Accelerated visual transitions and screen shake effects via CSS hardware acceleration; Streamlined multi-track audio playback; Configured continuous automated deployment to Vercel\'s global CDN.',
        item8_modal_impact: 'Achieved lightning-fast (<1.2s) initial loads; Ran reliably with zero server infrastructure overhead; Demonstrates capability in complex interactive frontend architectures.',
        item8_modal_tech: 'React, Next.js / SPA, Web Audio API, Canvas FX, Tailwind CSS, Vercel Edge CDN',

        // Item 1: Retail
        item1: 'Retail Industry Client',
        item1_badge: 'RETAIL • Chain Management',
        item1_title: 'Multi-Branch Retail Management & Real-Time Inventory System',
        item1_desc: 'Centralized cloud POS and inventory management solution with automated real-time multi-channel stock sync and streamlined shift reconciliation for retail chains.',
        item1_tag1: '-90% Stock Discrepancy',
        item1_tag2: '15-Store Cloud POS',
        item1_tag3: 'Real-Time Sync',
        item1_problem: 'Inventory data lag between brick-and-mortar stores and online channels causing stockouts and reconciliation bottlenecks.',
        item1_solution: 'Centralized cloud POS architecture with unified inventory tracking and automated multi-gateway reconciliation.',
        item1_result: '90% decrease in stock discrepancy; 3x faster order processing across 15 store locations.',
        item1_modal_challenge: 'The client operated a 15-store retail chain using disconnected local software. Online channels (Website & marketplaces) were out of sync with physical stock, causing frequent order cancellations. Daily closing reconciliations took 2-3 hours per store.',
        item1_modal_solution: 'Implemented a tailored retail management system: Centralized cloud database connecting all 15 branches; Web-based POS supporting barcode scanners & receipt printers; Real-time inventory sync via webhooks for instant stock reservation; Granular role-based access control for cashiers, managers, and accountants.',
        item1_modal_impact: 'Eliminated overselling completely; Reduced shift handover time from 2 hours to 15 minutes; Real-time financial & best-seller dashboards accessible on mobile anytime.',
        item1_modal_tech: 'Node.js, PostgreSQL, Redis, Vue.js POS, Cloud Hosting, Barcode API',

        // Item 2: F&B
        item2: 'F&B Industry Client',
        item2_badge: 'F&B • Ordering Web & Mail Server',
        item2_title: 'Direct Food Ordering Portal & Enterprise Mail Infrastructure',
        item2_desc: 'Direct-to-consumer online food ordering portal and in-store QR digital table menu combined with dedicated enterprise Mail Server infrastructure ensuring 99.8% inbox delivery.',
        item2_tag1: '18% Commission Saved',
        item2_tag2: '99.9% Mail SLA',
        item2_tag3: 'QR Smart Table Menu',
        item2_problem: 'Heavy reliance on high marketplace commissions and domain email frequently landing in customer spam folders.',
        item2_solution: 'Direct-to-consumer online ordering portal, in-store QR digital menu, and dedicated Mail Server setup with SPF/DKIM authentication.',
        item2_result: '45% of delivery orders moved to direct channels; 99.8% transactional email inbox deliverability.',
        item2_modal_challenge: 'The restaurant brand paid 20-25% commission fees per order to third-party delivery apps without owning customer data. Meanwhile, corporate event proposals sent via their domain email were consistently landing in customer spam folders.',
        item2_modal_solution: 'Developed a high-converting mobile-first direct ordering website supporting instant online payment (e-wallets, cards); Implemented table QR digital menu for fast dine-in reordering; Deployed a dedicated enterprise Mail Server on a clean IP with full SPF, DKIM, DMARC, and PTR setup.',
        item2_modal_impact: 'Migrated 45% of regular delivery patrons to direct orders, saving thousands in monthly commissions; Event proposal inbox delivery reached 99.8%, boosting catering booking conversion by 28%.',
        item2_modal_tech: 'WordPress Headless, WooCommerce, Custom API, Dedicated Mail Server, Postfix, Dovecot, SSL',

        // Item 3: Education
        item3: 'Education Industry Client',
        item3_badge: 'EDUCATION • Training ERP',
        item3_title: 'Comprehensive Student & Academic Operations Management Portal',
        item3_desc: 'End-to-end educational institution management platform featuring smart scheduling conflict detection, interactive parent/student portal, and automated fee collection alerts.',
        item3_tag1: '-70% Admin Workload',
        item3_tag2: 'Automated Attendance',
        item3_tag3: 'Zero Fee Leakage',
        item3_problem: 'Managing thousands of students, schedules, and tuition fees using manual spreadsheets causing room conflicts and payment delays.',
        item3_solution: 'Specialized EdTech management platform with smart timetable conflict detection, student portal, and automated fee reminders.',
        item3_result: '70% reduction in administrative overhead; on-time tuition collection reached 96%.',
        item3_modal_challenge: 'An education academy with 8 branches and 3,000+ active students struggled with manual scheduling for foreign teachers, paper attendance tracking, and tracking overdue fees via Excel. Parents had no visibility into their children\'s progress.',
        item3_modal_solution: 'Developed a centralized School Management System: Automated scheduling algorithm preventing classroom & instructor conflicts; Responsive Parent/Student Portal showing daily lesson notes and grades; Integrated Zalo ZNS & automated email for fee notices and attendance alerts.',
        item3_modal_impact: 'Freed up 70% of staff time previously spent on manual admin tasks; On-time tuition payment rate surged from 72% to 96%; Course re-enrollment rate increased by 22%.',
        item3_modal_tech: 'Laravel, MySQL, React.js, Zalo ZNS API, AWS S3, Cloudflare CDN',

        // Item 4: Logistics
        item4: 'Logistics Industry Client',
        item4_badge: 'LOGISTICS • WMS & Fleet Platform',
        item4_title: 'Smart Warehouse Management (WMS) & Fleet Dispatch Platform',
        item4_desc: 'Modern warehouse management software (WMS) with digital zone mapping, mobile barcode scanning, and intelligent delivery route optimization for logistics fleet dispatch.',
        item4_tag1: '+40% Fulfillment Speed',
        item4_tag2: 'Real-Time Tracking',
        item4_tag3: 'Barcode Scanning',
        item4_problem: 'Inventory misplacement, pallet searching delays, and lack of real-time route dispatch for B2B cargo deliveries.',
        item4_solution: 'Modern WMS with digital warehouse mapping, mobile barcode scanning, and intelligent delivery route optimization.',
        item4_result: '40% increase in warehouse throughput, shipping error rate cut to 0.05%, 25% fleet fuel savings.',
        item4_modal_challenge: 'A 12,000m² multi-client 3PL warehouse struggled with manual picking that relied on worker memory. Expired lots and misplaced pallets led to customer penalties. A fleet of 30 delivery trucks lacked route planning and dispatch automation.',
        item4_modal_solution: 'Engineered an end-to-end WMS & TMS system: Digital warehouse mapping (Zone - Aisle - Rack - Shelf); Mobile barcode scanning enforcing strict FIFO/FEFO picking; Dynamic pick-path optimization reducing walking distances; Automated fleet dispatch grouping delivery orders by optimal route.',
        item4_modal_impact: 'Pick-and-pack speed jumped 40%; Order shipping error dropped from 4.2% to under 0.05%; Fleet fuel expenditure dropped 25% through smart route consolidation.',
        item4_modal_tech: 'Golang Backend, Next.js, PostgreSQL, Flutter Mobile (PDA scanner), Google Maps Fleet API',

        // Item 5: Real Estate
        item5: 'Real Estate Industry Client',
        item5_badge: 'REAL ESTATE • Portal & CRM',
        item5_title: 'Interactive Real Estate Project Portal & Real-Time Inventory CRM',
        item5_desc: 'High-performance property development portal featuring 360° virtual tours, real-time inventory locking CRM, and rapid sub-5-minute advertising lead routing.',
        item5_tag1: '+35% Deal Conversion',
        item5_tag2: 'Real-Time Unit Lock',
        item5_tag3: 'Instant Lead Routing',
        item5_problem: 'Delayed advertising lead response and chaotic double-booking of units among 20+ agency brokerages.',
        item5_solution: 'Interactive high-performance project portal with 360° virtual tour, second-accurate unit lock CRM, and sub-5-minute lead routing.',
        item5_result: 'Response time slashed to under 5 minutes, 35% higher sales closing rate, 100% inventory transparency across all agencies.',
        item5_modal_challenge: 'A master property developer launching a 2,500-unit mixed-use development experienced severe unit booking conflicts between 20 external agency networks. Simultaneously, thousands of daily digital marketing leads went uncontacted for 6-12 hours, losing customer interest.',
        item5_modal_solution: 'Built an enterprise PropTech suite: Ultra-fast project portal with interactive 360° architectural masterplan; Real-time inventory CRM with countdown timers preventing double locks via WebSocket; Automated lead distribution engine pushing inquiries to available sales agents within 60 seconds.',
        item5_modal_impact: 'Achieved 100% zero-conflict reservation transactions during launch day; Lead response time dropped from 6 hours to 3 minutes; Visit-booking conversion rate increased by 35%.',
        item5_modal_tech: 'Next.js, Tailwind CSS, Node.js Microservices, WebSocket (Real-time Locks), PostgreSQL, Virtual Tour 360',

        // Item 6: Manufacturing
        item6: 'Manufacturing Industry Client',
        item6_badge: 'MANUFACTURING • Custom ERP',
        item6_title: 'Custom Manufacturing ERP, Multi-Level BOM & Shop-Floor Tracking',
        item6_desc: 'Custom manufacturing ERP managing multi-level Bill of Materials (BOM), shop-floor touchscreen barcode tracking, and automated real-time job costing reports.',
        item6_tag1: '-15% Material Waste',
        item6_tag2: 'Multi-Level BOM',
        item6_tag3: 'Live Shop-Floor KPI',
        item6_problem: 'Inaccurate job costing and production bottlenecks caused by complex manual Bill of Materials (BOM) and disconnected shop floors.',
        item6_solution: 'Tailored manufacturing ERP with multi-level dynamic BOM, touch-screen barcode logging at workstations, and real-time plant KPIs.',
        item6_result: '15% reduction in raw material scrap, 99% on-time order tracking, instant costing calculations per production run.',
        item6_modal_challenge: 'A precision engineering factory with 120 machinists operating on a Make-to-Order model struggled with manual BOM calculations. Material shortages frequently halted CNC machines. Management had no visibility into where batches were stalled along the production line.',
        item6_modal_solution: 'Delivered a custom lightweight Manufacturing ERP: Multi-level BOM tree with automated scrap margin calculations; Ruggedized touchscreen terminals at factory workstations for barcode batch check-in/out; Real-time executive dashboard visualizing yield, defect rates (NG), and machine throughput.',
        item6_modal_impact: 'Material procurement planning time reduced from 3 days to 30 minutes; Raw material waste slashed by 15%, saving thousands quarterly; Accurate unit manufacturing cost generated instantly upon order completion.',
        item6_modal_tech: 'Python Django, PostgreSQL, Docker, Vue.js Industrial Dashboard, Redis, MQTT IoT'
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
        phone_label: 'Phone / Zalo / WhatsApp:',
        linkedin_label: 'LinkedIn:',
        address: 'Ho Chi Minh City, Vietnam',
        address_note: '(Nationwide support, priority in HCMC area)',
        /* ── Contact Form ── */
        form_name_label: 'Full Name',
        form_name_ph: 'Phuc Toan Nguyen',
        form_name_err: 'Please enter your full name.',
        form_company_label: 'Business / Company Name',
        form_company_ph: 'ABC Company',
        form_phone_label: 'Phone / Zalo / WhatsApp',
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
        btn_whatsapp_quick: 'Direct WhatsApp Chat (+84 0913.365.842)',
        success_whatsapp: 'Direct WhatsApp',
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
        copyright: 'Copyright &copy; <time datetime="2026">2026</time> Phuc Toan. All rights reserved. Designed by <a href="https://www.facebook.com/phuctoansales" target="_blank" rel="noopener noreferrer">Phuc Toan Nguyen</a>',
        online_label: 'online',
        views_label: 'total visits'
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
        title: 'Nguyễn Phúc Toàn – Tư vấn Giải pháp',
        og_title: 'Nguyễn Phúc Toàn – Tư vấn Giải pháp',
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

        item2_title: 'Hosting',
        item2_short: 'Tốc độ cao & Vận hành ổn định',
        item2_f1: 'Đảm bảo Uptime ổn định 99.9%',
        item2_f2: 'Ổ cứng NVMe siêu tốc độ',
        item2_f3: 'Tặng chứng chỉ SSL & Firewall',
        item2_f4: 'Sao lưu mỗi tuần & Hỗ trợ 24/7',

        item3_title: 'Tên miền',
        item3_short: 'Khẳng định thương hiệu số',
        item3_f1: 'Đầy đủ tên miền .vn & Quốc tế',
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
        item5_short: 'Gia công theo yêu cầu',
        item5_f1: 'Phát triển Web App & Mobile App',
        item5_f2: 'Đội ngũ chuyên nghiệp, chuẩn Agile',
        item5_f3: 'Bảo mật cao & Mã nguồn tối ưu',
        item5_f4: 'Bảo hành & Hỗ trợ kỹ thuật lâu dài'
      },
      portfolio: {
        heading: 'Dự án tiêu biểu',
        sub: 'Bài toán thực tế, kiến trúc giải pháp và hiệu quả kinh doanh đo lường được cho doanh nghiệp B2B.',
        tab_all: 'Tất cả giải pháp',
        tab_commerce: 'Bán lẻ & F&B',
        tab_operations: 'Vận hành & Logistics',
        tab_enterprise: 'BĐS & Sản xuất',
        swipe_hint: 'Kéo chuột hoặc vuốt để xem tiếp các giải pháp',
        btn_detail: 'Xem chi tiết',
        btn_consult: 'Tư vấn giải pháp này',
        btn_live_demo: 'Xem website thực tế ↗',
        modal_btn_live: 'Mở website thực tế ↗',
        status_deployed: 'Đã triển khai thực tế',
        label_problem: 'Bài toán:',
        label_solution: 'Giải pháp:',
        label_result: 'Hiệu quả:',
        modal_challenge_heading: 'Bối cảnh & Thách thức vận hành',
        modal_solution_heading: 'Giải pháp & Kiến trúc triển khai',
        modal_impact_heading: 'Kết quả & Giá trị kinh doanh thực tế',
        modal_tech_heading: 'Công nghệ & Hạ tầng áp dụng',
        modal_btn_close: 'Đóng lại',
        modal_btn_consult: 'Tư vấn bài toán tương tự',

        // Item 7: Nhíp Bạc (Live Website)
        item7: 'Nhíp Bạc – Website Đặt Lịch & Nhận Diện',
        item7_badge: 'DỊCH VỤ • Web Đặt Lịch & Nhận Diện',
        item7_title: 'Nhíp Bạc – Website Dịch Vụ Thư Giãn & Đặt Hẹn Tự Động',
        item7_desc: 'Website giới thiệu dịch vụ chăm sóc & thư giãn chuyên biệt tại Phú Mỹ Hưng, tối ưu SEO Local và tích hợp đặt lịch hẹn trực tuyến tiện lợi qua Zalo & Hotline.',
        item7_tag1: 'Đặt lịch Zalo 1 chạm',
        item7_tag2: 'SEO Local Q.7 HCMC',
        item7_tag3: 'Tối ưu Mobile-First',
        item7_problem: 'Dịch vụ nhổ tóc bạc thư giãn chuyên biệt tại Phú Mỹ Hưng cần kênh tiếp thị số tinh tế, giúp khách hàng dễ tìm kiếm và chủ động đặt lịch.',
        item7_solution: 'Thiết kế giao diện thanh lịch chuẩn nhận diện thương hiệu, tối ưu SEO từ khóa địa phương và tích hợp kênh tương tác nhanh qua Zalo & Hotline.',
        item7_result: 'Tăng 25% tỷ lệ khách hàng đặt hẹn trực tuyến, định vị thương hiệu chỉn chu và lên top tìm kiếm Google tại khu vực Quận 7.',
        item7_modal_challenge: 'Nhíp Bạc là cơ sở chăm sóc sức khỏe & thư giãn (nhổ tóc bạc chuyên nghiệp) tại Phú Mỹ Hưng, Quận 7. Cơ sở cần một website tinh tế, tối giản nhưng chuyên nghiệp để khách hàng thượng lưu tại khu vực có thể tìm kiếm thông tin dịch vụ, bảng giá rõ ràng và đặt lịch hẹn kín đáo, tiện lợi.',
        item7_modal_solution: 'Xây dựng website phong cách Nhật Bản tối giản (Zen Minimalist), chuẩn SEO Local Schema để xuất hiện nổi bật trên Google Search và Google Maps; Tối ưu tốc độ tải trang cực nhanh (<1s) trên mạng di động; Bố trí nút đặt lịch thông minh kết nối trực tiếp đến Zalo OA và số điện thoại chăm sóc khách hàng.',
        item7_modal_impact: 'Gia tăng lượng khách đặt lịch trước lên hơn 25%, giảm tỷ lệ khách đến trùng giờ gây chờ đợi; Tên miền nhipbac.com đạt uy tín cao trên công cụ tìm kiếm với từ khóa dịch vụ nhổ tóc bạc tại TP.HCM.',
        item7_modal_tech: 'HTML5 Semantic, SCSS Modern, JavaScript ES6, Local SEO Schema, Mobile-First, Cloudflare SSL',

        // Item 8: Hậu Tận Thế (Live Web App)
        item8: 'Hậu Tận Thế – Web App Tương Tác',
        item8_badge: 'WEB APP • Game Visual Novel Tương Tác',
        item8_title: 'Ánh Sáng Sau Màn Hình – Web App Tương Tác Kể Chuyện Sinh Tồn',
        item8_desc: 'Web App tương tác thể loại Visual Novel sinh tồn hậu đại dịch chạy mượt mà 60fps trên trình duyệt, tối ưu âm thanh sống động và triển khai trên Vercel Edge CDN.',
        item8_tag1: '60fps Trình duyệt',
        item8_tag2: 'Deploy Vercel Edge',
        item8_tag3: 'Âm thanh & Visual FX',
        item8_problem: 'Phát triển trò chơi thể loại Visual Novel sinh tồn hậu đại dịch chạy trực tiếp mượt mà trên mọi trình duyệt web mà không bắt người chơi tải app nặng.',
        item8_solution: 'Xây dựng kiến trúc Single Page Application (SPA), xử lý phân nhánh cốt truyện linh hoạt, nén asset tối ưu và tích hợp Web Audio API cho âm thanh sống động.',
        item8_result: 'Thời gian tải trang ban đầu dưới 1.2s, khung hình ổn định 60fps trên cả mobile và PC, triển khai CI/CD tự động trên Vercel Edge.',
        item8_modal_challenge: 'Dự án "Ánh Sáng Sau Màn Hình" cần truyền tải trải nghiệm game nhập vai kết hợp Visual Novel kịch tính về đề tài sinh tồn hậu đại dịch. Yêu cầu kỹ thuật cốt lõi là tối ưu tài nguyên hình ảnh và âm thanh để người chơi có thể trải nghiệm tức thì trên web di động mà không gặp tình trạng giật lag hay ngốn băng thông.',
        item8_modal_solution: 'Phát triển Web App tương tác dựa trên công nghệ web hiện đại; Xây dựng state machine quản lý lựa chọn và nhánh cốt truyện của người chơi; Tối ưu hóa chuyển cảnh và hiệu ứng rung lắc (screen shake) bằng CSS Hardware Acceleration; Tích hợp âm thanh nền và sound effect theo ngữ cảnh; Thiết lập CI/CD pipeline tự động build và deploy lên Vercel toàn cầu.',
        item8_modal_impact: 'Đạt hiệu năng tải trang tức thì (<1.2s); Vận hành ổn định 100% không cần máy chủ backend phức tạp; Minh chứng cho năng lực phát triển Web App tương tác cao và tối ưu trải nghiệm người dùng hiện đại.',
        item8_modal_tech: 'React, Next.js / SPA, Web Audio API, Canvas FX, Tailwind CSS, Vercel Edge CDN',

        // Item 1: Bán lẻ
        item1: 'Khách hàng ngành Bán lẻ',
        item1_badge: 'BÁN LẺ • Phần mềm quản trị chuỗi',
        item1_title: 'Hệ Thống Quản Lý Bán Lẻ & Đồng Bộ Tồn Kho Đa Chi Nhánh',
        item1_desc: 'Giải pháp phần mềm POS quản trị tập trung, tự động đồng bộ tồn kho đa kênh theo thời gian thực và tối ưu quy trình đối soát cho chuỗi cửa hàng bán lẻ.',
        item1_tag1: '-90% Lệch tồn',
        item1_tag2: 'POS 15 cửa hàng',
        item1_tag3: 'Đồng bộ Real-time',
        item1_problem: 'Dữ liệu tồn kho bị trễ giữa các cửa hàng và kênh online, dẫn đến quá tải đối soát và sót đơn hàng.',
        item1_solution: 'Xây dựng phần mềm POS bán hàng tập trung, tích hợp quản lý kho và đối soát thanh toán đa cổng tự động.',
        item1_result: 'Giảm 90% thất thoát và chênh lệch kho, xử lý đơn nhanh gấp 3 lần tại 15 điểm bán.',
        item1_modal_challenge: 'Doanh nghiệp sở hữu chuỗi 15 cửa hàng bán lẻ thời trang & phụ kiện nhưng vận hành bằng các phần mềm rời rạc. Kênh online (Website, sàn TMĐT) không đồng bộ tồn kho thực tế, dẫn đến tình trạng khách đặt hàng nhưng kho đã hết. Việc đối soát doanh thu cuối ngày giữa các ca làm việc mất từ 2-3 giờ mỗi cửa hàng.',
        item1_modal_solution: 'Triển khai hệ thống phần mềm quản lý bán lẻ may đo theo quy trình nghiệp vụ: Quản lý tập trung 15 chi nhánh trên một cơ sở dữ liệu cloud; Tích hợp máy quét mã vạch và máy in hóa đơn chuẩn POS; Tự động đồng bộ số lượng tồn kho theo thời gian thực (real-time webhook) khi có giao dịch mới; Phân quyền nhân viên thu ngân, quản lý cửa hàng và kế toán chặt chẽ.',
        item1_modal_impact: 'Loại bỏ hoàn toàn tình trạng bán vượt tồn kho (overselling); Tối ưu thời gian chốt ca từ 2 giờ xuống còn 15 phút; Báo cáo dòng tiền, mặt hàng bán chạy hiển thị trực quan theo thời gian thực trên điện thoại của ban giám đốc.',
        item1_modal_tech: 'Node.js, PostgreSQL, Redis, Vue.js POS, Cloud Hosting, Barcode API',

        // Item 2: F&B
        item2: 'Khách hàng ngành F&B',
        item2_badge: 'F&B • Web Đặt Món & Mail Server',
        item2_title: 'Website Đặt Món Trực Tuyến & Hạ Tầng Mail Server Doanh Nghiệp',
        item2_desc: 'Website đặt món trực tiếp tối ưu tỷ lệ chuyển đổi, tích hợp menu điện tử QR tại bàn và hạ tầng Mail Server doanh nghiệp độc lập chuẩn SPF/DKIM.',
        item2_tag1: 'Tiết kiệm 18% hoa hồng',
        item2_tag2: 'Mail SLA 99.9%',
        item2_tag3: 'Menu điện tử QR',
        item2_problem: 'Phụ thuộc phí chiết khấu cao từ app giao hàng bên thứ ba và hệ thống email tên miền hay rơi vào hộp thư rác (spam).',
        item2_solution: 'Thiết kế web đặt món online trực tiếp, menu quét mã QR tại bàn kết hợp cấu hình hạ tầng Mail Server doanh nghiệp chuẩn SPF/DKIM.',
        item2_result: 'Tự chủ 45% lượng đơn giao tận nơi, tăng tỷ lệ gửi email tiếp thị và xác nhận hóa đơn vào Inbox đạt 99.8%.',
        item2_modal_challenge: 'Chuỗi nhà hàng F&B phải chịu mức chiết khấu 20-25% trên mỗi đơn đặt qua app trung gian, đồng thời không giữ được dữ liệu khách hàng trung thành. Bên cạnh đó, email giao dịch và báo giá tiệc/sự kiện gửi từ tên miền công ty thường xuyên bị Gmail đánh dấu là thư rác.',
        item2_modal_solution: 'Xây dựng website đặt món trực tiếp với giao diện mobile-first tối ưu trải nghiệm chọn món và thanh toán online (VNPAY, MoMo); Tích hợp tính năng gọi món bằng mã QR tại bàn; Thiết lập cụm Mail Server doanh nghiệp độc lập với IP sạch, cấu hình chuẩn xác SPF, DKIM, DMARC, PTR record để đảm bảo uy tín tên miền tuyệt đối.',
        item2_modal_impact: 'Chuyển dịch 45% khách hàng quen đặt trực tiếp qua website, tiết kiệm hàng chục triệu tiền phí hoa hồng mỗi tháng; Tỷ lệ email báo giá vào Inbox đạt 99.8%, tỷ lệ chốt tiệc cưới & sự kiện tăng 28%.',
        item2_modal_tech: 'WordPress Headless, WooCommerce, Custom API, Dedicated Mail Server, Postfix, Dovecot, SSL',

        // Item 3: Giáo dục
        item3: 'Khách hàng ngành Giáo dục',
        item3_badge: 'GIÁO DỤC • Hệ thống quản lý đào tạo',
        item3_title: 'Nền Tảng Quản Lý Học Viên, Lịch Học & Cổng Thông Tin Đào Tạo',
        item3_desc: 'Nền tảng quản trị trung tâm đào tạo toàn diện: thuật toán xếp lịch thông minh chống trùng phòng, cổng thông tin học viên/phụ huynh và tự động nhắc học phí qua Zalo/Email.',
        item3_tag1: '-70% Thời gian tác vụ',
        item3_tag2: 'Điểm danh tự động',
        item3_tag3: 'Học phí minh bạch',
        item3_problem: 'Quản lý hàng trăm lớp học và công nợ học phí bằng file Excel thủ công, dễ thất thoát và chồng chéo phòng học.',
        item3_solution: 'Phát triển hệ thống EdTech chuyên biệt: phân bổ lịch học thông minh, cổng tương tác phụ huynh và tự động nhắc học phí qua Zalo/Email.',
        item3_result: 'Tiết kiệm 70% thời gian xử lý hành chính, thu hồi công nợ học phí đúng hạn đạt 96%.',
        item3_modal_challenge: 'Hệ thống trung tâm ngoại ngữ với 8 cơ sở và hơn 3.000 học viên gặp khó khăn nghiêm trọng khi xếp lịch giáo viên nước ngoài, ghi nhận điểm danh và theo dõi học phí bằng bảng tính Excel. Phụ huynh thường xuyên phàn nàn vì không nắm được tiến độ học tập và tình trạng chuyên cần của con.',
        item3_modal_solution: 'Thiết kế và triển khai nền tảng quản trị trung tâm đào tạo (School Management System): Thuật toán tự động kiểm tra xung đột phòng học và giáo viên; Cổng thông tin (Student Portal) trên web và mobile giúp phụ huynh xem nhận xét buổi học, điểm thi; Tích hợp Zalo ZNS và Email tự động gửi nhắc lịch học và thông báo học phí định kỳ.',
        item3_modal_impact: 'Giải phóng hoàn toàn thời gian nhập liệu thủ công của phòng đào tạo (giảm 70% công sức); Tỷ lệ thu học phí đúng hạn tăng từ 72% lên 96%; Tỷ lệ phụ huynh tái đăng ký khóa học nâng cao thêm 22%.',
        item3_modal_tech: 'Laravel, MySQL, React.js, Zalo ZNS API, AWS S3, Cloudflare CDN',

        // Item 4: Logistics
        item4: 'Khách hàng ngành Logistics',
        item4_badge: 'LOGISTICS • Phần mềm kho & vận tải',
        item4_title: 'Hệ Thống Quản Lý Kho Bãi (WMS) & Điều Phối Giao Nhận',
        item4_desc: 'Hệ thống phần mềm WMS số hóa sơ đồ kho bãi 2D/3D, quét mã vạch kiểm soát xuất nhập chính xác và tự động tối ưu hóa tuyến đường điều phối đội xe giao hàng.',
        item4_tag1: '+40% Tốc độ xuất kho',
        item4_tag2: 'Tracking thời gian thực',
        item4_tag3: 'Quét mã Barcode',
        item4_problem: 'Nhầm lẫn mã pallet lưu kho, thất lạc hàng hóa và thiếu công cụ theo dõi lộ trình xe giao hàng cho khách B2B.',
        item4_solution: 'Triển khai phần mềm WMS định vị sơ đồ kho 2D/3D, quy trình xuất nhập quét barcode và hệ thống điều xe giao nhận kèm GPS tracking.',
        item4_result: 'Tăng 40% tốc độ luân chuyển kho, giảm tỷ lệ giao sai hàng xuống 0.05%, tối ưu 25% chi phí nhiên liệu vận tải.',
        item4_modal_challenge: 'Doanh nghiệp kho vận tổng hợp diện tích 12.000m² lưu trữ hàng nghìn SKU cho nhiều đối tác. Quá trình lấy hàng (picking) phụ thuộc vào trí nhớ thủ kho, thường xuyên xảy ra tình trạng tìm không ra hàng hoặc xuất nhầm hạn sử dụng (FIFO/FEFO). Đội xe 30 chiếc chưa có công cụ tối ưu lộ trình giao.',
        item4_modal_solution: 'Xây dựng giải pháp WMS & TMS tích hợp: Số hóa sơ đồ kho theo vị trí Zone - Dãy - Kệ - Tầng; Quy chuẩn quy trình nhập/xuất/kiểm kê bắt buộc quét mã vạch qua thiết bị cầm tay (PDA / Mobile App); Tự động đề xuất vị trí lưu kho tối ưu và cung đường di chuyển ngắn nhất cho nhân viên lấy hàng; Module điều phối xe giao hàng tự động gộp đơn theo tuyến đường.',
        item4_modal_impact: 'Tốc độ tìm và đóng gói đơn hàng tăng 40%; Tỷ lệ xuất sai hàng giảm từ 4.2% xuống dưới 0.05%; Chi phí nhiên liệu vận tải toàn đội xe giảm 25% nhờ tối ưu tuyến giao.',
        item4_modal_tech: 'Golang Backend, Next.js, PostgreSQL, Flutter Mobile (PDA scanner), Google Maps Fleet API',

        // Item 5: Bất động sản
        item5: 'Khách hàng ngành Bất động sản',
        item5_badge: 'BẤT ĐỘNG SẢN • Web dự án & CRM',
        item5_title: 'Cổng Dự Án Chuẩn SEO, Sa Bàn 360° & CRM Quản Lý Giỏ Hàng',
        item5_desc: 'Cổng thông tin dự án bất động sản tích hợp tour sa bàn ảo 360°, hệ thống CRM lock căn theo thời gian thực và phân bổ lead quảng cáo tự động trong 60 giây.',
        item5_tag1: '+35% Tỷ lệ chốt deal',
        item5_tag2: 'Khóa căn thời gian thực',
        item5_tag3: 'CRM phân bổ Lead',
        item5_problem: 'Lead đổ về từ quảng cáo bị phân bổ chậm, các sàn đại lý F1/F2 chồng chéo giữ chỗ (lock căn) gây mất uy tín với khách mua.',
        item5_solution: 'Xây dựng website dự án cao cấp tích hợp tour 360°, hệ thống CRM lock căn theo giây và phân phối lead tự động cho tư vấn viên theo ca trực.',
        item5_result: 'Thời gian liên hệ lead giảm xuống dưới 5 phút, tỷ lệ chốt giao dịch tăng 35%, minh bạch giỏ hàng cho hơn 20 đại lý liên kết.',
        item5_modal_challenge: 'Chủ đầu tư mở bán đại dự án với hơn 2.500 sản phẩm căn hộ và shophouse. Khi mở giỏ hàng, hàng trăm môi giới cùng lúc yêu cầu giữ chỗ dẫn đến tình trạng hai khách hàng cùng cọc một căn. Bên cạnh đó, hàng nghìn lead quảng cáo mỗi ngày bị xử lý trễ từ 6-12 tiếng làm giảm cơ hội bán hàng.',
        item5_modal_solution: 'Triển khai tổ hợp công nghệ BĐS: Website giới thiệu dự án cao cấp chuẩn Core Web Vitals, tích hợp sa bàn ảo 360° và sơ đồ mặt bằng tương tác; Hệ thống CRM quản lý bảng hàng thời gian thực: cơ chế giữ chỗ có đếm ngược theo giây chống trùng lặp; Module Routing Lead thông minh: phân bổ khách hàng tiềm năng đến điện thoại sales trong 60 giây.',
        item5_modal_impact: 'Xử lý giữ chỗ chính xác 100% trong ngày mở bán mà không có tranh chấp; Tốc độ liên hệ khách mới giảm từ 6 giờ xuống 3 phút; Tỷ lệ chuyển đổi lead thành cuộc hẹn tham quan dự án tăng 35%.',
        item5_modal_tech: 'Next.js, Tailwind CSS, Node.js Microservices, WebSocket (Real-time Locks), PostgreSQL, Virtual Tour 360',

        // Item 6: Sản xuất
        item6: 'Khách hàng ngành Sản xuất',
        item6_badge: 'SẢN XUẤT • ERP may đo & BOM',
        item6_title: 'Giải Pháp ERP Quản Trị Sản Xuất, Định Mức Vật Tư & Giám Sát Chuyền',
        item6_desc: 'Hệ thống ERP may đo chuyên sâu cho nhà máy: quản lý cây định mức nguyên vật liệu (BOM) đa cấp, kiosk barcode giám sát xưởng và tính toán giá thành tự động sau mỗi ca.',
        item6_tag1: '-15% Hao hụt vật tư',
        item6_tag2: 'BOM đa cấp',
        item6_tag3: 'KPI xưởng thời gian thực',
        item6_problem: 'Khó tính toán chi phí giá thành thực tế do định mức nguyên vật liệu (BOM) phức tạp và thiếu dữ liệu tiến độ từng công đoạn gia công.',
        item6_solution: 'Phát triển hệ thống ERP may đo chuyên biệt: quản lý định mức vật tư đa cấp, nhập liệu barcode tại từng tổ chuyền và dashboard KPI giám sát xưởng.',
        item6_result: 'Giảm 15% hao hụt nguyên vật liệu, kiểm soát tiến độ đơn hàng chính xác 99%, tính toán giá thành tự động sau mỗi ca sản xuất.',
        item6_modal_challenge: 'Nhà máy cơ khí chính xác với 120 công nhân sản xuất theo đơn đặt hàng (Make-to-Order). Việc tính toán định mức nguyên vật liệu (BOM) bằng tay mất nhiều ngày, phát sinh tình trạng thừa thiếu vật tư làm đình trệ đơn hàng. Ban giám đốc không nắm được đơn hàng đang bị tắc ở công đoạn nào trên chuyền.',
        item6_modal_solution: 'May đo hệ thống ERP theo đặc thù sản xuất của nhà máy: Quản lý cây định mức BOM đa cấp với công thức tính hao hụt tự động; Cung cấp màn hình cảm ứng công nghiệp (Kiosk POS) tại từng tổ chuyền để công nhân quét mã lệnh sản xuất khi bắt đầu/kết thúc công đoạn; Dashboard trực quan hiển thị sản lượng, tỷ lệ lỗi (NG) và tiến độ đơn hàng theo thời gian thực.',
        item6_modal_impact: 'Thời gian lên kế hoạch mua sắm vật tư giảm từ 3 ngày xuống 30 phút; Tỷ lệ hao hụt kim loại giảm 15%, tiết kiệm hàng trăm triệu mỗi quý; Báo cáo giá thành thực tế sẵn sàng ngay khi lô hàng rời chuyền.',
        item6_modal_tech: 'Python Django, PostgreSQL, Docker, Vue.js Industrial Dashboard, Redis, MQTT IoT'
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
        phone_label: 'Điện thoại / Zalo / WhatsApp:',
        linkedin_label: 'LinkedIn:',
        address: 'TP. Hồ Chí Minh, Việt Nam',
        address_note: '(Hỗ trợ toàn quốc, ưu tiên khu vực TP.HCM)',
        /* ── Biểu mẫu liên hệ ── */
        form_name_label: 'Họ và tên',
        form_name_ph: 'Tên của Anh/Chị....',
        form_name_err: 'Anh/Chị chưa điền họ và tên',
        form_company_label: 'Tên Hộ kinh doanh / Công ty',
        form_company_ph: 'Tiệm, quán ăn, Công ty ABC',
        form_phone_label: 'Số điện thoại / Zalo / WhatsApp',
        form_phone_ph: '0912 345 678',
        form_phone_err: 'Số điện thoại VN không hợp lệ (VD: 0912345678).',
        form_email_label: 'Email',
        form_email_ph: 'email@company.com',
        form_email_err: 'Vui lòng nhập email hợp lệ.',
        form_service_label: 'Dịch vụ quan tâm',
        form_service_chip1: 'Thiết kế Website',
        form_service_chip2: 'Hosting',
        form_service_chip3: 'Domain',
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
        step2_sub: 'Phúc Toàn sẽ liên hệ trực tiếp để trao đổi kỹ hơn',
        step3_heading: 'Mô tả chi tiết bài toán kỹ thuật của bạn',
        step3_sub: 'Chia sẻ mục tiêu, ngân sách dự kiến hoặc thời gian bạn muốn triển khai để có giải pháp chính xác nhất.',
        recap_label: 'Giải pháp đã chọn:',
        btn_next: 'Tiếp tục',
        btn_back: 'Quay lại',
        btn_zalo_quick: 'Chat Zalo trực tiếp ngay (0913.365.842)',
        btn_whatsapp_quick: 'Chat WhatsApp trực tiếp ngay (+84 0913.365.842)',
        success_whatsapp: 'Nhắn WhatsApp ngay',
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
        copyright: 'Copyright &copy; <time datetime="2026">2026</time> Phuc Toan. All rights reserved. Designed by <a href="https://www.facebook.com/phuctoansales" target="_blank" rel="noopener noreferrer">Phuc Toan Nguyen</a>',
        online_label: 'đang xem',
        views_label: 'lượt truy cập'
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
  window.i18nTranslations = translations;
  window.getTranslation = function (path, lang) {
    lang = lang || document.documentElement.getAttribute('lang') || 'vi';
    var dict = translations[lang] || translations['vi'];
    return get(dict, path);
  };

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
