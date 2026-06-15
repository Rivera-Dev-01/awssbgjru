/* Members page - sidebar navigation & interactions */

document.addEventListener('DOMContentLoaded', () => {
  initSidebarNav();
  initSearchInput();
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

      sidebarItems.forEach(i => {
        i.classList.remove('active');
        const img = i.querySelector('.sidebar-nav-icon');
        const ds = i.dataset.section;
        const prefix = ds === 'associates' ? 'Associate' : ds.charAt(0).toUpperCase() + ds.slice(1);
        img.src = `../assets/members/badges/${prefix}-Inactive-State-Badge.png`;
      });

      item.classList.add('active');
      const activeImg = item.querySelector('.sidebar-nav-icon');
      const activeDs = item.dataset.section;
      const activePrefix = activeDs === 'associates' ? 'Associate' : activeDs.charAt(0).toUpperCase() + activeDs.slice(1);
      activeImg.src = `../assets/members/badges/${activePrefix}-Active-State-Badge.png`;
    });
  });
}

function initSearchInput() {
  const searchInput = document.querySelector('.hero-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    // reserved for future search/filter functionality
  });
}
