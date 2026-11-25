/**
 * blog-detail.js — Điều hướng, hiển thị chi tiết bài viết, tạo mục lục tự động (TOC) & Contextual CTA
 * Tác giả: Nguyễn Phúc Toàn – Sales Engineer (Nasani)
 */

(function () {
  'use strict';

  var currentPost = null;

  function getCurrentLang() {
    return document.documentElement.getAttribute('lang') || 'vi';
  }

  function getSlugFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('slug');
  }

  function findPostBySlug(slug) {
    if (!window.BLOG_POSTS || !window.BLOG_POSTS.length) return null;
    if (!slug) return window.BLOG_POSTS[0];

    for (var i = 0; i < window.BLOG_POSTS.length; i++) {
      if (window.BLOG_POSTS[i].slug === slug) {
        return window.BLOG_POSTS[i];
      }
    }
    return window.BLOG_POSTS[0];
  }

  function renderPostDetail(post) {
    if (!post) return;
    currentPost = post;

    var currentLang = getCurrentLang();
    var title = (currentLang === 'vi' ? post.title_vi : post.title_en) || post.title_vi;
    var excerpt = (currentLang === 'vi' ? post.excerpt_vi : post.excerpt_en) || post.excerpt_vi;
    var content = (currentLang === 'vi' ? post.content_vi : post.content_en) || post.content_vi;
    var readTime = (currentLang === 'vi' ? post.readTime_vi : post.readTime_en) || post.readTime_vi || '5 phút đọc';
    var takeaways = (currentLang === 'vi' ? post.keyTakeaways_vi : post.keyTakeaways_en) || post.keyTakeaways_vi || [];

    var catInfo = (window.BLOG_CATEGORIES && window.BLOG_CATEGORIES[post.category]) || {};
    var catName = (currentLang === 'vi' ? catInfo.vi : catInfo.en) || post.category;

    // 1. Meta & Document Title for SEO
    var pageTitleEl = document.getElementById('pageTitle');
    if (pageTitleEl) pageTitleEl.textContent = title + ' – Nguyễn Phúc Toàn';
    document.title = title + ' – Nguyễn Phúc Toàn (Sales Engineer)';

    var metaDesc = document.getElementById('metaDescription');
    if (metaDesc) metaDesc.setAttribute('content', excerpt);
    var ogTitle = document.getElementById('ogTitle');
    if (ogTitle) ogTitle.setAttribute('content', title);
    var ogDesc = document.getElementById('ogDesc');
    if (ogDesc) ogDesc.setAttribute('content', excerpt);

    // 2. Breadcrumbs
    var breadcrumbCat = document.getElementById('breadcrumbCategory');
    if (breadcrumbCat) breadcrumbCat.textContent = catName;

    // 3. Category Badge & Date
    var badgeEl = document.getElementById('articleBadge');
    if (badgeEl) {
      badgeEl.className = 'blog-badge badge-' + post.category;
      badgeEl.textContent = catName;
    }

    var dateObj = new Date(post.publishedAt || Date.now());
    var formattedDate = dateObj.toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    var dateEl = document.getElementById('articleDate');
    if (dateEl) dateEl.innerHTML = '<i class="fa-regular fa-calendar" aria-hidden="true"></i> ' + formattedDate;

    var readTimeEl = document.getElementById('articleReadTime');
    if (readTimeEl) readTimeEl.innerHTML = '<i class="fa-regular fa-clock" aria-hidden="true"></i> ' + readTime;

    // 4. H1 Title
    var titleEl = document.getElementById('articleTitle');
    if (titleEl) titleEl.textContent = title;

    // 5. Cover Image
    var coverImg = document.getElementById('articleCoverImg');
    if (coverImg) {
      coverImg.src = post.thumbnail;
      coverImg.alt = title;
    }

    // 6. Key Takeaways Box
    var takeawaysList = document.getElementById('articleTakeawaysList');
    if (takeawaysList) {
      takeawaysList.innerHTML = takeaways.map(function (point) {
        return '<li>' + point + '</li>';
      }).join('\n');
    }

    // 7. Rich Article Body
    var bodyEl = document.getElementById('articleBody');
    if (bodyEl) {
      bodyEl.innerHTML = content;
      generateTableOfContents(bodyEl);
    }

    // 8. Contextual CTA Box linked to relatedService
    var serviceMap = window.BLOG_SERVICES_MAP && window.BLOG_SERVICES_MAP[post.relatedService];
    if (serviceMap) {
      var ctaBadge = document.getElementById('ctaBadge');
      var ctaHeading = document.getElementById('ctaHeading');
      var ctaDesc = document.getElementById('ctaDesc');
      var ctaBtnText = document.getElementById('ctaBtnText');
      var ctaBtn = document.getElementById('ctaBtn');

      if (ctaBadge) ctaBadge.textContent = (currentLang === 'vi' ? serviceMap.name_vi : serviceMap.name_en);
      if (ctaHeading) ctaHeading.textContent = currentLang === 'vi' 
        ? 'Cần giải quyết bài toán này cho doanh nghiệp của bạn?' 
        : 'Need to solve this challenge for your enterprise?';
      if (ctaDesc) ctaDesc.textContent = (currentLang === 'vi' ? serviceMap.cta_vi : serviceMap.cta_en);
      if (ctaBtnText) ctaBtnText.textContent = (currentLang === 'vi' ? serviceMap.btn_vi : serviceMap.btn_en);
      if (ctaBtn) {
        ctaBtn.href = 'index.html#contact';
        ctaBtn.addEventListener('click', function () {
          try {
            sessionStorage.setItem('preferred_service', serviceMap.serviceCode || '');
          } catch(e) {}
        });
      }
    }
  }

  // 9. Generate Dynamic Table of Contents (TOC) with Active ScrollSpy
  function generateTableOfContents(contentContainer) {
    var tocList = document.getElementById('articleTocList');
    var tocCard = document.getElementById('articleTocCard');
    if (!tocList || !contentContainer) return;

    var headings = contentContainer.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      if (tocCard) tocCard.style.display = 'none';
      return;
    }
    if (tocCard) tocCard.style.display = 'block';

    var html = '';
    headings.forEach(function (h, index) {
      var anchorId = 'heading-sec-' + index;
      h.id = anchorId;
      var isH3 = h.tagName.toLowerCase() === 'h3';
      var titleText = h.textContent || '';

      html += '<li class="' + (isH3 ? 'toc-h3' : 'toc-h2') + '">';
      html += '  <a href="#' + anchorId + '" data-target="' + anchorId + '">' + titleText + '</a>';
      html += '</li>';
    });

    tocList.innerHTML = html;

    // Smooth Scroll on Click
    var tocLinks = tocList.querySelectorAll('a');
    tocLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = link.getAttribute('data-target');
        var targetEl = document.getElementById(targetId);
        if (targetEl) {
          var yOffset = -100;
          var y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          history.pushState(null, null, '#' + targetId);
        }
      });
    });

    // ScrollSpy to highlight active heading
    setupScrollSpy(headings, tocLinks);
  }

  function setupScrollSpy(headings, tocLinks) {
    if (!('IntersectionObserver' in window)) {
      window.addEventListener('scroll', function () {
        var scrollPos = window.scrollY + 120;
        headings.forEach(function (h) {
          if (h.offsetTop <= scrollPos) {
            tocLinks.forEach(function (link) {
              link.classList.toggle('active', link.getAttribute('data-target') === h.id);
            });
          }
        });
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          tocLinks.forEach(function (link) {
            if (link.getAttribute('data-target') === id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0
    });

    headings.forEach(function (h) {
      observer.observe(h);
    });
  }

  function init() {
    var slug = getSlugFromUrl();
    var post = findPostBySlug(slug);
    renderPostDetail(post);

    // Live Sync from Supabase
    var supabaseUrl = window.SUPABASE_URL || 'https://zsyiznoqbxyezejllqos.supabase.co';
    var supabaseAnonKey = window.SUPABASE_ANON_KEY || 'sb_publishable_BJVKtPhE6IbpEf5fdyGhUQ_NgjIH9fA';

    if (window.fetch && supabaseUrl && supabaseAnonKey && slug) {
      fetch(supabaseUrl + '/rest/v1/posts?slug=eq.' + encodeURIComponent(slug) + '&status=eq.published&limit=1', {
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
          var item = data[0];
          var mapped = {
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
          renderPostDetail(mapped);
        }
      })
      .catch(function (err) {
        console.warn('[Blog Detail Sync] Using local post:', err);
      });
    }

    // Re-render when language switched
    document.addEventListener('languageChanged', function () {
      if (currentPost) {
        renderPostDetail(currentPost);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
