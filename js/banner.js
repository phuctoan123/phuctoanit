/**
 * banner.js — Video Background Controller & Bilingual Typewriter Effect
 * Built specifically for the Sales Engineer portfolio banner.
 * Dependency-free, lightweight, responsive & performance-optimized.
 */
(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. VIDEO BACKGROUND CONTROLLER
  // ═══════════════════════════════════════════════════════════════════════════
  function initVideo() {
    var banner = document.querySelector('.banner');
    var video = document.querySelector('.banner-video');
    if (!banner || !video) return;

    // Ensure video plays (some browsers require explicit play call)
    video.muted = true;
    var playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        // Autoplay policy prevented playback, video will play on first user interaction
        var resumeOnInteraction = function () {
          video.play();
          document.removeEventListener('click', resumeOnInteraction);
          document.removeEventListener('touchstart', resumeOnInteraction);
        };
        document.addEventListener('click', resumeOnInteraction);
        document.addEventListener('touchstart', resumeOnInteraction);
      });
    }

    // Auto pause video when scrolled off-screen to save CPU / battery
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.1 });
      observer.observe(banner);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. BILINGUAL TYPEWRITER EFFECT
  // ═══════════════════════════════════════════════════════════════════════════
  var typewriter = {
    el: null,
    strings: ['Sales Engineer', 'Solution Consultant', 'Pre-sales Specialist', 'Tech Solutions Architect'],
    strIdx: 0,
    charIdx: 0,
    isDeleting: false,
    timer: null,
    typeSpeed: 75,
    backSpeed: 40,
    backDelay: 1900,
    startDelay: 500,

    tick: function () {
      if (!this.el) return;
      var currentStr = this.strings[this.strIdx] || '';
      var self = this;

      if (this.isDeleting) {
        this.charIdx--;
        this.el.textContent = currentStr.substring(0, this.charIdx);
      } else {
        this.charIdx++;
        this.el.textContent = currentStr.substring(0, this.charIdx);
      }

      var nextDelay = this.typeSpeed;

      if (!this.isDeleting && this.charIdx === currentStr.length) {
        // Full word typed, pause before deleting
        nextDelay = this.backDelay;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIdx === 0) {
        // Finished deleting, move to next string
        this.isDeleting = false;
        this.strIdx = (this.strIdx + 1) % this.strings.length;
        nextDelay = 350;
      } else if (this.isDeleting) {
        nextDelay = this.backSpeed;
      }

      this.timer = setTimeout(function () {
        self.tick();
      }, nextDelay);
    },

    updateStrings: function (newStrings) {
      if (!newStrings || !newStrings.length) return;
      clearTimeout(this.timer);
      this.strings = newStrings;
      this.strIdx = 0;
      this.charIdx = 0;
      this.isDeleting = false;
      if (this.el) {
        this.el.textContent = '';
      }
      var self = this;
      this.timer = setTimeout(function () {
        self.tick();
      }, 200);
    },

    init: function () {
      this.el = document.getElementById('typed-designation');
      if (!this.el) return;
      var self = this;
      this.timer = setTimeout(function () {
        self.tick();
      }, this.startDelay);
    }
  };

  // Expose function for i18n switcher to update the typed titles on the fly
  window.updateTypedText = function (newStrings) {
    typewriter.updateStrings(newStrings);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  function init() {
    initVideo();
    typewriter.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
