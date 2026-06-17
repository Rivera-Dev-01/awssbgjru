/* Members page - sidebar navigation & interactions */

document.addEventListener('DOMContentLoaded', () => {
  initSidebarNav();
  initSearchInput();
  initIntersectionObserver();
  initFooterObserver(); // New observer to check for footer intersection
});

function initSidebarNav() {
  const sidebarItems = document.querySelectorAll('.sidebar-nav-item');
  if (!sidebarItems.length) return;

  const sectionMap = {
    members: 'section-hero',
    founders: 'section-founders',
    executives: 'section-executives',
    associates: 'section-associates'
  };

  sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      const section = item.dataset.section;
      const targetId = sectionMap[section];
      if (targetId) {
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function initIntersectionObserver() {
  const sections = document.querySelectorAll('.snap-section');
  const sidebarItems = document.querySelectorAll('.sidebar-nav-item');
  if (!sections.length) return;

  const sectionMap = {
    'section-hero': 'members',
    'section-founders': 'founders',
    'section-executives': 'executives',
    'section-associates': 'associates'
  };

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger when section occupies the center of viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeSectionId = entry.target.id;
        
        // Toggle active class on sections
        sections.forEach(s => {
          if (s.id === activeSectionId) {
            s.classList.add('active-section');
          } else {
            s.classList.remove('active-section');
          }
        });

        // Update sidebar active indicator and badge states
        const activeNavKey = sectionMap[activeSectionId];
        sidebarItems.forEach(item => {
          const ds = item.dataset.section;
          const prefix = ds === 'associates' ? 'Associate' : ds.charAt(0).toUpperCase() + ds.slice(1);
          const img = item.querySelector('.sidebar-nav-icon');

          if (ds === activeNavKey) {
            item.classList.add('active');
            if (img) img.src = `../assets/members/badges/${prefix}-Active-State-Badge.png`;
          } else {
            item.classList.remove('active');
            if (img) img.src = `../assets/members/badges/${prefix}-Inactive-State-Badge.png`;
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

function initFooterObserver() {
  const footer = document.getElementById('footer-placeholder');
  const sidebar = document.querySelector('.members-sidebar');
  if (!footer || !sidebar) return;

  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sidebar.classList.add('at-footer');
      } else {
        sidebar.classList.remove('at-footer');
      }
    });
  }, {
    root: null,
    threshold: 0,
    rootMargin: '0px 0px -35px 0px' // Trigger when footer is within 35px of viewport bottom
  });

  footerObserver.observe(footer);
}

function initSearchInput() {
  const searchInput = document.querySelector('.hero-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    // reserved for future search/filter functionality
  });
}
