// ═══════════════════════════════════════════════════════════════════════════════
// Vercel Serverless Function: /api/sign-cloudinary.js
// Tạo chữ ký SHA-1 ngắn hạn (Signed Upload) cho Cloudinary
// Bảo vệ API Secret an toàn ở phía server, client chỉ nhận chữ ký tạm thời
// ═══════════════════════════════════════════════════════════════════════════════

import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return res.status(500).json({
      success: false,
      error: 'Chưa cấu hình biến môi trường Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).'
    });
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = (req.body && req.body.folder) || (req.query && req.query.folder) || 'phuctoanit/case-studies';

    // Cloudinary yêu cầu các param ký phải được sắp xếp theo bảng chữ cái A-Z
    // Ở đây có 2 params: 'folder' và 'timestamp'
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    return res.status(200).json({
      success: true,
      cloudName: CLOUD_NAME,
      apiKey: API_KEY,
      timestamp,
      folder,
      signature
    });
  } catch (err) {
    console.error('[Sign Cloudinary Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Lỗi tạo chữ ký xác thực Cloudinary'
    });
  }
}
