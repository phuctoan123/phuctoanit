// ─────────────────────────────────────────────────────────────────────────────
// Hamburger Menu & Navigation Drawer Controller
// ─────────────────────────────────────────────────────────────────────────────
const hamburger = document.querySelector(".hamburger");
const mobileNavs = document.querySelector(".nav-links");

if (hamburger && mobileNavs) {
  const toggleMenu = (open) => {
    const shouldOpen = typeof open === "boolean" ? open : !mobileNavs.classList.contains("active");
    hamburger.classList.toggle("active", shouldOpen);
    mobileNavs.classList.toggle("active", shouldOpen);
    hamburger.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
  };

  // Toggle on hamburger click
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Auto close mobile drawer when any nav link is clicked
  const navItems = mobileNavs.querySelectorAll("ul li a");
  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu(false);
    });
  });

  // Click outside to close menu
  document.addEventListener("click", (e) => {
    if (
      mobileNavs.classList.contains("active") &&
      !mobileNavs.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });

  // Close with Escape key for accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNavs.classList.contains("active")) {
      toggleMenu(false);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Service Cards — Tap / click to flip on touch screens & keyboard
// ─────────────────────────────────────────────────────────────────────────────
(function initServiceCards() {
  const serviceCards = document.querySelectorAll('.service-card');
  if (!serviceCards.length) return;

  serviceCards.forEach((card) => {
    // Tap / Click to flip (useful for smartphones, tablets, or accessibility)
    card.addEventListener('click', (e) => {
      // Allow CTA button navigation to work normally without flipping back immediately
      if (e.target.closest('.service-btn')) {
        return;
      }
      card.classList.toggle('flipped');
    });

    // Keyboard navigation (Enter / Space key)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.service-btn')) return;
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
})();

// ─────────────────────────────────────────────────────────────────────────────
// Formspree Contact Form — Multi-Step B2B Wizard + Chips + Validation + AJAX
// ─────────────────────────────────────────────────────────────────────────────
(function initContactForm() {
  var form        = document.getElementById('contactForm');
  var successBox  = document.getElementById('formSuccess');
  var submitBtn   = document.getElementById('formSubmitBtn');
  var resetBtn    = document.getElementById('btnResetForm');
  if (!form || !successBox || !submitBtn) return;

  var currentStep = 1;
  var totalSteps  = 3;

  var progressBar = document.getElementById('wizardProgressBar');
  var stepIndicators = form.querySelectorAll('.wizard-step');
  var panels = form.querySelectorAll('.wizard-panel');

  var chipsWrapper = document.querySelector('.service-chips-wrapper');
  var hiddenServiceInput = document.getElementById('selectedService');
  var chipSoftware = document.getElementById('chipSoftwareManagement');
  var conditionalSoftwareField = document.getElementById('conditionalSoftwareField');
  var step1Error = document.getElementById('step1Error');
  var recapList = document.getElementById('servicesRecapList');

  var phoneInput = document.getElementById('cf-phone');
  var nameInput  = document.getElementById('cf-name');
  var emailInput = document.getElementById('cf-email');
  var msgInput   = document.getElementById('cf-message');
  var VN_PHONE_RE = /^(0[3-9][0-9]{8})$/;
  var syncSelectedServices = function() {};

  // ── Audio notification for successful submission ──
  var audioEl = document.getElementById('formSuccessAudio');
  var successAudio = audioEl || (typeof Audio !== 'undefined' ? new Audio('assets/sounds/sucess_sound.m4a') : null);

  function playSuccessSound() {
    try {
      if (!successAudio) {
        successAudio = new Audio('assets/sounds/sucess_sound.m4a');
      }
      successAudio.currentTime = 0;
      var playPromise = successAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(function(err) {
          console.warn('[Audio] Playback prevented by browser policy:', err);
        });
      }
    } catch (err) {
      console.warn('[Audio] Sound error:', err);
    }
  }

  // ── 1. Mark field as "touched" on blur
  var interactiveFields = form.querySelectorAll('input, textarea');
  interactiveFields.forEach(function(field) {
    field.addEventListener('blur', function() {
      field.classList.add('touched');
    });
    field.addEventListener('input', function() {
      if (field.validity.valid) field.classList.remove('touched');
    });
  });

  // ── 2. Interactive Service Chips & Dynamic Conditional Field
  if (chipsWrapper && hiddenServiceInput) {
    var chips = chipsWrapper.querySelectorAll('.service-chip');

    syncSelectedServices = function() {
      var selected = [];
      chips.forEach(function(chip) {
        if (chip.classList.contains('active')) {
          var labelEl = chip.querySelector('.chip-text');
          var textVal = labelEl ? labelEl.textContent.trim() : chip.getAttribute('data-value');
          selected.push(textVal || chip.getAttribute('data-value'));
        }
      });
      hiddenServiceInput.value = selected.join(', ');

      // Cập nhật recap list ở Bước 3
      if (recapList) {
        recapList.innerHTML = '';
        if (selected.length === 0) {
          var emptySpan = document.createElement('span');
          emptySpan.className = 'recap-empty';
          emptySpan.textContent = '—';
          recapList.appendChild(emptySpan);
        } else {
          var ul = document.createElement('ul');
          ul.className = 'recap-items';
          selected.forEach(function(item) {
            var li = document.createElement('li');
            li.className = 'recap-item';

            var plus = document.createElement('span');
            plus.className = 'recap-plus';
            plus.setAttribute('aria-hidden', 'true');
            plus.textContent = '+';

            var text = document.createElement('span');
            text.className = 'recap-text';
            text.textContent = item;

            li.appendChild(plus);
            li.appendChild(text);
            ul.appendChild(li);
          });
          recapList.appendChild(ul);
        }
      }

      // Ẩn lỗi nếu đã chọn ít nhất 1 dịch vụ
      if (selected.length > 0 && step1Error) {
        step1Error.hidden = true;
      }
    }

    chips.forEach(function(chip) {
      chip.addEventListener('click', function(e) {
        e.preventDefault();
        var isActive = chip.classList.toggle('active');
        chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');

        // Tính năng động: Hiển thị trường bổ sung khi chọn "Phần mềm quản lý / Khác"
        if (chip === chipSoftware && conditionalSoftwareField) {
          if (isActive) {
            conditionalSoftwareField.hidden = false;
            var inputDetail = conditionalSoftwareField.querySelector('input');
            if (inputDetail) setTimeout(function() { inputDetail.focus(); }, 100);
          } else {
            conditionalSoftwareField.hidden = true;
            var inputToClear = conditionalSoftwareField.querySelector('input');
            if (inputToClear) inputToClear.value = '';
          }
        }

        syncSelectedServices();
      });
    });

    document.addEventListener('languageChanged', syncSelectedServices);
  }

  // ── 3. Phone validation helper
  function validatePhone() {
    if (!phoneInput) return true;
    var val = phoneInput.value.replace(/[\s.\-]/g, '');
    if (!val && phoneInput.required) return false;
    if (val && !VN_PHONE_RE.test(val)) return false;
    return true;
  }

  // ── 4. Multi-Step Wizard Navigation
  function goToStep(step) {
    currentStep = step;

    // Progress bar width
    if (progressBar) {
      var percent = ((step) / totalSteps) * 100;
      progressBar.style.width = percent + '%';
      var progressContainer = form.querySelector('.wizard-progress');
      if (progressContainer) progressContainer.setAttribute('aria-valuenow', step);
    }

    // Step indicators state
    stepIndicators.forEach(function(indicator) {
      var s = parseInt(indicator.getAttribute('data-step'), 10);
      indicator.classList.remove('is-active', 'is-completed');
      if (s === step) {
        indicator.classList.add('is-active');
      } else if (s < step) {
        indicator.classList.add('is-completed');
      }
    });

    // Panels visibility
    panels.forEach(function(panel) {
      var p = parseInt(panel.getAttribute('data-panel'), 10);
      if (p === step) {
        panel.classList.add('is-active');
      } else {
        panel.classList.remove('is-active');
      }
    });

    // Smooth scroll to form header if scrolled past
    var formTop = form.getBoundingClientRect().top + window.pageYOffset - 100;
    if (window.pageYOffset > formTop) {
      window.scrollTo({ top: formTop, behavior: 'smooth' });
    }
  }

  // Next buttons
  var nextBtns = form.querySelectorAll('.wizard-btn--next');
  nextBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetStep = parseInt(btn.getAttribute('data-next'), 10);

      if (currentStep === 1) {
        // Validation Step 1: Phải chọn ít nhất 1 dịch vụ
        if (!hiddenServiceInput || !hiddenServiceInput.value.trim()) {
          if (step1Error) {
            step1Error.hidden = false;
            step1Error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          return;
        }
        goToStep(2);
      } else if (currentStep === 2) {
        // Validation Step 2: Họ tên, Email, SĐT
        var step2Valid = true;
        [nameInput, phoneInput, emailInput].forEach(function(f) {
          if (f) {
            f.classList.add('touched');
            if (!f.checkValidity()) step2Valid = false;
          }
        });

        if (!validatePhone()) {
          if (phoneInput) phoneInput.classList.add('touched');
          step2Valid = false;
        }

        if (!step2Valid) {
          var firstInvalid = form.querySelector('.wizard-panel[data-panel="2"] input:invalid');
          if (firstInvalid) firstInvalid.focus();
          else if (!validatePhone() && phoneInput) phoneInput.focus();
          return;
        }

        goToStep(3);
      }
    });
  });

  // Back buttons
  var backBtns = form.querySelectorAll('.wizard-btn--back');
  backBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetStep = parseInt(btn.getAttribute('data-back'), 10);
      goToStep(targetStep);
    });
  });

  // ── 5. Toast helper
  function showToast(msg) {
    var toast = document.getElementById('formToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'formToast';
      toast.className = 'form-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i><span></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector('span').textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 5000);
  }

  // ── 6. AJAX Submit (Step 3)
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Check textarea
    if (msgInput) {
      msgInput.classList.add('touched');
      if (!msgInput.checkValidity()) {
        msgInput.focus();
        return;
      }
    }

    // Prime audio buffer synchronously during user click gesture (for iOS/Safari compatibility)
    if (successAudio) {
      try {
        successAudio.load();
      } catch (err) {}
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');

    var payload = {
      name: (form.querySelector('[name="name"]') || {}).value || '',
      company: (form.querySelector('[name="company"]') || {}).value || '',
      phone: (form.querySelector('[name="phone"]') || {}).value || '',
      email: (form.querySelector('[name="email"]') || {}).value || '',
      message: (form.querySelector('[name="message"]') || {}).value || '',
      dich_vu_quan_tam: (form.querySelector('#selectedService') || {}).value || '',
      nganh_nghe_quy_mo: (form.querySelector('[name="nganh_nghe_quy_mo"]') || {}).value || ''
    };

    var supabaseUrl = 'https://zsyiznoqbxyezejllqos.supabase.co';
    var supabaseAnonKey = 'sb_publishable_BJVKtPhE6IbpEf5fdyGhUQ_NgjIH9fA';

    var servicesList = payload.dich_vu_quan_tam
      ? payload.dich_vu_quan_tam.split(',').map(function(s) { return s.trim(); }).filter(Boolean)
      : ['Chung / Khác'];

    var supabasePayload = {
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      email: payload.email.trim(),
      company: payload.company.trim() || null,
      services: servicesList,
      other_industry: payload.nganh_nghe_quy_mo.trim() || null,
      message: payload.message.trim(),
      source: 'website',
      status: 'new'
    };

    function sendDirectToSupabase() {
      return fetch(supabaseUrl + '/rest/v1/leads', {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': 'Bearer ' + supabaseAnonKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(supabasePayload)
      }).then(function(sRes) {
        if (!sRes.ok && sRes.status !== 201) throw new Error('Supabase direct insert failed');
        return { success: true };
      });
    }

    // Gửi qua /api/lead trước, nếu không được thì gọi thẳng Supabase REST API
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function(res) {
      if (res.ok) return res.json();
      return sendDirectToSupabase();
    })
    .then(function() {
      // Gửi Formspree chạy ngầm làm kênh dự phòng email
      try {
        var formData = new FormData(form);
        fetch(form.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } }).catch(function(){});
      } catch (err) {}

      form.hidden = true;
      successBox.hidden = false;
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Play celebration / success sound
      playSuccessSound();

      var lang = document.documentElement.lang || 'vi';
      var msg = (lang === 'vi')
        ? 'Cảm ơn bạn đã kết nối! Kỹ sư Phúc Toàn sẽ phản hồi trong 30 phút làm việc.'
        : 'Thank you for reaching out! Sales Engineer Phuc Toan will respond within 30 working minutes.';
      showToast(msg);
    })
    .catch(function(err) {
      console.warn('[ContactForm] Supabase/API failed, attempting Formspree fallback:', err);
      // Fallback cuối cùng: gửi qua Formspree nếu cả 2 phương thức trên gặp sự cố mạng
      var formData = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function(fRes) {
        if (fRes.ok) {
          form.hidden = true;
          successBox.hidden = false;
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          playSuccessSound();
          var lang = document.documentElement.lang || 'vi';
          showToast((lang === 'vi')
            ? 'Cảm ơn bạn đã kết nối! Kỹ sư Phúc Toàn sẽ phản hồi trong 30 phút làm việc.'
            : 'Thank you for reaching out! Sales Engineer Phuc Toan will respond within 30 working minutes.');
        } else {
          throw new Error('All submission channels failed');
        }
      })
      .catch(function(finalErr) {
        console.error('[ContactForm] Final error:', finalErr);
        var lang = document.documentElement.lang || 'vi';
        var errMsg = (lang === 'vi')
          ? 'Gửi thất bại. Bạn có thể chat Zalo trực tiếp ngay qua nút bên dưới.'
          : 'Submission failed. You can chat directly via Zalo using the button below.';
        showToast(errMsg);

        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
      });
    });
  });

  // ── 7. Reset form ("Gửi thêm yêu cầu khác")
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      form.reset();
      interactiveFields.forEach(function(f) { f.classList.remove('touched'); });
      if (chipsWrapper) {
        var allChips = chipsWrapper.querySelectorAll('.service-chip');
        allChips.forEach(function(c) {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
      }
      if (conditionalSoftwareField) {
        conditionalSoftwareField.hidden = true;
      }
      if (hiddenServiceInput) hiddenServiceInput.value = '';
      if (step1Error) step1Error.hidden = true;
      syncSelectedServices();

      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');

      goToStep(1);

      successBox.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();

// ─────────────────────────────────────────────────────────────────────────────
// Floating Social Dock — Sequential Glow Wave (Lần lượt sáng lên rồi tắt)
// ─────────────────────────────────────────────────────────────────────────────
(function initSocialDockPulse() {
  const dock = document.querySelector('.floating-social-dock');
  if (!dock) return;
  const links = dock ? dock.querySelectorAll('.dock-link') : [];
  if (!links.length) return;

  let isHovered = false;
  dock.addEventListener('mouseenter', () => { isHovered = true; });
  dock.addEventListener('mouseleave', () => { isHovered = false; });
  dock.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });

  function playSequentialGlow() {
    // Tạm dừng khi người dùng đang rê chuột hoặc tab trình duyệt đang ẩn
    if (isHovered || document.hidden) return;

    links.forEach((link, idx) => {
      setTimeout(() => {
        if (isHovered) return;
        link.classList.add('pulse-glow');
        setTimeout(() => {
          link.classList.remove('pulse-glow');
        }, 650); // Sáng nổi bật trong 650ms rồi chuyển về trung tính
      }, idx * 260); // Mỗi biểu tượng cách nhau 260ms tạo hiệu ứng lượn sóng
    });
  }

  // Chạy lần đầu sau 2.5 giây khi tải trang, sau đó lặp lại đều đặn mỗi 7 giây
  setTimeout(playSequentialGlow, 2500);
  setInterval(playSequentialGlow, 7000);
})();

