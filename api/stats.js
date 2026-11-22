// ═══════════════════════════════════════════════════════════════════════════════
// Vercel Serverless Function: /api/stats.js
// Reads SUPABASE_URL and SUPABASE_ANON_KEY from Vercel Environment Variables
// Zero dependencies needed (uses native Node 18+ fetch)
// ═══════════════════════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(200).json({
      configured: false,
      total_views: null,
      message: 'Supabase credentials not configured in Vercel Environment Variables.'
    });
  }

  // Detect bots and web crawlers
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);

  const shouldIncrement = req.query.action === 'increment' && !isBot;

  let totalViews = null;

  try {
    if (shouldIncrement) {
      // Call atomic increment RPC
      const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_views`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (rpcRes.ok) {
        totalViews = await rpcRes.json();
      }
    }

    // If not incrementing, or if increment failed, fetch current views
    if (totalViews === null) {
      const getRes = await fetch(`${SUPABASE_URL}/rest/v1/site_stats?id=eq.main&select=total_views`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (getRes.ok) {
        const rows = await getRes.json();
        totalViews = rows[0]?.total_views ?? null;
      }
    }

    return res.status(200).json({
      configured: true,
      total_views: totalViews,
      supabaseUrl: SUPABASE_URL,
      supabaseAnonKey: SUPABASE_ANON_KEY
    });
  } catch (error) {
    return res.status(200).json({
      configured: true,
      total_views: null,
      error: error.message
    });
  }
}
