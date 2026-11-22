/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SITE STATISTICS & REALTIME ONLINE TRACKER
 * Portfolio: phuctoanit.id.vn (Hosted on Vercel)
 * 
 * Architecture:
 * - Credentials & Server-side Increments: Managed securely via Vercel
 *   Serverless Function (/api/stats) using Vercel Environment Variables
 *   (SUPABASE_URL, SUPABASE_ANON_KEY). No hardcoded keys in git!
 * - Realtime Online Counter: Connects via Supabase Realtime Presence
 *   using client-safe credentials provided by /api/stats.
 * - Session Deduplication: sessionStorage ('pt_site_visited')
 * - Bilingual Formatting: Dynamically updates with language switcher (EN | VI)
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  var SESSION_KEY = 'pt_site_visited';
  var CHANNEL_NAME = 'phuctoanit-online';

  // DOM Elements
  var onlineEl = null;
  var viewsEl = null;

  // Cached counts for instant re-formatting when language changes
  var cachedOnlineCount = 1;
  var cachedViewsCount = null;

  // ── HELPERS ─────────────────────────────────────────────────────────────────
  function getCurrentLang() {
    var htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang && (htmlLang === 'en' || htmlLang === 'vi')) {
      return htmlLang;
    }
    try {
      var saved = localStorage.getItem('preferred-lang');
      if (saved) return saved;
    } catch (e) { }
    return 'vi';
  }

  function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '--';
    var lang = getCurrentLang();
    try {
      return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'vi-VN').format(num);
    } catch (e) {
      return num.toString();
    }
  }

  function renderOnlineCount(count) {
    cachedOnlineCount = Math.max(1, count || 1);
    if (!onlineEl) onlineEl = document.getElementById('onlineCount');
    if (onlineEl) {
      onlineEl.textContent = formatNumber(cachedOnlineCount);
    }
  }

  function renderViewsCount(count) {
    cachedViewsCount = count;
    if (!viewsEl) viewsEl = document.getElementById('totalViewsCount');
    if (viewsEl) {
      viewsEl.textContent = formatNumber(count);
    }
  }

  // ── MAIN TRACKER ────────────────────────────────────────────────────────────
  async function initStatsTracker() {
    onlineEl = document.getElementById('onlineCount');
    viewsEl = document.getElementById('totalViewsCount');

    // Default safe fallback display
    renderOnlineCount(1);
    renderViewsCount(null);

    var hasVisited = false;
    try {
      hasVisited = sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch (e) { }

    var action = hasVisited ? 'get' : 'increment';

    // 1. Call Vercel Serverless Function /api/stats
    try {
      var res = await fetch('/api/stats?action=' + action, {
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        var data = await res.json();

        // If newly incremented, mark session
        if (!hasVisited && data.total_views !== null) {
          try {
            sessionStorage.setItem(SESSION_KEY, 'true');
          } catch (e) { }
        }

        if (data.total_views !== null) {
          renderViewsCount(data.total_views);
        }

        // 2. Initialize Realtime Presence for Online Users
        if (data.configured && data.supabaseUrl && data.supabaseAnonKey) {
          initRealtimePresence(data.supabaseUrl, data.supabaseAnonKey);
        }
      }
    } catch (err) {
      // Local development fallback or offline: check if local env exists
      handleLocalFallback();
    }
  }

  // ── REALTIME ONLINE PRESENCE (Supabase WebSocket) ───────────────────────────
  function initRealtimePresence(supabaseUrl, supabaseAnonKey) {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      return;
    }

    try {
      var client = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });

      var presenceKey = (window.crypto && typeof window.crypto.randomUUID === 'function')
        ? window.crypto.randomUUID()
        : 'pt_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

      var channel = client.channel(CHANNEL_NAME, {
        config: {
          presence: { key: presenceKey },
        },
      });

      // Synchronize active visitors
      channel.on('presence', { event: 'sync' }, function () {
        try {
          var state = channel.presenceState();
          var count = 0;
          for (var key in state) {
            if (Object.prototype.hasOwnProperty.call(state, key)) {
              count += (state[key] && state[key].length) ? state[key].length : 1;
            }
          }
          renderOnlineCount(Math.max(1, count));
        } catch (e) {
          renderOnlineCount(1);
        }
      });

      // Track presence on connect
      channel.subscribe(function (status) {
        if (status === 'SUBSCRIBED') {
          channel.track({
            online_at: new Date().toISOString(),
          }).catch(function () { });
        }
      });

      // Clean up when tab closes
      window.addEventListener('beforeunload', function () {
        try {
          channel.untrack();
        } catch (e) { }
      });
    } catch (err) {
      renderOnlineCount(1);
    }
  }

  function handleLocalFallback() {
    var url = window.__SUPABASE_URL__ || (window.__ENV__ && window.__ENV__.SUPABASE_URL);
    var key = window.__SUPABASE_ANON_KEY__ || (window.__ENV__ && window.__ENV__.SUPABASE_ANON_KEY);
    if (url && key && !url.includes('your-project-id')) {
      initRealtimePresence(url, key);
    }
  }

  // ── RE-FORMAT NUMBERS ON LANGUAGE CHANGE ───────────────────────────────────
  document.addEventListener('languageChanged', function () {
    if (cachedViewsCount !== null) {
      renderViewsCount(cachedViewsCount);
    }
    renderOnlineCount(cachedOnlineCount);
  });

  // ── INIT ───────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStatsTracker);
  } else {
    initStatsTracker();
  }
})();
