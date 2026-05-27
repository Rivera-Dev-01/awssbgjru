// Navigation component

document.addEventListener('DOMContentLoaded', () => {
  // Load dynamic header
  loadComponent('header-placeholder', '../components/header.html')
    .then(() => {
      highlightActiveLink();
    });

  // Load dynamic footer
  loadComponent('footer-placeholder', '../components/footer.html');
});


function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (!href) return;

    // Extract file names for comparison
    const currentPageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const targetPageName = href.substring(href.lastIndexOf('/') + 1);

    // Standardize Home matching (handles index.html, landingPage.html, or root /)
    const isCurrentHome = currentPageName === '' || currentPageName === 'index.html' || currentPageName === 'landingPage.html';
    const isTargetHome = targetPageName === 'index.html' || targetPageName === 'landingPage.html';

    if ((isCurrentHome && isTargetHome) || currentPageName === targetPageName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}