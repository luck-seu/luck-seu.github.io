/* ============================================
   LUCK Research Group — Scripts
   多页面切换 · 导航交互 · 成果筛选
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- DOM refs ----------
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const allNavAnchors = document.querySelectorAll('[data-nav]');
  const pages = document.querySelectorAll('.page');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const resultStrips = document.querySelectorAll('.result-strip');

  // ---------- Page Switching ----------
  function switchPage(pageName, scrollTarget) {
    // Hide all pages, show target
    pages.forEach(p => p.classList.remove('active'));
    const target = document.querySelector(`.page[data-page="${pageName}"]`);
    if (target) target.classList.add('active');

    // Update nav active state
    allNavAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-nav') === pageName);
    });

    // Scroll to top or specific target
    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({behavior:'smooth',block:'center'});
      }, 150);
    } else {
      window.scrollTo({top:0,behavior:'smooth'});
    }

    // Close mobile nav
    navLinks?.classList.remove('mobile-open');
    if (navToggle) navToggle.innerHTML = '<i data-lucide="menu"></i>';
    window.lucide?.createIcons();
  }

  // Nav click handlers
  allNavAnchors.forEach(a => {
    a.addEventListener('click', e => {
      const pageName = a.getAttribute('data-nav');
      if (!pageName) return;
      e.preventDefault();
      switchPage(pageName);
    });
  });

  // Direction summary box clicks (home → directions page with scroll target)
  document.querySelectorAll('.ds-card[data-goto]').forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-goto');
      switchPage('directions', targetId);
    });
  });

  // ---------- Mobile Nav Toggle ----------
  navToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('mobile-open');
    navToggle.innerHTML = open
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';
    window.lucide?.createIcons();
  });

  // ---------- Navbar scroll effect ----------
  const onScroll = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();

  // ---------- Result Filter ----------
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      resultStrips.forEach(strip => {
        strip.hidden = filter !== 'all' && strip.dataset.type !== filter;
      });
    });
  });

  // ---------- Footer Year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Init Icons ----------
  window.lucide?.createIcons();

});
