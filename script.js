document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 'home';
  const desktop = () => window.matchMedia('(min-width: 768px)').matches;
  const pages = ['home', 'experience', 'contact'];
  const pageNextBtn = document.getElementById('page-next-btn');
  const pageNextLabel = document.getElementById('page-next-label');

  function getNextPage(current) {
    return pages[(pages.indexOf(current) + 1) % pages.length];
  }

  function updateNextBtn(pageId) {
    if (pageNextLabel) {
      const next = getNextPage(pageId);
      pageNextLabel.textContent = next.charAt(0).toUpperCase() + next.slice(1);
    }
  }

  let transitioning = false;

  function doCircleTransition(nextPage) {
    if (transitioning) return;
    transitioning = true;

    const btnCircle = document.querySelector('.page-next-circle');
    const rect = btnCircle.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxR = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    ) + 50;

    const nextEl = document.getElementById('page-' + nextPage);

    // Hide only the label during transition so the circle stays visible
    if (pageNextLabel) pageNextLabel.style.opacity = '0';

    document.querySelectorAll('.page').forEach(p => {
      p.style.transition = 'none';
      if (p !== nextEl) p.style.zIndex = '1';
    });

    // Position the next page without revealing it yet (opacity still 0 from CSS)
    nextEl.style.transform = 'translateY(0)';
    nextEl.style.zIndex = '98';

    requestAnimationFrame(() => {
      // Set clip AND opacity in the same frame — page is never visible without a clip
      nextEl.style.clipPath = `circle(0px at ${cx}px ${cy}px)`;
      nextEl.style.opacity = '1';

      requestAnimationFrame(() => {
        nextEl.style.transition = 'clip-path 0.75s cubic-bezier(0.65, 0, 0.35, 1)';
        nextEl.style.clipPath = `circle(${maxR}px at ${cx}px ${cy}px)`;

      setTimeout(() => {
        document.querySelectorAll('.page').forEach(p => {
          if (p !== nextEl) { p.classList.remove('active'); p.style.zIndex = ''; }
        });
        nextEl.classList.add('active');
        nextEl.style.opacity = '';
        nextEl.style.transform = '';
        nextEl.style.clipPath = '';
        nextEl.style.zIndex = '';
        nextEl.style.transition = '';

        document.body.classList.toggle('page-contact', nextPage === 'contact');
        document.querySelectorAll('.nav-links a, .nav-home').forEach(a => {
          a.classList.toggle('active', a.dataset.page === nextPage);
        });
        currentPage = nextPage;
        updateNextBtn(nextPage);

        // Restore label with updated text
        if (pageNextLabel) pageNextLabel.style.opacity = '';

        requestAnimationFrame(() => {
          document.querySelectorAll('.page').forEach(p => p.style.transition = '');
          transitioning = false;
        });
      }, 780);
    }));
  }

  if (pageNextBtn) {
    pageNextBtn.addEventListener('click', () => {
      if (desktop()) {
        doCircleTransition(getNextPage(currentPage));
      } else {
        switchPage(getNextPage(currentPage));
      }
    });
  }

  // Mobile: show bottom bar only after Allied Universal card has scrolled past
  const mobileBar = document.querySelector('.mobile-bottom-bar');
  const genIICard = document.querySelectorAll('#page-experience .work-item')[1];
  if (mobileBar && genIICard) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        mobileBar.classList.add('bar-visible');
        observer.disconnect();
      }
    }, { threshold: 0 });
    observer.observe(genIICard);
  }

  function switchPage(pageId) {
    const targetPage = document.getElementById('page-' + pageId);

    if (desktop()) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      if (targetPage) targetPage.classList.add('active');
      document.body.classList.toggle('page-contact', pageId === 'contact');
      window.scrollTo(0, 0);
    } else {
      if (targetPage) targetPage.scrollIntoView({ behavior: 'smooth' });
    }

    document.querySelectorAll('.nav-links a, .nav-home').forEach(a => {
      a.classList.toggle('active', a.dataset.page === pageId);
    });

    currentPage = pageId;
    updateNextBtn(pageId);
  }

  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      switchPage(el.dataset.page);
    });
  });

  switchPage('home');
});
