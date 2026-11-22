// ═══════════════════════════════════════════════════════════════════════════════
// Vercel Serverless Function: /api/lead.js
// Tiếp nhận yêu cầu tư vấn từ Contact Form (B2B Wizard) trên website
// Lưu trực tiếp vào bảng `leads` trên Supabase
// ═══════════════════════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zsyiznoqbxyezejllqos.supabase.co';
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_BJVKtPhE6IbpEf5fdyGhUQ_NgjIH9fA';

  try {
    const body = req.body || {};
    const { name, phone, email, company, message, other_industry } = body;

    // Validate required fields
    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng điền đầy đủ họ tên, số điện thoại, email và nội dung tin nhắn.'
      });
    }

    // Process services array
    let services = [];
    if (Array.isArray(body.services)) {
      services = body.services;
    } else if (typeof body.services === 'string' && body.services.trim()) {
      services = body.services.split(',').map(s => s.trim()).filter(Boolean);
    } else if (typeof body.dich_vu_quan_tam === 'string' && body.dich_vu_quan_tam.trim()) {
      services = body.dich_vu_quan_tam.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Insert into Supabase `leads` table
    const insertPayload = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      company: company ? String(company).trim() : null,
      services: services.length > 0 ? services : ['Chung / Khác'],
      other_industry: other_industry || body.nganh_nghe_quy_mo || null,
      message: String(message).trim(),
      source: 'website',
      status: 'new'
    };

    const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(insertPayload)
    });

    if (!supabaseRes.ok) {
      const errText = await supabaseRes.text();
      console.error('[API Lead] Supabase insert failed:', errText);
      return res.status(500).json({
        success: false,
        error: 'Lỗi ghi dữ liệu vào cơ sở dữ liệu: ' + errText
      });
    }

    const createdRows = await supabaseRes.json();
    const createdLead = createdRows[0];

    return res.status(200).json({
      success: true,
      lead_id: createdLead ? createdLead.id : null,
      message: 'Gửi yêu cầu thành công!'
    });
  } catch (error) {
    console.error('[API Lead] Exception:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Lỗi xử lý máy chủ'
    });
  }
}