/* ════════════════════════════════════════════════════════════════════════════
   FLOATING DOCK — Collapse/Expand (desktop) + FAB toggle (mobile)
   ════════════════════════════════════════════════════════════════════════════ */
(function initFloatingDock() {
  const wrapper    = document.getElementById('floatingDock');
  const dockToggle = document.getElementById('dockToggle');   // desktop tab
  const fabTrigger = document.getElementById('fabTrigger');   // mobile FAB
  if (!wrapper) return;

  /* ── DESKTOP: Collapse / Expand ── */
  if (dockToggle) {
    // Restore persisted state
    if (localStorage.getItem('dockCollapsed') === '1') {
      wrapper.classList.add('collapsed');
      dockToggle.setAttribute('aria-expanded', 'false');
    }

    dockToggle.addEventListener('click', function () {
      var isCollapsed = wrapper.classList.toggle('collapsed');
      dockToggle.setAttribute('aria-expanded', String(!isCollapsed));
      localStorage.setItem('dockCollapsed', isCollapsed ? '1' : '0');
    });
  }

  /* ── MOBILE: FAB toggle ── */
  if (fabTrigger) {
    fabTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = wrapper.classList.toggle('fab-open');
      fabTrigger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!wrapper.contains(e.target) && wrapper.classList.contains('fab-open')) {
        wrapper.classList.remove('fab-open');
        fabTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && wrapper.classList.contains('fab-open')) {
        wrapper.classList.remove('fab-open');
        fabTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();


/* ════════════════════════════════════════════════════════════════════════════
   CTA TOAST — Smart notification: xuất hiện lặp lại cứ 7 giây 1 lần
   ════════════════════════════════════════════════════════════════════════════ */
function initCtaToast() {
  var INTERVAL_MS = 7000;  // 7 giây lặp lại 1 lần
  var DISPLAY_MS  = 4500;  // Hiển thị trong 4.5 giây rồi tự động ẩn

  // Dọn dẹp key session cũ nếu có
  try {
    sessionStorage.removeItem('ctaToastShown');
  } catch (err) {}

  var toast      = document.getElementById('ctaToast');
  var closeBtn   = document.getElementById('ctaToastClose');
  var ctaBtn     = document.getElementById('ctaToastBtn');
  if (!toast) return;

  var autoHideTimer = null;
  var nextShowTimer = null;

  function showToast() {
    clearTimeout(nextShowTimer);
    clearTimeout(autoHideTimer);

    toast.hidden = false;
    // Force reflow so transition triggers
    toast.getBoundingClientRect();
    toast.classList.remove('is-hiding');
    toast.classList.add('is-visible');

    // Tự động ẩn sau DISPLAY_MS
    autoHideTimer = setTimeout(hideToast, DISPLAY_MS);
  }

  function hideToast() {
    clearTimeout(autoHideTimer);
    clearTimeout(nextShowTimer);

    toast.classList.add('is-hiding');
    toast.classList.remove('is-visible');

    setTimeout(function () {
      toast.hidden = true;
      toast.classList.remove('is-hiding');
    }, 420);

    // Lên lịch xuất hiện lại sau 7 giây
    nextShowTimer = setTimeout(showToast, INTERVAL_MS);
  }

  // Khởi động: lần đầu tiên xuất hiện sau 7 giây
  nextShowTimer = setTimeout(showToast, INTERVAL_MS);

  // Expose global test helper
  window.showCtaToast = function () {
    showToast();
  };
  window.hideCtaToast = function () {
    hideToast();
  };

  // Close button: đóng và lên lịch 7s sau hiện lại
  if (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      hideToast();
    });
  }

  // CTA button: hide toast after navigation
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function (e) {
      e.preventDefault();
      hideToast();
      var contactSection = document.getElementById('contact');
      if (contactSection) {
        if (typeof window.smoothScrollTo === 'function') {
          window.smoothScrollTo(contactSection, -20, function () {
            var firstInput = contactSection.querySelector('input:not([type=hidden]), textarea');
            if (firstInput) firstInput.focus({ preventScroll: true });
          });
        } else {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCtaToast);
} else {
  initCtaToast();
}

/* ════════════════════════════════════════════════════════════════════════════
   SLOW SMOOTH SCROLL — Custom eased scroll for all #contact anchor links
   Duration: 1200ms, easing: easeInOutCubic
   ════════════════════════════════════════════════════════════════════════════ */
(function initSlowSmoothScroll() {
  var DURATION = 1200; // ms — điều chỉnh để cuộn nhanh/chậm hơn

  /**
   * Easing: easeInOutCubic
   * t: 0→1, trả về giá trị 0→1 theo đường cong mượt
   */
  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Scroll mượt chậm đến phần tử target
   * @param {Element} target  - phần tử đích
   * @param {number}  offset  - offset thêm (px, dương = cuộn thêm xuống)
   * @param {Function} [onDone] - callback sau khi xong
   */
  function smoothScrollTo(target, offset, onDone) {
    offset = offset || 0;
    var startY  = window.pageYOffset;
    var targetY = target.getBoundingClientRect().top + startY + offset;
    var diff    = targetY - startY;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed  = timestamp - startTime;
      var progress = Math.min(elapsed / DURATION, 1);
      var eased    = easeInOutCubic(progress);

      window.scrollTo(0, startY + diff * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (typeof onDone === 'function') {
        onDone();
      }
    }

    requestAnimationFrame(step);
  }

  // Áp dụng cho tất cả anchor link trỏ đến #contact
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href="#contact"]');
    if (!link) return;

    var target = document.getElementById('contact');
    if (!target) return;

    e.preventDefault();
    smoothScrollTo(target, -20, function () {
      // Focus vào ô input đầu tiên sau khi scroll xong
      var firstInput = target.querySelector('input:not([type=hidden]), textarea');
      if (firstInput) firstInput.focus({ preventScroll: true });
    });
  });

  // Expose để dùng ở nơi khác (toast CTA)
  window.smoothScrollTo = smoothScrollTo;
})();

