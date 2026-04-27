// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Subtle scroll-reveal for sections (skipped when reduced motion is preferred)
const prefersReduced = typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('.section, .feature, .step, .stat-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .7s ease, transform .7s ease';
    io.observe(el);
  });
}

// Smooth-scroll a11y: move focus to anchor target so screen-reader/keyboard
// users land on the right section, not back at the top of the document.
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', () => {
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        target.setAttribute('tabindex', '-1');
        setTimeout(() => {
          try { target.focus({ preventScroll: true }); } catch (_) { target.focus(); }
        }, 0);
      }
    }
  });
});
