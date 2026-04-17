document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 'home';
  const desktop = () => window.matchMedia('(min-width: 768px)').matches;

  // Mobile: show bottom bar only after Gen II card has scrolled past
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
  }

  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      switchPage(el.dataset.page);
    });
  });

  switchPage('home');
});