/* ════════════════════════════════════════════════════════════════════════════
   PROJECTS 3D COVERFLOW CAROUSEL (Swiper.js)
   ════════════════════════════════════════════════════════════════════════════ */
(function initProjectsCoverflow() {
  var projectsSwiper = null;

  // 1. Initialize Swiper 3D Coverflow
  function initSwiper() {
    var sliderEl = document.querySelector('.projects-coverflow-slider');
    if (!sliderEl) return;

    if (typeof Swiper === 'undefined') {
      setTimeout(initSwiper, 150);
      return;
    }

    try {
      projectsSwiper = new Swiper(sliderEl, {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        speed: 550,
        touchAngle: 45,
        preventInteractionOnTransition: false,
        touchStartPreventDefault: false,
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        coverflowEffect: {
          rotate: 22,
          stretch: 0,
          depth: 160,
          modifier: 1,
          slideShadows: true,
        },
        pagination: {
          el: '.projects-swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.projects-swiper-btn.swiper-button-next',
          prevEl: '.projects-swiper-btn.swiper-button-prev',
        },
        breakpoints: {
          320: {
            coverflowEffect: {
              rotate: 0,
              stretch: 0,
              depth: 50,
              modifier: 1,
              slideShadows: false,
            }
          },
          768: {
            coverflowEffect: {
              rotate: 15,
              stretch: 0,
              depth: 110,
              modifier: 1,
              slideShadows: true,
            }
          },
          1024: {
            coverflowEffect: {
              rotate: 22,
              stretch: 0,
              depth: 160,
              modifier: 1,
              slideShadows: true,
            }
          }
        }
      });
    } catch (e) {
      console.warn('Swiper init error:', e);
    }
  }

  // 3. Category Filter Tabs
  function initFilterTabs() {
    var tabBtns = document.querySelectorAll('.portfolio-tab-btn');
    var slides = document.querySelectorAll('.project-card-slide');
    if (!tabBtns.length || !slides.length) return;

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        tabBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        var firstVisibleIndex = -1;
        var visibleCount = 0;
        slides.forEach(function (slide) {
          var cat = slide.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            slide.classList.remove('is-filtered-out');
            if (firstVisibleIndex === -1) firstVisibleIndex = visibleCount;
            visibleCount++;
          } else {
            slide.classList.add('is-filtered-out');
          }
        });

        if (projectsSwiper) {
          projectsSwiper.update();
          if (firstVisibleIndex !== -1) {
            projectsSwiper.slideTo(firstVisibleIndex, 400);
          }
        }
      });
    });
  }

  // 4. Fetch dynamic projects from Supabase CMS
  var cachedStudies = null;

  function renderDynamicProjects(studies) {
    if (!Array.isArray(studies) || studies.length === 0) return;
    var wrapper = document.querySelector('.projects-coverflow-slider .swiper-wrapper');
    if (!wrapper) return;

    var currentLang = document.documentElement.getAttribute('lang') || 'vi';

    var fallbackImages = [
      'assets/images/project-nhipbac.jpg',
      'assets/images/project-hautanthe.jpg',
      'assets/images/project-one.jpg',
      'assets/images/project-two.jpg',
      'assets/images/project-four.jpg',
      'assets/images/project-five.jpg',
      'assets/images/project-six.jpg'
    ];

    var html = studies.map(function (item, index) {
      var title = (currentLang === 'vi' ? item.title_vi : item.title_en) || item.title_vi || item.industry_vi || 'Dự án';
      var industry = (currentLang === 'vi' ? item.industry_vi : item.industry_en) || item.industry_vi || 'Giải pháp';
      var desc = (currentLang === 'vi' ? item.problem_vi : item.problem_en) || item.problem_vi || item.solution_vi || '';
      var img = item.image_url || fallbackImages[index % fallbackImages.length];

      var cat = 'commerce';
      var lower = (industry + ' ' + title).toLowerCase();
      if (lower.includes('logistics') || lower.includes('vận hành') || lower.includes('game') || lower.includes('web app') || lower.includes('giáo dục')) {
        cat = 'operations';
      } else if (lower.includes('bđs') || lower.includes('bất động sản') || lower.includes('sản xuất') || lower.includes('doanh nghiệp') || lower.includes('luật')) {
        cat = 'enterprise';
      }

      var statusTag = item.demo_url
        ? '<a href="' + item.demo_url + '" target="_blank" rel="noopener noreferrer" class="project-status-tag project-status-tag--live" title="Xem demo">' +
            '<span class="live-dot"></span> LIVE DEMO ↗' +
          '</a>'
        : '<span class="project-status-tag">' +
            '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Đã triển khai thực tế' +
          '</span>';

      return (
        '<div class="swiper-slide project-card-slide" data-category="' + cat + '" data-project-id="' + item.id + '">' +
          '<article class="project-card">' +
            '<div class="project-card__header">' +
              '<span class="project-badge project-badge--live">' +
                '<i class="fa-solid fa-layer-group" aria-hidden="true"></i> ' +
                '<span>' + industry + '</span>' +
              '</span>' +
              statusTag +
            '</div>' +
            '<div class="project-card__media">' +
              '<img src="' + img + '" alt="' + title + '" loading="lazy" onerror="this.src=\'assets/images/project-one.jpg\'">' +
            '</div>' +
            '<div class="project-card__body">' +
              '<h3 class="project-card__title">' + title + '</h3>' +
              '<p class="project-card__desc">' + desc + '</p>' +
            '</div>' +
          '</article>' +
        '</div>'
      );
    }).join('');

    wrapper.innerHTML = html;

    if (projectsSwiper) {
      try {
        projectsSwiper.update();
        projectsSwiper.slideTo(0, 0);
      } catch (e) {}
    }
    initFilterTabs();
  }

  function loadDynamicProjects() {
    var supabaseUrl = 'https://zsyiznoqbxyezejllqos.supabase.co';
    var supabaseAnonKey = 'sb_publishable_BJVKtPhE6IbpEf5fdyGhUQ_NgjIH9fA';

    fetch(supabaseUrl + '/rest/v1/case_studies?is_active=eq.true&order=sort_order.asc', {
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
        cachedStudies = data;
        renderDynamicProjects(data);
      }
    })
    .catch(function (err) {
      console.warn('[Portfolio Sync] Using fallback static projects:', err);
    });
  }

  document.addEventListener('languageChanged', function () {
    if (cachedStudies) {
      renderDynamicProjects(cachedStudies);
    }
  });

  // 5. Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initSwiper();
      initFilterTabs();
      loadDynamicProjects();
    });
  } else {
    initSwiper();
    initFilterTabs();
    loadDynamicProjects();
  }
})();

