document.addEventListener('DOMContentLoaded', function () {

  /* ── Sticky nav ─────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── Mobile menu ────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  if (hamburger && mobileMenu && mobileClose) {
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMenu() {
      mobileMenu.classList.add('open');
      document.body.classList.add('menu-open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    hamburger.addEventListener('click', openMenu);
    mobileClose.addEventListener('click', closeMenu);

    // Close when tapping any menu link
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Ensure "Book a Clean" also closes the menu (it is a link but not included in mobileLinks)
    const mobileBookLinks = document.querySelectorAll('#mobileMenu a.btn');
    mobileBookLinks.forEach(link => link.addEventListener('click', closeMenu));
  }

  /* ── Scroll reveal ──────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ── Contact form (Formspree) ───────────────── */
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (form && statusEl && submitBtn) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Basic validation
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#e07070';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Please fill in all required fields.';
        return;
      }

      // Disable button during submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      statusEl.className = 'form-status';
      statusEl.textContent = '';

      try {
        const response = await fetch('https://formspree.io/f/xlgkbnkl', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });

        if (response.ok) {
          statusEl.className = 'form-status success';
          statusEl.textContent = "✓ Message sent! We'll get back to you within one business day.";
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Something went wrong. Please email us at info@backgen.co.za or call +27 60 565 0595.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message →';
      }
    });
  }

  /* ── Animated efficiency dial ───────────────── */
  const dialFill = document.querySelector('.dial-arc .fill');
  if (dialFill) {
    const dialObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Animate from full (440=0%) to target (132=70%)
          dialFill.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)';
          dialFill.style.strokeDashoffset = '132';
          dialObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    // Start at "empty" for animation
    dialFill.style.strokeDashoffset = '440';

    const dialEl = document.querySelector('.efficiency-dial');
    if (dialEl) {
      dialObserver.observe(dialEl);
    }
  }

});

