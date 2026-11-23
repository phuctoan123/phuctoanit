/**
 * blog-list.js — Quản lý tìm kiếm, lọc danh mục và hiển thị danh sách bài viết
 * Tác giả: Nguyễn Phúc Toàn – Sales Engineer
 */

(function () {
  'use strict';

  var allPosts = [];
  var currentCategory = 'all';
  var searchQuery = '';

  function getCurrentLang() {
    return document.documentElement.getAttribute('lang') || 'vi';
  }

  function renderPosts() {
    var grid = document.getElementById('blogListingGrid');
    var emptyState = document.getElementById('blogEmptyState');
    var resultMeta = document.getElementById('blogResultMeta');
    if (!grid) return;

    var currentLang = getCurrentLang();

    var filtered = allPosts.filter(function (post) {
      // Category filter
      if (currentCategory !== 'all' && post.category !== currentCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        var query = searchQuery.toLowerCase().trim();
        var title = ((currentLang === 'vi' ? post.title_vi : post.title_en) || post.title_vi || '').toLowerCase();
        var excerpt = ((currentLang === 'vi' ? post.excerpt_vi : post.excerpt_en) || post.excerpt_vi || '').toLowerCase();
        if (title.indexOf(query) === -1 && excerpt.indexOf(query) === -1) {
          return false;
        }
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (resultMeta) resultMeta.textContent = currentLang === 'vi' ? 'Hiển thị 0 bài viết' : 'Showing 0 articles';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (resultMeta) {
      resultMeta.textContent = currentLang === 'vi' 
        ? 'Hiển thị ' + filtered.length + ' bài viết chuyên sâu'
        : 'Showing ' + filtered.length + ' in-depth articles';
    }

    var html = filtered.map(function (post) {
      var title = (currentLang === 'vi' ? post.title_vi : post.title_en) || post.title_vi;
      var excerpt = (currentLang === 'vi' ? post.excerpt_vi : post.excerpt_en) || post.excerpt_vi;
      var readTime = (currentLang === 'vi' ? post.readTime_vi : post.readTime_en) || post.readTime_vi || '5 phút đọc';

      var catInfo = (window.BLOG_CATEGORIES && window.BLOG_CATEGORIES[post.category]) || {};
      var catName = (currentLang === 'vi' ? catInfo.vi : catInfo.en) || post.category;

      var serviceInfo = (window.BLOG_SERVICES_MAP && window.BLOG_SERVICES_MAP[post.relatedService]) || {};
      var serviceName = (currentLang === 'vi' ? serviceInfo.name_vi : serviceInfo.name_en) || '';

      var dateObj = new Date(post.publishedAt || Date.now());
      var formattedDate = dateObj.toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      var readMoreText = currentLang === 'vi' ? 'Đọc tiếp' : 'Read more';

      return [
        '<article class="blog-card" data-aos="fade-up" data-aos-duration="600">',
        '  <div class="blog-card-thumb">',
        '    <a href="blog-detail.html?slug=' + encodeURIComponent(post.slug) + '" tabindex="-1" aria-hidden="true">',
        '      <img src="' + post.thumbnail + '" alt="' + title.replace(/"/g, '&quot;') + '" loading="lazy" />',
        '    </a>',
        '    <span class="blog-badge badge-' + post.category + '">' + catName + '</span>',
        '  </div>',
        '  <div class="blog-card-body">',
        '    <div class="blog-card-meta">',
        '      <span><i class="fa-regular fa-calendar" aria-hidden="true"></i> ' + formattedDate + '</span>',
        '      <span class="meta-sep">•</span>',
        '      <span><i class="fa-regular fa-clock" aria-hidden="true"></i> ' + readTime + '</span>',
        '    </div>',
        '    <h2 class="blog-card-title">',
        '      <a href="blog-detail.html?slug=' + encodeURIComponent(post.slug) + '">' + title + '</a>',
        '    </h2>',
        '    <p class="blog-card-excerpt">' + excerpt + '</p>',
        '    <div class="blog-card-footer">',
        '      <a href="blog-detail.html?slug=' + encodeURIComponent(post.slug) + '" class="btn-read-more">',
        '        <span>' + readMoreText + '</span>',
        '        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>',
        '      </a>',
        serviceName ? '      <span class="blog-service-tag"><i class="fa-solid fa-tag" aria-hidden="true"></i> ' + serviceName + '</span>' : '',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('\n');
    }).join('\n');

    grid.innerHTML = html;
  }

  function setupFilters() {
    var filterTabs = document.querySelectorAll('#blogFilterNav .filter-tab');
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        currentCategory = tab.getAttribute('data-category') || 'all';
        renderPosts();
      });
    });

    var searchInput = document.getElementById('blogSearchInput');
    if (searchInput) {
      var debounceTimer;
      searchInput.addEventListener('input', function (e) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          searchQuery = e.target.value;
          renderPosts();
        }, 200);
      });
    }

    var btnReset = document.getElementById('btnResetFilter');
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        currentCategory = 'all';
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        var allTab = document.querySelector('#blogFilterNav .filter-tab[data-category="all"]');
        if (allTab) {
          filterTabs.forEach(function (t) { t.classList.remove('active'); });
          allTab.classList.add('active');
        }
        renderPosts();
      });
    }
  }

  function init() {
    if (window.BLOG_POSTS && Array.isArray(window.BLOG_POSTS)) {
      allPosts = window.BLOG_POSTS;
    }

    setupFilters();
    renderPosts();

    // Live Sync with Supabase
    var supabaseUrl = window.SUPABASE_URL || 'https://zsyiznoqbxyezejllqos.supabase.co';
    var supabaseAnonKey = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzeWl6bm9xYnh5ZXplamxscW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNTg1NjQsImV4cCI6MjA0NzczNDU2NH0.74hKj7lUa-fP8L_l-y6P2Yx-rV4y6T1sU8q0l-3d1kM';

    if (window.fetch && supabaseUrl && supabaseAnonKey) {
      fetch(supabaseUrl + '/rest/v1/posts?status=eq.published&order=published_at.desc', {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': 'Bearer ' + supabaseAnonKey
        }
      })
      .then(function (res) {
        if (!res.ok) throw new Error('Supabase fetch failed');
        return res.json();
      })
      .then(function (data) {
        if (Array.isArray(data) && data.length > 0) {
          allPosts = data.map(function(item) {
            return {
              id: item.id,
              slug: item.slug,
              category: item.category,
              thumbnail: item.thumbnail,
              thumbnail_alt: item.thumbnail_alt,
              readTime_vi: item.read_time_vi,
              readTime_en: item.read_time_en,
              publishedAt: item.published_at,
              relatedService: item.related_service,
              title_vi: item.title_vi,
              title_en: item.title_en,
              excerpt_vi: item.excerpt_vi,
              excerpt_en: item.excerpt_en,
              keyTakeaways_vi: item.key_takeaways_vi,
              keyTakeaways_en: item.key_takeaways_en,
              content_vi: item.content_vi,
              content_en: item.content_en,
              is_featured: item.is_featured
            };
          });
          renderPosts();
        }
      })
      .catch(function (err) {
        console.warn('[Blog Sync] Using local seed posts:', err);
      });
    }

    // Re-render when language is switched
    document.addEventListener('languageChanged', function () {
      renderPosts();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