/* ═══════════════════════════════════════════════════════════════════════════
   HOMEPAGE BLOG / INSIGHTS RENDERER
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var cachedPosts = null;

  function renderHomepageBlog(posts) {
    var container = document.getElementById('homepage-blog-grid');
    if (!container) return;

    var currentLang = document.documentElement.getAttribute('lang') || 'vi';
    var topPosts = posts.slice(0, 3);

    var html = topPosts.map(function (post) {
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
        '<article class="blog-card" data-aos="fade-up" data-aos-duration="700">',
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
        '    <h3 class="blog-card-title">',
        '      <a href="blog-detail.html?slug=' + encodeURIComponent(post.slug) + '">' + title + '</a>',
        '    </h3>',
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

    container.innerHTML = html;
  }

  function initBlog() {
    var container = document.getElementById('homepage-blog-grid');
    if (!container) return;

    if (window.BLOG_POSTS && Array.isArray(window.BLOG_POSTS)) {
      cachedPosts = window.BLOG_POSTS;
      renderHomepageBlog(cachedPosts);
    }

    // Try fetching live posts from Supabase if configured
    var supabaseUrl = window.SUPABASE_URL || 'https://zsyiznoqbxyezejllqos.supabase.co';
    var supabaseAnonKey = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzeWl6bm9xYnh5ZXplamxscW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNTg1NjQsImV4cCI6MjA0NzczNDU2NH0.74hKj7lUa-fP8L_l-y6P2Yx-rV4y6T1sU8q0l-3d1kM';

    if (window.fetch && supabaseUrl && supabaseAnonKey) {
      fetch(supabaseUrl + '/rest/v1/posts?status=eq.published&order=published_at.desc&limit=3', {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': 'Bearer ' + supabaseAnonKey
        }
      })
      .then(function (res) {
        if (!res.ok) throw new Error('Supabase posts fetch failed');
        return res.json();
      })
      .then(function (data) {
        if (Array.isArray(data) && data.length > 0) {
          // Normalize Supabase fields to match client format
          var mapped = data.map(function(item) {
            return {
              id: item.id,
              slug: item.slug,
              category: item.category,
              thumbnail: item.thumbnail,
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
              content_en: item.content_en
            };
          });
          cachedPosts = mapped;
          renderHomepageBlog(cachedPosts);
        }
      })
      .catch(function () {
        // Fallback to static seed data
        if (window.BLOG_POSTS) {
          cachedPosts = window.BLOG_POSTS;
          renderHomepageBlog(cachedPosts);
        }
      });
    }
  }

  document.addEventListener('languageChanged', function () {
    if (cachedPosts) {
      renderHomepageBlog(cachedPosts);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlog);
  } else {
    initBlog();
  }
})();
