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

    var data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(function(res) {
      if (res.ok) {
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
      } else {
        return res.json().then(function(json) {
          throw new Error(json.error || 'Server error');
        });
      }
    })
    .catch(function(err) {
      console.error('[ContactForm] Submit error:', err);
      var lang = document.documentElement.lang || 'vi';
      var errMsg = (lang === 'vi')
        ? 'Gửi thất bại. Bạn có thể chat Zalo trực tiếp ngay qua nút bên dưới.'
        : 'Submission failed. You can chat directly via Zalo using the button below.';
      showToast(errMsg);

      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
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
